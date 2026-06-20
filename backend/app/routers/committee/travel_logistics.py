from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from app.db import get_db

from app.models.participant import Participant
from app.models.team import Team
from app.models.event import Event
from app.models.travel import TeamTravel, TravelReimbursementClaim
from app.models.team_member import TeamMember
from app.models.travel_query import TravelQuery
from app.models.notification import Notification

router = APIRouter()

@router.get("/")
def get_travel_logistics(event_id: str = None, db: Session = Depends(get_db)):

    query = db.query(
        Team.id,
        Team.name,
        TeamTravel.travel_status,
        TeamTravel.accommodation_assigned,
        TeamTravel.is_locked,
        TravelReimbursementClaim.status.label("reimbursement_status"),
        func.count(TeamMember.id).label("members_count")
    )
    
    if event_id:
        query = query.filter(Team.event_id == event_id)

    teams = (
        query.outerjoin(TeamTravel, TeamTravel.team_id == Team.id)
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
            TeamTravel.is_locked,
            TravelReimbursementClaim.status
        )
        .all()
    )

    result = []

    for team in teams:
        result.append({
            "team_id": str(team.id),
            "team_name": team.name,
            "is_locked": team.is_locked if team.is_locked else False,
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


@router.get("/queries")
def get_all_travel_queries(event_id: str = None, db: Session = Depends(get_db)):
    query = db.query(
        TravelQuery.id,
        TravelQuery.category,
        TravelQuery.subject,
        TravelQuery.message,
        TravelQuery.status,
        TravelQuery.conversation,
        TravelQuery.created_at,
        TravelQuery.updated_at,
        Participant.name.label("participant_name"),
        Team.name.label("team_name"),
        Team.event_id
    ).join(
        Participant, Participant.id == TravelQuery.participant_id
    ).join(
        Team, Team.id == TravelQuery.team_id
    )

    if event_id:
        query = query.filter(Team.event_id == event_id)

    queries = query.order_by(TravelQuery.created_at.desc()).all()

    return {
        "queries": [
            {
                "id": str(q.id),
                "category": q.category,
                "subject": q.subject,
                "message": q.message,
                "status": q.status,
                "conversation": q.conversation,
                "created_at": q.created_at.isoformat() if q.created_at else None,
                "updated_at": q.updated_at.isoformat() if q.updated_at else None,
                "participant_name": q.participant_name,
                "team_name": q.team_name,
            } for q in queries
        ]
    }

@router.patch("/queries/{query_id}/resolve")
def resolve_query(query_id: str, db: Session = Depends(get_db)):
    query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    
    query.status = "Resolved"
    db.commit()
    return {"message": "Query resolved"}

@router.patch("/queries/{query_id}/escalate")
def escalate_query(query_id: str, db: Session = Depends(get_db)):
    query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    
    query.status = "Escalated"
    db.commit()
    return {"message": "Query escalated"}


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

    event = db.query(Event).filter(Event.id == team.event_id).first()
    config = event.config or {} if event else {}
    travel_coordinator = config.get('travel_coordinator', {})
    travel_schedule = config.get('travel_schedule', [])

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

        "travelDetails": {
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
            ),
            "ticketUrl": (
                travel.combined_ticket_url
                if travel
                else None
            )
        },

        "preferences": {
            "need_airport_to_hotel_cab": travel.need_airport_to_hotel_cab if travel else False,
            "need_hotel_to_airport_cab": travel.need_hotel_to_airport_cab if travel else False,
            "need_accommodation": travel.need_accommodation if travel else False,
            "self_arranged_accommodation": travel.self_arranged_accommodation if travel else False
        },

        "eventSchedule": travel_schedule,
        "travelCoordinator": travel_coordinator,
        "participant_notes": travel.participant_notes if travel else None,

        "hotelDetails": {
            "assigned": travel.accommodation_assigned if travel else False,
            "name": travel.accommodation.get("hotel_name") if travel and travel.accommodation else (travel.hotel_name if travel else None),
            "address": travel.accommodation.get("hotel_address") if travel and travel.accommodation else (travel.hotel_address if travel else None),
            "mapsUrl": travel.accommodation.get("hotel_maps_url") if travel and travel.accommodation else None,
            "checkIn": travel.accommodation.get("check_in_date") if travel and travel.accommodation else (travel.hotel_checkin_time if travel else None),
            "checkOut": travel.accommodation.get("check_out_date") if travel and travel.accommodation else None,
            "specialInstructions": travel.accommodation.get("special_instructions") if travel and travel.accommodation else ""
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

        "is_locked": travel.is_locked if travel else False,

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
            "accountHolder": reimbursement.account_holder_name if reimbursement else None,
            "bankName": reimbursement.bank_name if reimbursement else None,
            "accountNumber": reimbursement.account_number if reimbursement else None,
            "ifsc": reimbursement.ifsc_code if reimbursement else None,
            "file": (
                reimbursement.receipts[0].get("file_name", "receipt.pdf")
                if reimbursement and reimbursement.receipts and len(reimbursement.receipts) > 0
                else None
            ),
            "receiptUrl": (
                reimbursement.receipts[0].get("file_url")
                if reimbursement and reimbursement.receipts and len(reimbursement.receipts) > 0
                else None
            )
        }
    }
