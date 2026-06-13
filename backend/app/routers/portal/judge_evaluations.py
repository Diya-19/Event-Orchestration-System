from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.auth import require_evaluator
from app.services import judge_service
from typing import Dict, Any

router = APIRouter()

@router.get("")
def list_evaluations(
    evaluator: dict = Depends(require_evaluator),
    db: Session = Depends(get_db)
):
    """
    Returns the list of teams assigned to the judge with their evaluation statuses.
    """
    return judge_service.get_evaluations_list(db, evaluator)

@router.get("/{team_id}")
def get_evaluation(
    team_id: str,
    evaluator: dict = Depends(require_evaluator),
    db: Session = Depends(get_db)
):
    """
    Returns the team context, existing evaluation, and rubric for a single evaluation page.
    """
    return judge_service.get_evaluation_detail(db, evaluator, team_id)

@router.put("/{team_id}")
def save_draft(
    team_id: str,
    payload: Dict[str, Any],
    evaluator: dict = Depends(require_evaluator),
    db: Session = Depends(get_db)
):
    """
    Saves an evaluation as a draft. Fails if the evaluation is already submitted.
    """
    return judge_service.save_evaluation_draft(db, evaluator, team_id, payload)

@router.post("/{team_id}/submit")
def submit_evaluation(
    team_id: str,
    payload: Dict[str, Any],
    evaluator: dict = Depends(require_evaluator),
    db: Session = Depends(get_db)
):
    """
    Submits an evaluation, making it read-only. Fails if already submitted.
    """
    return judge_service.submit_evaluation(db, evaluator, team_id, payload)