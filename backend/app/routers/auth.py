from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

from app.db import get_db
from app.models.committee_user import CommitteeUser
from app.models.evaluator import Evaluator
from app.services.token_service import create_access_token, verify_token

from app.auth import require_committee

# Re-export under the legacy name so Stage 1 routers that still reference
# get_current_committee_user continue to work without modification.
get_current_committee_user = require_committee

router = APIRouter()

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer = HTTPBearer()


# ---------- Pydantic schemas ----------

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"



# ---------- Endpoints ----------

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    if len(body.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters",
        )
    if db.query(CommitteeUser).filter(CommitteeUser.email == body.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    user = CommitteeUser(
        name=body.name,
        email=body.email,
        hashed_password=_pwd.hash(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": f"committee:{user.id}", "email": user.email})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(CommitteeUser).filter(CommitteeUser.email == body.email).first()
    if not user or not _pwd.verify(body.password, user.hashed_password):
        # same message for both cases — avoids email enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token({"sub": f"committee:{user.id}", "email": user.email})
    return TokenResponse(access_token=token)

@router.get("/verify-judge", response_model=TokenResponse)
def verify_judge(token: str, db: Session = Depends(get_db)):
    evaluator = db.query(Evaluator).filter(Evaluator.access_token == token).first()
    if not evaluator:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired invitation link",
        )
    # Return the raw token exactly as expected by the require_evaluator dependency
    return TokenResponse(access_token=token)