class ReplyPayload(BaseModel):
    message: str

class HotelAssignmentRequest(BaseModel):
    hotel_name: str
    hotel_address: str
    hotel_maps_url: str
    check_in_date: str = ""
    check_out_date: str = ""
    special_instructions: str = ""

@router.post("/queries/{query_id}/reply")
def reply_to_travel_query(query_id: str, payload: ReplyPayload, db: Session = Depends(get_db)):
    query = db.query(TravelQuery).filter(TravelQuery.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Travel query not found")

    import datetime
    reply_msg = {
        "sender": "committee",
        "message": payload.message,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    current_conv = list(query.conversation) if query.conversation else []
    current_conv.append(reply_msg)
    query.conversation = current_conv
    query.status = "In Progress"

    # Generate Notification for the participant
    notification = Notification(
        participant_id=query.participant_id,
        team_id=query.team_id,
        title="Travel Query Updated",
        message=f"The committee has replied to your query: '{query.subject}'",
        category="Travel",
        notification_type="travel",
        query_id=query.id
    )
    db.add(notification)
    
    db.commit()
    return {"status": "success"}

@router.patch("/{team_id}/lock")
def lock_team_travel(
    team_id: str,
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    travel = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel:
        travel = TeamTravel(team_id=team.id, is_locked=True)
        db.add(travel)
    else:
        travel.is_locked = True
        
    db.commit()
    return {"success": True, "locked": True}

@router.patch("/{team_id}/unlock")
def unlock_team_travel(
    team_id: str,
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    travel = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if travel:
        travel.is_locked = False
        db.commit()
        
    return {"success": True, "locked": False}

@router.patch("/{team_id}/hotel")
def assign_hotel(team_id: str, req: HotelAssignmentRequest, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    travel = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel:
        travel = TeamTravel(team_id=team.id)
        db.add(travel)
        
    acc = travel.accommodation or {}
    acc.update({
        "hotel_name": req.hotel_name,
        "hotel_address": req.hotel_address,
        "hotel_maps_url": req.hotel_maps_url,
        "check_in_date": req.check_in_date,
        "check_out_date": req.check_out_date,
        "special_instructions": req.special_instructions
    })
    
    # Re-assign to trigger SQLAlchemy JSONB update
    travel.accommodation = dict(acc)
    travel.accommodation_assigned = True
    
    # Also update legacy explicit fields for compatibility
    travel.hotel_name = req.hotel_name
    travel.hotel_address = req.hotel_address
    travel.hotel_checkin_time = req.check_in_date
    
    db.commit()
    return {"success": True}


@router.put("/{team_id}/organizer")
def update_team_organizer_info(
    team_id: str,
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    travel = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel:
        raise HTTPException(status_code=404, detail="Travel details not found")
        
    event = db.query(Event).filter(Event.id == team.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Team-specific
    if "participant_notes" in payload:
        travel.participant_notes = payload["participant_notes"]
        
    # Global
    config = event.config or {}
    updated = False
    
    if "travelCoordinator" in payload:
        config["travel_coordinator"] = payload["travelCoordinator"]
        updated = True
        
    if "eventSchedule" in payload:
        config["travel_schedule"] = payload["eventSchedule"]
        updated = True
        
    if updated:
        from sqlalchemy.orm.attributes import flag_modified
        event.config = config
        flag_modified(event, "config")
        
    db.commit()
    return {"message": "Organizer information updated successfully"}
