from sqlalchemy.orm import Session
from app.db import engine
from app.models import Participant, Team, TeamMember

with Session(engine) as session:
    # Find the test participant
    participant = session.query(Participant).filter_by(email="john@example.com").first()
    
    if not participant:
        print("❌ Participant john@example.com not found")
        exit()
    
    print(f"✅ Found participant: {participant.name} (ID: {participant.id})")
    
    # Check if already in a team
    existing_tm = session.query(TeamMember).filter_by(participant_id=participant.id).first()
    
    if existing_tm:
        # Update existing team
        team = session.query(Team).filter_by(id=existing_tm.team_id).first()
        if team:
            team.is_qualified_round_3 = True
            session.commit()
            print(f"✅ Updated team '{team.name}' - Round 3 qualified!")
        else:
            print("❌ Team not found")
    else:
        # Create a new team
        team = Team(
            name="Team Alpha",
            event_id=participant.event_id,
            is_qualified_round_3=True
        )
        session.add(team)
        session.commit()
        
        # Add participant to team
        tm = TeamMember(
            team_id=team.id,
            participant_id=participant.id
        )
        session.add(tm)
        session.commit()
        print(f"✅ Created team 'Team Alpha' and added participant!")
        print(f"✅ Team ID: {team.id}")
    
    print("\n🎉 Fix complete! Refresh your browser and Travel should work now!")