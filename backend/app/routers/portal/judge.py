from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.auth import require_evaluator
from app.services import judge_service

router = APIRouter()

@router.get("/dashboard")
def get_judge_dashboard(
    evaluator: dict = Depends(require_evaluator),
    db: Session = Depends(get_db)
):
    """
    Returns the dashboard statistics for the currently authenticated judge.
    """
    return judge_service.get_dashboard_stats(db, evaluator)