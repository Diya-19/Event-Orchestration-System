from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db import get_db
from app.auth import require_participant
from app.models.participant import Participant
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.travel import TeamTravel, TravelReimbursementClaim
from app.models.travel_query import TravelQuery
from app.models.event import Event
from pydantic import BaseModel
import datetime
import uuid
import os
import shutil
import urllib.request
import json

router = APIRouter()

def require_round3_participant(
    db: Session = Depends(get_db),
    actor: dict = Depends(require_participant)
):
    participant_id = actor["participant_id"]
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
        
    tm = db.query(TeamMember).filter(TeamMember.participant_id == participant.id).first()
    if not tm:
        raise HTTPException(status_code=404, detail="Not assigned to a team")
        
    team = db.query(Team).filter(Team.id == tm.team_id).first()

    if not team or not team.is_qualified_round_3:
        raise HTTPException(status_code=403, detail="Not qualified for Round 3 Travel")
        
    return {
        "participant": participant,
        "team": team
    }

@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    participant = auth_data["participant"]
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    event = db.query(Event).filter(Event.id == participant.event_id).first()
    
    today_str = datetime.date.today().isoformat()
    
    config = event.config or {} if event else {}
    schedule = config.get("schedule", {})
    start_date = schedule.get("start_date", "")
    event_started = (today_str >= start_date) if start_date else False
    
    travel_schedule = config.get("travel_schedule", [])
    travel_coordinator = config.get("travel_coordinator", {})
    
    accommodation = travel_info.accommodation or {} if travel_info else {}
    
    claim = db.query(TravelReimbursementClaim).filter(TravelReimbursementClaim.team_id == team.id).first()
    
    claim_data = None
    if claim:
        claim_data = {
            "status": claim.status,
            "claim_amount": float(claim.claim_amount) if claim.claim_amount else 0,
            "arrival_expense": float(claim.arrival_expense) if claim.arrival_expense else 0,
            "return_expense": float(claim.return_expense) if claim.return_expense else 0,
            "other_expense": float(claim.other_expense) if claim.other_expense else 0,
            "submitted_at": claim.submitted_at.isoformat() if claim.submitted_at else None,
            "bank_name": claim.bank_name,
            "branch_name": claim.branch_name,
            "account_holder_name": claim.account_holder_name,
            "account_number": claim.account_number,
            "ifsc_code": claim.ifsc_code,
            "phone_number": claim.phone_number,
            "receipts": claim.receipts or []
        }
    
    return {
        "budget": float(travel_info.budget) if travel_info and travel_info.budget else 0.0,
        "is_locked": travel_info.is_locked if travel_info else False,
        "accommodation": accommodation,
        "participant_notes": travel_info.participant_notes if travel_info else None,
        
        "hotel_name": accommodation.get("hotel_name"),
        "hotel_address": accommodation.get("hotel_address"),
        "hotel_contact": accommodation.get("hotel_contact"),
        "hotel_checkin": accommodation.get("check_in_date"),
        "hotel_checkout": accommodation.get("check_out_date"),
        "hotel_google_maps_url": accommodation.get("hotel_maps_url"),
        "special_instructions": accommodation.get("special_instructions"),
        
        "combined_ticket_url": travel_info.combined_ticket_url if travel_info else None,
        "combined_ticket_name": travel_info.combined_ticket_name if travel_info else None,
        "combined_ticket_uploaded_at": travel_info.combined_ticket_uploaded_at.isoformat() if travel_info and travel_info.combined_ticket_uploaded_at else None,
        
        "claim": claim_data,
        
        "timeline": {
            "travel_details_released": True if travel_info else False,
            "ticket_uploaded": bool(travel_info and travel_info.combined_ticket_url),
            "hotel_assigned": bool(accommodation.get("hotel_name")),
            "check_in_completed": travel_info.check_in_completed if travel_info else False,
            "event_started": event_started
        },
        "travel_schedule": travel_schedule,
        "travel_coordinator": travel_coordinator,
        
        "travel_status": travel_info.travel_status if travel_info and travel_info.travel_status else "draft",
        "travel_locked": travel_info.is_locked if travel_info else False,
        "travel_details_updated_at": travel_info.travel_details_updated_at.isoformat() if travel_info and travel_info.travel_details_updated_at else None,
        "travel_details_submitted_at": travel_info.travel_details_submitted_at.isoformat() if travel_info and travel_info.travel_details_submitted_at else None,
        
        "travel_details": {
            "arrival_date": travel_info.arrival_date.isoformat() if travel_info and travel_info.arrival_date else "",
            "arrival_time": travel_info.arrival_time.strftime("%H:%M") if travel_info and travel_info.arrival_time else "",
            "arrival_airport_or_station": travel_info.arrival_airport_or_station if travel_info else "",
            "departure_date": travel_info.departure_date.isoformat() if travel_info and travel_info.departure_date else "",
            "departure_time": travel_info.departure_time.strftime("%H:%M") if travel_info and travel_info.departure_time else "",
            "departure_airport_or_station": travel_info.departure_airport_or_station if travel_info else "",
            "flight_or_train_number": travel_info.flight_or_train_number if travel_info else "",
            "pnr_number": travel_info.pnr_number if travel_info else ""
        },
        "travel_preferences": {
            "need_airport_to_hotel_cab": travel_info.need_airport_to_hotel_cab if travel_info else False,
            "need_hotel_to_airport_cab": travel_info.need_hotel_to_airport_cab if travel_info else False,
            "need_accommodation": travel_info.need_accommodation if travel_info else False,
            "self_arranged_accommodation": travel_info.self_arranged_accommodation if travel_info else False,
            "preferences_submitted": travel_info.preferences_submitted if travel_info else False,
            "emergency_contact_name": travel_info.emergency_contact_name if travel_info else "",
            "emergency_contact_phone": travel_info.emergency_contact_phone if travel_info else ""
        }
    }

