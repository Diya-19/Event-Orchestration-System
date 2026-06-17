import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, Numeric, Boolean, Date, Time, Enum
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, JSONB
from app.db import Base

class TeamTravel(Base):
    __tablename__ = "team_travel"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("teams.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False
    )
    
    budget = Column(Numeric(10, 2))
    accommodation = Column(JSONB)
    ticket_url = Column(Text)
    
    ticket_file_url = Column(Text) # Deprecated
    ticket_file_name = Column(Text) # Deprecated
    ticket_uploaded_at = Column(TIMESTAMP(timezone=True)) # Deprecated
    
    combined_ticket_url = Column(Text)
    combined_ticket_name = Column(Text)
    combined_ticket_uploaded_at = Column(TIMESTAMP(timezone=True))
    
    is_locked = Column(Boolean, default=False)
    
    # Arrival Information
    arrival_date = Column(Date)
    arrival_time = Column(Time)
    arrival_airport_or_station = Column(Text)

    # Departure Information
    departure_date = Column(Date)
    departure_time = Column(Time)
    departure_airport_or_station = Column(Text)

    # Travel Information
    flight_or_train_number = Column(Text)
    pnr_number = Column(Text)

    # Travel Preferences & Emergency
    need_airport_to_hotel_cab = Column(Boolean, default=False)
    need_hotel_to_airport_cab = Column(Boolean, default=False)
    need_accommodation = Column(Boolean, default=False)
    self_arranged_accommodation = Column(Boolean, default=False)
    emergency_contact_name = Column(Text)
    emergency_contact_phone = Column(Text)

    # Tracking & Status
    travel_status = Column(Enum('draft', 'submitted', 'verified', 'processing', 'completed', name='travel_status_enum'), default='draft')
    travel_details_submitted_at = Column(TIMESTAMP(timezone=True))
    travel_details_updated_at = Column(TIMESTAMP(timezone=True))
    committee_notes = Column(Text)

    # Future Committee Fields
    accommodation_assigned = Column(Boolean, default=False)
    hotel_name = Column(Text)
    hotel_address = Column(Text)
    hotel_room_number = Column(Text)
    hotel_checkin_time = Column(Text)
    cab_pickup_assigned = Column(Boolean, default=False)
    cab_drop_assigned = Column(Boolean, default=False)
    cab_driver_name = Column(Text)
    cab_driver_phone = Column(Text)
    
    participant_notes = Column(Text)
    check_in_completed = Column(Boolean, default=False)
    
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class TravelReimbursementClaim(Base):
    __tablename__ = "travel_reimbursement_claims"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("teams.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False
    )
    
    account_holder_name = Column(Text)
    phone_number = Column(Text)
    
    account_number = Column(Text)
    ifsc_code = Column(Text)
    
    bank_name = Column(Text)
    branch_name = Column(Text)
    
    claim_amount = Column(Numeric(10, 2))
    arrival_expense = Column(Numeric(10, 2))
    return_expense = Column(Numeric(10, 2))
    other_expense = Column(Numeric(10, 2))
    
    status = Column(Text, default="DRAFT")
    review_notes = Column(Text)
    
    receipts = Column(JSONB, default=list)
    
    submitted_at = Column(TIMESTAMP(timezone=True))
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
