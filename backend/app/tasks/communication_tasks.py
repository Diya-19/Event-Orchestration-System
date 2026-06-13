import os
import uuid
from datetime import datetime, timezone
from app.celery_app import celery_app
from celery.exceptions import Retry
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.websocket_manager import manager

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from python_http_client.exceptions import HTTPError

from app.db import SessionLocal
from app.models import (
    Communication, CommunicationLog, Participant, 
    Evaluator, TeamMember, Team, Event
)

def render_template(template: str, context: dict) -> str:
    """Replaces {{placeholders}} with context values."""
    rendered = template
    for key, value in context.items():
        rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
    return rendered

# ==========================================
# RECIPIENT ROUTING STRATEGIES
# ==========================================

def get_participant_recipients(db: Session, event: Event) -> list:
    """
    Optimized Fetch: Uses SQL JOINs to get Participant and Team Name 
    in a SINGLE query. Eliminates the N+1 SELECT bottleneck.
    """
    query = (
        select(Participant, Team.name.label("team_name"))
        .outerjoin(TeamMember, TeamMember.participant_id == Participant.id)
        .outerjoin(Team, Team.id == TeamMember.team_id)
        .where(Participant.event_id == event.id)
    )
    
    rows = db.execute(query).all()
    
    return [{
        "email": row.Participant.email,
        "name": row.Participant.name,
        "context": {
            "name": row.Participant.name, 
            "event_name": event.name, 
            "team_name": row.team_name or "Unassigned"
        }
    } for row in rows]

def get_judge_recipients(db: Session, event: Event) -> list:
    evaluators = db.execute(select(Evaluator).where(Evaluator.event_id == event.id)).scalars().all()
    return [{
        "email": e.email,
        "name": e.name,
        "context": {
            "name": e.name, 
            "event_name": event.name, 
            "action_link": f"https://portal.yourdomain.com/evaluate/{event.id}"
        }
    } for e in evaluators]

def get_mentor_recipients(db: Session, event: Event) -> list:
    # Placeholder: Your database currently doesn't have a mentors table!
    # return db.execute(select(Mentor)...)
    raise NotImplementedError("Mentor routing is not yet implemented in the database schema.")

# The Routing Dictionary (Strategy Pattern)
RECIPIENT_STRATEGIES = {
    "Participants": get_participant_recipients,
    "Participants (120)": get_participant_recipients, # Catching the frontend's static dropdown label
    "Judges": get_judge_recipients,
    "Mentors": get_mentor_recipients
}

# ==========================================
# MAIN CELERY TASK
# ==========================================

@celery_app.task(name="draft_and_send_emails_task", bind=True, max_retries=3)
async def draft_and_send_emails_task(self, event_id_str: str, approval_id_str: str = None):
    db: Session = SessionLocal()
    
    try:
        # 1. Fetch the Communication Record
        if approval_id_str:
            comm = db.execute(
                select(Communication).where(Communication.approval_id == uuid.UUID(approval_id_str))
            ).scalars().first()
        else:
            comm = db.get(Communication, uuid.UUID(event_id_str))

        if not comm:
            return "Communication record not found."

        # 2. Check the Schedule
        now = datetime.now(timezone.utc)
        if comm.scheduled_for and comm.scheduled_for > now:
            comm.status = "scheduled"
            db.commit()
            raise self.retry(eta=comm.scheduled_for)

        comm.status = "sending"
        db.commit()
            
        event = db.get(Event, comm.event_id)
        
        # 3. Dynamic Recipient Routing
        fetch_strategy = RECIPIENT_STRATEGIES.get(comm.recipient_type)
        
        if not fetch_strategy:
            comm.status = "failed"
            db.commit()
            return f"Error: Unknown recipient type '{comm.recipient_type}'"
            
        recipients = fetch_strategy(db, event)

        # 4. Render Templates & Bulk Create Logs (N+1 INSERT Fix)
        # We use standard object creation and db.add_all(), which in SQLAlchemy 2.0
        # automatically utilizes optimized batched 'insertmanyvalues' under the hood.
        logs = []
        for r in recipients:
            logs.append(CommunicationLog(
                communication_id=comm.id,
                recipient_email=r["email"],
                recipient_name=r["name"],
                personalized_body=render_template(comm.body_template, r["context"]),
                status="queued"
            ))
            
        db.add_all(logs)
        db.flush() # Flushes batch to DB to generate UUIDs for logs, but keeps transaction open

        # 5. Dispatch to SendGrid
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY', 'dummy_key'))
        from_email = os.environ.get('FROM_EMAIL', 'agrawaldiya80@gmail.com')
        api_key = os.environ.get('SENDGRID_API_KEY')
        safe_key = f"{api_key[:5]}...[length:{len(api_key)}]" if api_key else "None"
        print(f"\n--- DEBUG: Celery is using API Key: {safe_key} ---\n")
        print(f"--- DEBUG: Sending FROM: {from_email} ---\n")
        success_count = 0
        
        for log in logs:
            try:
                message = Mail(
                    from_email=from_email,
                    to_emails=log.recipient_email,
                    subject=comm.subject,
                    html_content=log.personalized_body
                )
                response = sg.send(message)
                log.sendgrid_message_id = response.headers.get('X-Message-Id')
                
                # Simulation for current dev environment:
                log.status = "sent" 
                log.sendgrid_message_id = f"sim_sg_{uuid.uuid4().hex[:8]}"
                success_count += 1
            
            except HTTPError as e:
                log.status = "failed"
                # This will extract the actual JSON error message from SendGrid
                error_details = e.body.decode('utf-8') if e.body else str(e)
                log.error = error_details
                
                print(f"\n--- SENDGRID REJECTED THE EMAIL ---")
                print(f"Recipient: {log.recipient_email}")
                print(f"Reason: {error_details}\n")
                
            except Exception as e:
                log.status = "failed"
                log.error = str(e)
                print(f"Failed to send email to {log.recipient_email}: {log.error}")
                
        # 6. Finalize
        #comm.status = "sent"
        #db.commit() # Commits the logs and the final comm.status in one go
        
        comm.status = "dispatched" # Changed from "sent"
        db.commit() 
        
        # We broadcast that the batch has started processing, but NOT that it's delivered
        # (Assuming you have a websocket manager imported)
        #
        await manager.broadcast(f"/ws/events/{comm.event_id}/dashboard", {
            "event": "emails_dispatched",
            "payload": {"communication_id": str(comm.id), "status": "dispatched"}
        })
    
        
        return f"Dispatched {success_count}/{len(recipients)} emails successfully."
        
    except Retry:
        raise
    except NotImplementedError as nie:
        # Catch our specific strategy errors
        db.rollback()
        if 'comm' in locals():
            comm.status = "failed"
            db.commit()
        return str(nie)
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()