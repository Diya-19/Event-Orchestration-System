import os
import uuid
import requests
from datetime import datetime, timezone
from app.celery_app import celery_app
from sqlalchemy.orm import Session
from sqlalchemy import select
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.db import SessionLocal
from app.models import (
    Event, Team, Participant, TeamMember, 
    ApprovalRequest, CommunicationLog
)

# Helper to ping the FastAPI broadcast endpoint
def trigger_ws_broadcast(event_id: str, event_type: str):
    try:
        url = f"http://127.0.0.1:8000/api/events/{event_id}/scores/broadcast-consolidation"
        requests.post(url, json={"event": event_type}, timeout=3)
    except Exception as e:
        print(f"Broadcast failed: {e}")

# ==========================================
# 1. TEAM FORMATION TASK
# ==========================================
@celery_app.task(name="send_welcome_emails_task", bind=True, max_retries=3)
def send_welcome_emails_task(self, event_id_str: str, approval_id_str: str):
    db: Session = SessionLocal()
    try:
        event = db.get(Event, uuid.UUID(event_id_str))
        approval = db.get(ApprovalRequest, uuid.UUID(approval_id_str))
        
        # Get all participants and their teams for this event
        query = (
            select(Participant, Team.name)
            .join(TeamMember, TeamMember.participant_id == Participant.id)
            .join(Team, Team.id == TeamMember.team_id)
            .where(Participant.event_id == event.id)
        )
        results = db.execute(query).all()

        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY', 'dummy_key'))
        
        for row in results:
            p, team_name = row
            subject = f"Welcome to {event.name} - Team {team_name}"
            content = f"Hi {p.name},<br>You have been assigned to team <b>{team_name}</b>. Good luck!"
            
            # Simulation/SendGrid Call
            print(f"Sending welcome to {p.email} for team {team_name}")
            
        trigger_ws_broadcast(event_id_str, "TEAM_FORMATION_COMPLETE")
        return f"Welcome emails sent to {len(results)} participants."
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()

# ==========================================
# 2. PROGRESSION INVITATIONS TASK
# ==========================================
@celery_app.task(name="send_progression_invitations_task", bind=True, max_retries=3)
def send_progression_invitations_task(self, event_id_str: str, approval_id_str: str):
    db: Session = SessionLocal()
    try:
        event = db.get(Event, uuid.UUID(event_id_str))
        # Logic: Notify all participants that the event has moved to a new stage
        participants = db.execute(select(Participant).where(Participant.event_id == event.id)).scalars().all()
        
        for p in participants:
            print(f"Notifying {p.email} of progression to {event.current_stage}")

        trigger_ws_broadcast(event_id_str, "STAGE_UPDATED")
        return f"Progression notices sent to {len(participants)} people."
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()

# ==========================================
# 3. RESULTS PUBLISH TASK
# ==========================================
@celery_app.task(name="publish_results_task", bind=True, max_retries=3)
def publish_results_task(self, event_id_str: str, approval_id_str: str):
    db: Session = SessionLocal()
    try:
        event = db.get(Event, uuid.UUID(event_id_str))
        if not event: return "Event not found."

        # 1. Update Event Status
        event.current_stage = "completed"
        
        # 2. Fetch Winners for email context
        winners = db.execute(
            select(Team).where(Team.event_id == event.id, Team.rank <= 3).order_by(Team.rank)
        ).scalars().all()
        
        # 3. Commit and Broadcast
        db.commit()
        trigger_ws_broadcast(event_id_str, "SCORES_CONSOLIDATED")
        
        return f"Results published for {event.name}. Stage set to completed."
    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()