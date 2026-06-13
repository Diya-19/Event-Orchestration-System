import uuid
from app.celery_app import celery_app
from sqlalchemy.orm import Session
from sqlalchemy import select


# Adjust these imports based on your exact project structure
from app.db import SessionLocal 
from app.models import Team, Evaluation, Event, ActivityLog

@celery_app.task(name="consolidate_scores_task", bind=True, max_retries=3)
def consolidate_scores_task(self, event_id_str: str):
    """
    Background task to calculate final scores, assign ranks, 
    and update team statuses for an event.
    """
    event_id = uuid.UUID(event_id_str)
    db: Session = SessionLocal()
    
    try:
        # 1. Verify Event Exists
        event = db.get(Event, event_id)
        if not event:
            return f"Event {event_id_str} not found. Task aborted."

        # 2. Fetch all teams for this event
        teams = db.execute(
            select(Team).where(Team.event_id == event_id)
        ).scalars().all()

        if not teams:
            return "No teams found for consolidation."
        
        teams.sort(key=lambda t: float(t.final_score or 0), reverse=True)

        # 3. Calculate Final Scores for each team
        for team in teams:
            evaluations = db.execute(
                select(Evaluation).where(Evaluation.team_id == team.id)
            ).scalars().all()

            valid_scores = [float(e.overall) for e in evaluations if e.overall is not None]

            if valid_scores:
                avg_score = sum(valid_scores) / len(valid_scores)
                team.final_score = round(avg_score, 2)
            else:
                team.final_score = 0.00
                
            team.status = "evaluated"

        # 4. Rank the Teams (Handling Ties)
        teams.sort(key=lambda t: float(t.final_score or 0), reverse=True)

        current_rank = 1
        for idx, team in enumerate(teams):
            if idx > 0 and team.final_score == teams[idx - 1].final_score:
                team.rank = teams[idx - 1].rank
            else:
                team.rank = current_rank
            
            current_rank += 1

        # 5. Log the Activity
        db.add(ActivityLog(
            event_id=event_id,
            actor="system_celery",
            action="scores_consolidated",
            details={"total_teams_processed": len(teams)}
        ))

        # 6. Commit the transaction
        db.commit()

        # 7. --- TRIGGER THE WEBSOCKET BROADCAST ---
        try:
            # Ping the FastAPI server so IT handles the websocket broadcast
            # (Adjust localhost:8000 if your backend runs on a different port)
            webhook_url = f"http://127.0.0.1:8000/api/events/{event_id_str}/scores/broadcast-consolidation"
            requests.post(webhook_url, timeout=3)
        except Exception as ws_err:
            # We catch the exception so if the webhook fails, the celery task doesn't crash 
            # and retry the database commit loop again.
            print(f"Warning: Database succeeded, but broadcast ping failed: {ws_err}")

        return f"Consolidation complete. {len(teams)} teams scored and ranked."

    except Exception as exc:
        db.rollback()
        raise self.retry(exc=exc, countdown=60)
    finally:
        db.close()