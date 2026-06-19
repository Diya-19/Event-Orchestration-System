from sqlalchemy.orm import Session
from app.db import engine
from app.models import Participant, Event

def seed_participants():
    with Session(engine) as session:
        # Step 1: Check if any event exists, if not create one
        existing_event = session.query(Event).first()
        
        if not existing_event:
            # Create event with minimal required fields
            event = Event(name="HackFlow 2026")
            session.add(event)
            session.commit()
            event_id = event.id
            print(f"✅ Created event: HackFlow 2026 (ID: {event_id})")
        else:
            event_id = existing_event.id
            print(f"ℹ️  Using existing event (ID: {event_id})")
        
        # Step 2: Create participant with event_id
        existing_participant = session.query(Participant).filter_by(email="john@example.com").first()
        
        if not existing_participant:
            participant = Participant(
                email="john@example.com",
                name="John Doe",
                portal_token="123456789",
                event_id=event_id
            )
            session.add(participant)
            session.commit()
            participant_id = participant.id
            print(f"✅ Created participant: john@example.com (ID: {participant_id})")
            print(f"🔑 Portal Token: 123456789")
        else:
            participant_id = existing_participant.id
            print(f"ℹ️  Participant already exists: john@example.com (ID: {participant_id})")
        
        print("\n🎉 Seeding complete! You can now login.")

if __name__ == "__main__":
    seed_participants()