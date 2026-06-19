from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import get_db

from app.models.participant import Participant
from app.models.team import Team
from app.models.travel import TeamTravel, TravelReimbursementClaim
from app.models.team_member import TeamMember
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_travel_logistics(db: Session = Depends(get_db)):

    teams = (
        db.query(
            Team.id,
            Team.name,
            TeamTravel.travel_status,
            TeamTravel.accommodation_assigned,
            TravelReimbursementClaim.status.label("reimbursement_status"),
            func.count(TeamMember.id).label("members_count")
        )
        .outerjoin(TeamTravel, TeamTravel.team_id == Team.id)
        .outerjoin(
            TravelReimbursementClaim,
            TravelReimbursementClaim.team_id == Team.id
        )
        .outerjoin(
            TeamMember,
            TeamMember.team_id == Team.id
        )
        .group_by(
            Team.id,
            Team.name,
            TeamTravel.travel_status,
            TeamTravel.accommodation_assigned,
            TravelReimbursementClaim.status
        )
        .all()
    )

    result = []

    for team in teams:
        result.append({
            "team_id": str(team.id),
            "team_name": team.name,
            "travel_status": (team.travel_status if team.travel_status else "Not Submitted"),
            "hotel_status": (
                "Assigned"
                if team.accommodation_assigned
                else "Not Assigned"
            ),
            "reimbursement_status": (
                team.reimbursement_status
                if team.reimbursement_status
                else "Not Submitted"
            ),
            "members_count": team.members_count
        })

    return result


@router.get("/{team_id}")
def get_team_details(
    team_id: str,
    db: Session = Depends(get_db)
):
    team = (
        db.query(Team)
        .filter(Team.id == team_id)
        .first()
    )

    if not team:
        return {"error": "Team not found"}

    travel = (
        db.query(TeamTravel)
        .filter(TeamTravel.team_id == team.id)
        .first()
    )

    reimbursement = (
        db.query(TravelReimbursementClaim)
        .filter(TravelReimbursementClaim.team_id == team.id)
        .first()
    )

    participants = (
        db.query(
            Participant.name,
            Participant.email,
            TeamMember.role
        )
        .join(
            TeamMember,
            TeamMember.participant_id == Participant.id
        )
        .filter(
            TeamMember.team_id == team.id
        )
        .all()
    )

    return {
        "team_id": str(team.id),
        "team_name": team.name,

        "travel_details": {
            "mode": "Flight/Train",
            "airline": None,
            "flightNo": travel.flight_or_train_number if travel else None,
            "from": travel.departure_airport_or_station if travel else None,
            "to": travel.arrival_airport_or_station if travel else None,
            "arrival": (
                f"{travel.arrival_date} {travel.arrival_time}"
                if travel and travel.arrival_date
                else None
            ),
            "pnr": travel.pnr_number if travel else None,
            "ticketFile": (
                travel.combined_ticket_name
                if travel
                else None
            )
        },

        "eventSchedule": [
            {
                "date": "20 Jun 2026",
                "label": "Team Check-in",
                "time": "10:00 AM"
            },
            {
                "date": "21 Jun 2026",
                "label": "Hackathon Day 1",
                "time": "09:00 AM"
            },
            {
                "date": "22 Jun 2026",
                "label": "Hackathon Day 2",
                "time": "09:00 AM"
            }
        ],

        "hotelDetails": {
            "assigned": (
                travel.accommodation_assigned
                if travel
                else False
            ),
            "name": (
                travel.hotel_name
                if travel
                else None
            ),
            "roomType": "Standard",
            "checkIn": (
                travel.hotel_checkin_time
                if travel
                else None
            ),
            "checkOut": None,
            "rooms": 1,
            "roomNumbers": (
                travel.hotel_room_number
                if travel
                else None
            )
        },

        "participants": [
            {
                "name": p.name,
                "email": p.email,
                "role": (
                    "Team Lead"
                    if p.role.lower() == "leader"
                    else "Member"
                )
            }
            for p in participants
        ],

        "reimbursementDetails": {
            "amount": (
                f"₹ {float(reimbursement.claim_amount)}"
                if reimbursement and reimbursement.claim_amount
                else "₹ 0"
            ),
            "submittedOn": (
                str(reimbursement.submitted_at.date())
                if reimbursement and reimbursement.submitted_at
                else None
            ),
            "file": (
                "reimbursement.pdf"
                if reimbursement
                else None
            )
        }
    }