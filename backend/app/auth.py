from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db import get_db
from app.services.token_service import verify_token
from app.models.committee_user import CommitteeUser

_bearer = HTTPBearer()


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
