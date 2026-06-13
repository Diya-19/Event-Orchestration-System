from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db import get_db
from app.services.token_service import verify_token
from app.models.committee_user import CommitteeUser
from app.models.evaluator import Evaluator
from app.config import settings

_bearer = HTTPBearer()
_optional_bearer = HTTPBearer(auto_error=False)


def decode_token(token: str) -> dict:
    """Verify a raw JWT string (used by portal routes that read ?token= from query params)."""
    return verify_token(token)


def require_committee(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
) -> dict:
    """
    FastAPI dependency for all committee-authenticated routes.
    Returns a plain dict so every router uses actor["sub"] uniformly.
    """
    payload = verify_token(creds.credentials)
    sub: str = payload.get("sub", "")
    if not sub.startswith("committee:"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a committee token")
    user_id = sub.split(":", 1)[1]
    user = db.get(CommitteeUser, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return {"sub": sub, "user_id": user_id, "email": user.email}


def require_evaluator(
    creds: HTTPAuthorizationCredentials = Depends(_optional_bearer),
    db: Session = Depends(get_db),
) -> dict:
    """
    FastAPI dependency for evaluator-authenticated routes.
    Supports DEV_MODE bypass.
    """
    if settings.DEV_MODE:
        dummy_id = "00000000-0000-0000-0000-000000000000"
        dummy_event_id = "415e7b26-90e3-40f1-b64b-e753c6b9d930"
        
        evaluator = db.get(Evaluator, dummy_id)
        if not evaluator:
            evaluator = Evaluator(
                id=dummy_id,
                event_id=dummy_event_id,
                name="DEV Evaluator",
                email="dummy@evaluator.local",
                access_token="dev-token-override",
            )
            db.add(evaluator)
            db.commit()

        return {
            "sub": f"evaluator:{dummy_id}",
            "evaluator_id": dummy_id,
            "email": "dummy@evaluator.local",
            "event_id": dummy_event_id
        }
        
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        
    token = creds.credentials
    evaluator = db.query(Evaluator).filter(Evaluator.access_token == token).first()
    
    if not evaluator:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid evaluator token")
        
    return {
        "sub": f"evaluator:{evaluator.id}",
        "evaluator_id": str(evaluator.id),
        "email": evaluator.email,
        "event_id": str(evaluator.event_id)
    }
