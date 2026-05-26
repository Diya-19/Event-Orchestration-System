from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status
from app.config import settings

_ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)) -> str:
    payload = {**data, "exp": datetime.utcnow() + expires_delta}
    return jwt.encode(payload, settings.APP_SECRET, algorithm=_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.APP_SECRET, algorithms=[_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Convenience wrappers used by portal link generation (Stage 2)
def make_participant_token(participant_id: str, event_id: str) -> str:
    return create_access_token(
        {"sub": f"participant:{participant_id}", "event": event_id},
        expires_delta=timedelta(days=30),
    )

def make_evaluator_token(evaluator_id: str, event_id: str, deadline: datetime) -> str:
    return create_access_token(
        {"sub": f"evaluator:{evaluator_id}", "event": event_id},
        expires_delta=(deadline + timedelta(hours=48)) - datetime.utcnow(),
    )
