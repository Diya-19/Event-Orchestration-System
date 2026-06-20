from fastapi import APIRouter, Request, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db import get_db
from app.models import CommunicationLog, Communication
from app.websocket_manager import manager 

router = APIRouter()

@router.post("/sendgrid-events")
async def sendgrid_webhook(
    request: Request, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    """
    SendGrid posts an array of events here.
    We pass it to a background task so we can immediately return 200 OK 
    to SendGrid (required by their API rules).
    """
    events = await request.json()
    background_tasks.add_task(process_sendgrid_events, events, db)
    return {"status": "accepted"}

async def process_sendgrid_events(events: list, db: Session):
    for event in events:
        event_type = event.get("event") # e.g., 'delivered', 'bounce', 'dropped'
        msg_id_full = event.get("sg_message_id")
        
        if not msg_id_full:
            continue

        # 🚨 CRITICAL GOTCHA: SendGrid appends extra characters to the message ID in webhooks!
        # The API returns 'Message-Id', but the webhook returns 'Message-Id.filter'. 
        # You MUST split by the dot to match your database record.
        sg_msg_id = msg_id_full.split('.')[0]

        # 1. Find the specific log entry
        log = db.execute(
            select(CommunicationLog).where(CommunicationLog.sendgrid_message_id.startswith(sg_msg_id))
        ).scalars().first()

        if log:
            # 2. Update the status based on the real-world event
            if event_type == "delivered":
                log.status = "delivered"
            elif event_type in ["bounce", "dropped", "deferred"]:
                log.status = "failed"
                log.error = f"SendGrid Event: {event_type} - {event.get('reason', 'Unknown reason')}"
            
            db.commit()

            # 3. Fire the real-time WebSocket Broadcast
            # Fetch parent comm to get the event_id for the socket room routing
            comm = db.get(Communication, log.communication_id)
            
            if comm:
                await manager.broadcast(
                    room=f"/ws/events/{comm.event_id}/dashboard",
                    message={
                        "event": "email_status_updated",
                        "payload": {
                            "communication_id": str(comm.id),
                            "recipient": log.recipient_email,
                            "status": log.status,
                            "timestamp": event.get("timestamp")
                        }
                    }
                )

                # 4. Optional: Check if the whole batch is finished
                check_and_update_batch_status(db, comm)
                
                
def check_and_update_batch_status(db: Session, comm: Communication):
    """Checks if all logs for a communication are resolved, and updates the parent."""
    # Count how many logs are still pending/dispatched
    pending_count = db.query(CommunicationLog).filter(
        CommunicationLog.communication_id == comm.id,
        CommunicationLog.status.in_(["queued", "dispatched"])
    ).count()

    if pending_count == 0:
        comm.status = "completed" # All emails are either delivered or failed
        db.commit()
        
        # Broadcast the final stage transition
        manager.broadcast_sync(
            room=f"/ws/events/{comm.event_id}/dashboard",
            message={
                "event": "batch_emails_completed",
                "payload": {"communication_id": str(comm.id)}
            }
        )