class TravelDetailsPatchRequest(BaseModel):
    arrival_date: str
    arrival_time: str
    arrival_airport_or_station: str
    departure_date: str
    departure_time: str
    departure_airport_or_station: str
    flight_or_train_number: str
    pnr_number: str
    need_airport_to_hotel_cab: bool = False
    need_hotel_to_airport_cab: bool = False
    need_accommodation: bool = False
    self_arranged_accommodation: bool = False
    emergency_contact_name: str = ""
    emergency_contact_phone: str = ""

@router.patch("/details")
def update_travel_details(
    req: TravelDetailsPatchRequest,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel_info:
        travel_info = TeamTravel(team_id=team.id)
        db.add(travel_info)
        
    if travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
        
    try:
        travel_info.arrival_date = datetime.date.fromisoformat(req.arrival_date) if req.arrival_date else None
        travel_info.arrival_time = datetime.time.fromisoformat(req.arrival_time) if req.arrival_time else None
        travel_info.arrival_airport_or_station = req.arrival_airport_or_station
        
        travel_info.departure_date = datetime.date.fromisoformat(req.departure_date) if req.departure_date else None
        travel_info.departure_time = datetime.time.fromisoformat(req.departure_time) if req.departure_time else None
        travel_info.departure_airport_or_station = req.departure_airport_or_station
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date or time format.")

    travel_info.flight_or_train_number = req.flight_or_train_number
    travel_info.pnr_number = req.pnr_number
    
    travel_info.need_airport_to_hotel_cab = req.need_airport_to_hotel_cab
    travel_info.need_hotel_to_airport_cab = req.need_hotel_to_airport_cab
    travel_info.need_accommodation = req.need_accommodation
    travel_info.self_arranged_accommodation = req.self_arranged_accommodation
    travel_info.emergency_contact_name = req.emergency_contact_name
    travel_info.emergency_contact_phone = req.emergency_contact_phone
    
    now = datetime.datetime.utcnow()
    travel_info.travel_details_updated_at = now
    
    if travel_info.travel_status == "draft" or not travel_info.travel_status:
        travel_info.travel_status = "submitted"
        if not travel_info.travel_details_submitted_at:
            travel_info.travel_details_submitted_at = now
            
            # Generate Notification
            from app.services.notification import NotificationService
            NotificationService.create(
                db=db,
                participant_id=auth_data["participant"].id,
                team_id=team.id,
                title="Travel details submitted",
                message="Your arrival and departure information has been received.",
                category="Travel",
                notification_type="travel"
            )
            
    db.commit()
    
    return {"message": "Travel details updated successfully"}

@router.post("/ticket/combined")
def upload_ticket(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if travel_info and travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    upload_dir = "uploads/tickets"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    if not travel_info:
        travel_info = TeamTravel(team_id=team.id)
        db.add(travel_info)
        
    file_url = f"/api/files/{file_path}".replace("\\", "/")
    
    travel_info.combined_ticket_url = file_url
    travel_info.combined_ticket_name = file.filename
    travel_info.combined_ticket_uploaded_at = datetime.datetime.utcnow()
    
    db.commit()
    
    return {
        "message": "Combined ticket uploaded successfully",
        "ticket_url": file_url,
        "ticket_name": file.filename
    }

@router.delete("/ticket/combined")
def delete_ticket(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel_info or not travel_info.combined_ticket_url:
        raise HTTPException(status_code=404, detail="No ticket found to delete.")
        
    if travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
        
    try:
        file_path = travel_info.combined_ticket_url.replace("/api/files/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Failed to delete physical file: {str(e)}")
        
    travel_info.combined_ticket_url = None
    travel_info.combined_ticket_name = None
    travel_info.combined_ticket_uploaded_at = None
    db.commit()
    
    return {"message": "Ticket removed successfully"}


@router.get("/claim")
def get_claim(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    claim = db.query(TravelReimbursementClaim).filter(TravelReimbursementClaim.team_id == team.id).first()
    
    if not claim:
        return {"claim": None}
        
    return {
        "claim": {
            "status": claim.status,
            "claim_amount": float(claim.claim_amount) if claim.claim_amount else 0,
            "arrival_expense": float(claim.arrival_expense) if claim.arrival_expense else 0,
            "return_expense": float(claim.return_expense) if claim.return_expense else 0,
            "other_expense": float(claim.other_expense) if claim.other_expense else 0,
            "submitted_at": claim.submitted_at.isoformat() if claim.submitted_at else None,
            "bank_name": claim.bank_name,
            "branch_name": claim.branch_name,
            "account_holder_name": claim.account_holder_name,
            "account_number": claim.account_number,
            "ifsc_code": claim.ifsc_code,
            "phone_number": claim.phone_number,
            "receipts": claim.receipts or []
        }
    }

@router.get("/ifsc/{code}")
def verify_ifsc(code: str, auth_data: dict = Depends(require_round3_participant)):
    if len(code) == 11 and code.isalnum():
        try:
            url = f"https://ifsc.razorpay.com/{code}"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode())
                return {
                    "bank": data.get("BANK"),
                    "branch": data.get("BRANCH")
                }
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid IFSC code")
    raise HTTPException(status_code=400, detail="Invalid IFSC code")

class ClaimRequest(BaseModel):
    account_holder_name: str
    phone_number: str
    account_number: str
    ifsc_code: str
    claim_amount: float
    arrival_expense: float
    return_expense: float
    other_expense: float

@router.post("/claim")
def submit_claim(
    req: ClaimRequest,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if travel_info and travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
        
    if len(req.phone_number) != 10 or not req.phone_number.isdigit():
        raise HTTPException(status_code=400, detail="Phone number must be exactly 10 digits.")
        
    try:
        if len(req.ifsc_code) == 11 and req.ifsc_code.isalnum():
            url = f"https://ifsc.razorpay.com/{req.ifsc_code}"
            req_obj = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_obj, timeout=5) as response:
                data = json.loads(response.read().decode())
                bank_name = data.get("BANK")
                branch_name = data.get("BRANCH")
        else:
            raise HTTPException(status_code=400, detail="Invalid IFSC code")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Unable to verify IFSC code")
    
    claim = db.query(TravelReimbursementClaim).filter(TravelReimbursementClaim.team_id == team.id).first()
    if not claim:
        claim = TravelReimbursementClaim(team_id=team.id)
        db.add(claim)
        
    claim.account_holder_name = req.account_holder_name
    claim.phone_number = req.phone_number
    claim.account_number = req.account_number
    claim.ifsc_code = req.ifsc_code
    claim.claim_amount = req.claim_amount
    claim.arrival_expense = req.arrival_expense
    claim.return_expense = req.return_expense
    claim.other_expense = req.other_expense
    claim.bank_name = bank_name
    claim.branch_name = branch_name
    
    claim.status = "SUBMITTED"
    claim.submitted_at = datetime.datetime.utcnow()
    
    from app.services.notification import NotificationService
    NotificationService.create(
        db=db,
        participant_id=auth_data["participant"].id,
        team_id=team.id,
        title="Reimbursement Claim Submitted",
        message="Your travel reimbursement claim has been successfully submitted and is under review.",
        category="Travel",
        notification_type="travel"
    )
    
    db.commit()
    
    return {
        "message": "Claim submitted successfully",
        "status": claim.status,
        "bank_name": claim.bank_name,
        "branch_name": claim.branch_name
    }

@router.post("/claim/receipt")
def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if travel_info and travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
    
    allowed_extensions = ['.pdf', '.png', '.jpg', '.jpeg']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only PDF, PNG, or JPG files are allowed")
        
    upload_dir = "uploads/receipts"
    os.makedirs(upload_dir, exist_ok=True)
    
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    claim = db.query(TravelReimbursementClaim).filter(TravelReimbursementClaim.team_id == team.id).first()
    if not claim:
        claim = TravelReimbursementClaim(team_id=team.id)
        db.add(claim)
        
    receipts = claim.receipts or []
    
    new_receipt = {
        "type": "receipt",
        "url": f"/api/files/{file_path}".replace("\\", "/"),
        "filename": file.filename
    }
    
    receipts.append(new_receipt)
    # Re-assign to trigger SQLAlchemy JSONB update
    claim.receipts = list(receipts)
    
    db.commit()
    
    return {
        "message": "Receipt uploaded successfully",
        "receipt": new_receipt
    }

@router.get("/schedule")
def get_schedule(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    participant = auth_data["participant"]
    team = auth_data["team"]
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    event = db.query(Event).filter(Event.id == participant.event_id).first()
    
    config = event.config or {} if event else {}
    travel_schedule = config.get("travel_schedule", [])
    
    schedule = []
    
    if travel_info:
        if travel_info.arrival_date:
            schedule.append({
                "date": travel_info.arrival_date.strftime("%d %b"),
                "time": travel_info.arrival_time.strftime("%I:%M %p") if travel_info.arrival_time else "",
                "event": "Arrival",
                "datetime": f"{travel_info.arrival_date.isoformat()}T{travel_info.arrival_time.isoformat() if travel_info.arrival_time else '00:00:00'}"
            })
        if travel_info.departure_date:
            schedule.append({
                "date": travel_info.departure_date.strftime("%d %b"),
                "time": travel_info.departure_time.strftime("%I:%M %p") if travel_info.departure_time else "",
                "event": "Departure",
                "datetime": f"{travel_info.departure_date.isoformat()}T{travel_info.departure_time.isoformat() if travel_info.departure_time else '23:59:59'}"
            })
            
        acc = travel_info.accommodation or {}
        if acc.get("hotel_checkin"):
            # Try to parse or just display
            schedule.append({
                "date": "TBD", # If no explicit date is set, or we can try parsing
                "time": acc.get("hotel_checkin"),
                "event": "Accommodation Check-in",
                "datetime": "9999-12-31" # Sort at the end if no date
            })
            
    # Add committee data from travel_schedule (assuming it's a list of dicts: { date, time, event, datetime })
    if isinstance(travel_schedule, list):
        for item in travel_schedule:
            schedule.append(item)
            
    # Sort by datetime if possible
    try:
        schedule.sort(key=lambda x: x.get("datetime", "9999-12-31"))
    except Exception:
        pass
        
    return {
        "schedule": schedule
    }

@router.get("/emergency")
def get_emergency_contacts(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    participant = auth_data["participant"]
    event = db.query(Event).filter(Event.id == participant.event_id).first()
    
    config = event.config or {} if event else {}
    travel_config = config.get("travel", {})
    emergency_contacts = travel_config.get("emergency_contacts", [])
    
    return {
        "emergency_contacts": emergency_contacts
    }


# --- Travel Queries Endpoints ---

class QueryCreateRequest(BaseModel):
    category: str
    subject: str
    message: str

@router.get("/queries")
def get_queries(
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    queries = db.query(TravelQuery).filter(
        TravelQuery.team_id == team.id
    ).order_by(TravelQuery.created_at.desc()).all()
    
    return {
        "queries": [
            {
                "id": str(q.id),
                "category": q.category,
                "subject": q.subject,
                "message": q.message,
                "status": q.status,
                "conversation": q.conversation or [],
                "created_at": q.created_at.isoformat(),
                "updated_at": q.updated_at.isoformat()
            }
            for q in queries
        ]
    }

@router.post("/queries")
def create_query(
    req: QueryCreateRequest,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    participant = auth_data["participant"]
    team = auth_data["team"]
    
    query = TravelQuery(
        participant_id=participant.id,
        team_id=team.id,
        category=req.category,
        subject=req.subject,
        message=req.message,
        status="Submitted",
        conversation=[
            {
                "from": "You",
                "text": req.message,
                "time": datetime.datetime.utcnow().isoformat(),
                "isUser": True
            }
        ]
    )
    
    db.add(query)
    db.commit()
    db.refresh(query)
    
    from app.models.notification import Notification
    notification = Notification(
        participant_id=participant.id,
        team_id=team.id,
        title="Travel Query Received",
        message=f"Your travel query '{req.subject}' has been received and is being reviewed.",
        category="Travel",
        notification_type="travel",
        query_id=query.id
    )
    db.add(notification)
    db.commit()
    
    return {
        "id": str(query.id),
        "message": "Query submitted successfully",
        "status": query.status
    }

class TravelPreferencesPatchRequest(BaseModel):
    need_airport_to_hotel_cab: bool
    need_hotel_to_airport_cab: bool
    need_accommodation: bool
    self_arranged_accommodation: bool

@router.patch("/preferences")
def update_travel_preferences(
    req: TravelPreferencesPatchRequest,
    db: Session = Depends(get_db),
    auth_data: dict = Depends(require_round3_participant)
):
    team = auth_data["team"]
    
    # Mutually exclusive validation
    if req.need_accommodation and req.self_arranged_accommodation:
        raise HTTPException(status_code=400, detail="Cannot need accommodation and self-arrange simultaneously.")
        
    travel_info = db.query(TeamTravel).filter(TeamTravel.team_id == team.id).first()
    if not travel_info:
        travel_info = TeamTravel(team_id=team.id)
        db.add(travel_info)
        
    if travel_info.is_locked:
        raise HTTPException(status_code=403, detail="Travel information is currently locked by the committee. Please contact the organizers through Travel Queries.")
        
    if getattr(travel_info, 'preferences_submitted', False):
        raise HTTPException(status_code=403, detail="Travel preferences have already been submitted and cannot be edited.")
        
    travel_info.need_airport_to_hotel_cab = req.need_airport_to_hotel_cab
    travel_info.need_hotel_to_airport_cab = req.need_hotel_to_airport_cab
    travel_info.need_accommodation = req.need_accommodation
    travel_info.self_arranged_accommodation = req.self_arranged_accommodation
    travel_info.preferences_submitted = True
    
    db.commit()
    
    return {
        "status": "success",
        "preferences": {
            "need_airport_to_hotel_cab": travel_info.need_airport_to_hotel_cab,
            "need_hotel_to_airport_cab": travel_info.need_hotel_to_airport_cab,
            "need_accommodation": travel_info.need_accommodation,
            "self_arranged_accommodation": travel_info.self_arranged_accommodation,
            "preferences_submitted": travel_info.preferences_submitted
        }
    }
