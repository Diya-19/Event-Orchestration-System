import zipfile
import tempfile

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import UUID

from app.db import get_db
from app.models.participant import Participant
from app.models.event import Event
from app.services.pdf_generator import generate_certificate

router = APIRouter(
    tags=["Results"]
)


# ==========================
# SINGLE CERTIFICATE
# ==========================
@router.get("/certificate/{participant_id}")
def download_certificate(
    participant_id: UUID,
    db: Session = Depends(get_db)
):
    participant = (
        db.query(Participant)
        .filter(Participant.id == participant_id)
        .first()
    )

    if not participant:
        return {"error": "Participant not found"}

    event = (
        db.query(Event)
        .filter(Event.id == participant.event_id)
        .first()
    )

    if not event:
        return {"error": "Event not found"}

    pdf_path = generate_certificate(
        participant.name,
        participant.institution or "",
        f"{event.name} Hackathon"
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{participant.name}_certificate.pdf"
    )


# ==========================
# ALL CERTIFICATES (ZIP)
# ==========================
@router.get("/download-all-certificates/{event_id}")
def download_all_certificates(
    event_id: UUID,
    db: Session = Depends(get_db)
):
    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        return {"error": "Event not found"}

    participants = (
        db.query(Participant)
        .filter(Participant.event_id == event_id)
        .all()
    )

    if not participants:
        return {"error": "No participants found"}

    zip_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".zip"
    )

    zip_path = zip_file.name
    zip_file.close()

    with zipfile.ZipFile(zip_path, "w") as zipf:

        for participant in participants:

            pdf_path = generate_certificate(
                participant.name,
                participant.institution or "",
                f"{event.name} Hackathon"
            )

            zipf.write(
                pdf_path,
                arcname=f"{participant.name}_certificate.pdf"
            )

    return FileResponse(
        path=zip_path,
        media_type="application/zip",
        filename=f"{event.name}_Certificates.zip"
    )