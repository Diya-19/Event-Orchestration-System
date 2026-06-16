from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.team import Team
from app.models.evaluation import Evaluation
from app.models.activity_log import ActivityLog
from app.models.event import Event
from app.models.team_member import TeamMember
from app.models.participant import Participant
from typing import Dict, Any
from datetime import datetime
from fastapi import HTTPException

def get_dashboard_stats(db: Session, evaluator: dict) -> Dict[str, Any]:
    event_id = evaluator["event_id"]
    evaluator_id = evaluator["evaluator_id"]

    # 1. Total Teams Assigned (all teams in the current event)
    assigned_teams = db.query(func.count(Team.id)).filter(
        Team.event_id == event_id
    ).scalar() or 0

    # 2. Completed Evaluations by this evaluator
    completed_evaluations = db.query(func.count(Evaluation.id)).filter(
        Evaluation.evaluator_id == evaluator_id,
        Evaluation.submitted_at != None
    ).scalar() or 0

    # 3. Pending Evaluations
    pending_evaluations = max(0, assigned_teams - completed_evaluations)

    # 4. Progress Percentage
    progress_percentage = 0.0
    if assigned_teams > 0:
        progress_percentage = round((completed_evaluations / assigned_teams) * 100, 2)

    # 5. Recent Activity
    activities = db.query(ActivityLog).filter(
        ActivityLog.actor == f"evaluator:{evaluator_id}"
    ).order_by(ActivityLog.created_at.desc()).all()

    formatted_activities = []
    for activity in activities:
        details = activity.details or {}
        time_str = activity.created_at.strftime("%Y-%m-%d %H:%M:%S") if activity.created_at else "Unknown"
        
        formatted_activities.append({
            "team_id": details.get("team_id", ""),
            "team_name": details.get("team_name", "System"),
            "activity": activity.action,
            "timestamp": time_str,
            # Backward compatibility fields
            "title": activity.action,
            "subtitle": details.get("subtitle", ""),
            "time": time_str
        })

    # Average Time and Deadlines cannot be computed strictly from current schema
    average_time_per_team = 0
    
    event = db.query(Event).filter(Event.id == event_id).first()
    all_deadlines = event.config.get("deadlines", []) if event and event.config else []
    
    upcoming_deadlines = []
    now = datetime.utcnow()
    for d in all_deadlines:
        try:
            ts_str = d.get("timestamp", "")
            if ts_str.endswith("Z"):
                ts_str = ts_str[:-1] + "+00:00"
            dt = datetime.fromisoformat(ts_str)
            dt_naive = dt.replace(tzinfo=None) if dt.tzinfo else dt
            
            if dt_naive > now:
                formatted_date = dt.strftime("%B %d, %Y - %I:%M %p")
                upcoming_deadlines.append({
                    "title": d.get("title", "Deadline"),
                    "date": formatted_date,
                    "tag": d.get("tag", "Upcoming"),
                    "color": d.get("color", "bg-orange-50 text-orange-700"),
                    "_ts": dt_naive
                })
        except Exception:
            continue
            
    upcoming_deadlines.sort(key=lambda x: x["_ts"])
    for d in upcoming_deadlines:
        del d["_ts"]
        
    upcoming_deadlines = upcoming_deadlines[:3]

    # Process all deadlines (no truncation, preserve raw timestamp)
    processed_all_deadlines = []
    for d in all_deadlines:
        try:
            ts_str = d.get("timestamp", "")
            if ts_str.endswith("Z"):
                ts_str = ts_str[:-1] + "+00:00"
            dt = datetime.fromisoformat(ts_str)
            dt_naive = dt.replace(tzinfo=None) if dt.tzinfo else dt
            formatted_date = dt.strftime("%B %d, %Y - %I:%M %p")
            
            processed_all_deadlines.append({
                "title": d.get("title", "Deadline"),
                "timestamp": ts_str,
                "date": formatted_date,
                "tag": d.get("tag", "Upcoming"),
                "color": d.get("color", "bg-orange-50 text-orange-700"),
                "_ts": dt_naive
            })
        except Exception:
            continue
            
    processed_all_deadlines.sort(key=lambda x: x["_ts"])
    for d in processed_all_deadlines:
        del d["_ts"]

    return {
        "assigned_teams": assigned_teams,
        "completed_evaluations": completed_evaluations,
        "pending_evaluations": pending_evaluations,
        "average_time_per_team": average_time_per_team,
        "progress_percentage": progress_percentage,
        "recent_activity": formatted_activities,
        "upcoming_deadlines": upcoming_deadlines,
        "all_deadlines": processed_all_deadlines
    }

def get_evaluations_list(db: Session, evaluator: dict):
    event_id = evaluator["event_id"]
    evaluator_id = evaluator["evaluator_id"]
    
    # Get all teams for the event
    teams = db.query(Team).filter(Team.event_id == event_id).all()
    
    # Get all evaluations by this evaluator
    evaluations = db.query(Evaluation).filter(
        Evaluation.evaluator_id == evaluator_id
    ).all()
    
    eval_map = {str(e.team_id): e for e in evaluations}
    
    result = []
    for t in teams:
        e = eval_map.get(str(t.id))
        if not e:
            status = "Not Started"
        elif e.submitted_at is None:
            status = "Draft"
        else:
            status = "Submitted"
            
        result.append({
            "team_id": str(t.id),
            "team_name": t.name,
            "challenge": t.challenge or "",
            "status": status,
            "overall_score": float(e.overall) if e and e.overall else None,
            "submitted_at": e.submitted_at.isoformat() if e and e.submitted_at else None
        })
        
    return result

def get_evaluation_detail(db: Session, evaluator: dict, team_id: str):
    evaluator_id = evaluator["evaluator_id"]
    event_id = evaluator["event_id"]

    team = db.query(Team).filter(Team.id == team_id, Team.event_id == event_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    event = db.query(Event).filter(Event.id == evaluator["event_id"]).first()
    rubric = event.config.get("rubric", {}) if event and event.config else {}
    
    evaluation = db.query(Evaluation).filter(
        Evaluation.team_id == team_id,
        Evaluation.evaluator_id == evaluator_id
    ).first()
    
    if not evaluation:
        status_str = "Not Started"
        eval_data = {"scores": {}, "comments": "", "overall": 0}
    elif evaluation.submitted_at is None:
        status_str = "Draft"
        eval_data = {"scores": evaluation.scores, "comments": evaluation.comments or "", "overall": float(evaluation.overall) if evaluation.overall else 0}
    else:
        status_str = "Submitted"
        eval_data = {"scores": evaluation.scores, "comments": evaluation.comments or "", "overall": float(evaluation.overall) if evaluation.overall else 0}
        
    members = db.query(TeamMember, Participant).join(
        Participant, TeamMember.participant_id == Participant.id
    ).filter(TeamMember.team_id == team_id).all()
    
    participants_data = []
    for tm, p in members:
        participants_data.append({
            "name": p.name,
            "email": p.email,
            "institution": p.institution,
            "skills": p.skills or [],
            "role": tm.role
        })

    return {
        "team": {
            "id": str(team.id),
            "name": team.name,
            "challenge": team.challenge or "",
            "participants": participants_data
        },
        "evaluation": eval_data,
        "status": status_str,
        "deliverables": [],
        "rubric": rubric
    }

def save_evaluation_draft(db: Session, evaluator: dict, team_id: str, payload: dict):
    evaluator_id = evaluator["evaluator_id"]
    event_id = evaluator["event_id"]

    team = db.query(Team).filter(Team.id == team_id, Team.event_id == event_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    evaluation = db.query(Evaluation).filter(
        Evaluation.team_id == team_id,
        Evaluation.evaluator_id == evaluator_id
    ).first()
    
    if evaluation and evaluation.submitted_at is not None:
        raise HTTPException(status_code=403, detail="Evaluation is locked")
        
    scores = payload.get("scores", {})
    comments = payload.get("comments", "")
    
    if not evaluation:
        evaluation = Evaluation(
            team_id=team_id,
            evaluator_id=evaluator_id,
            scores=scores,
            comments=comments,
            overall=0
        )
        db.add(evaluation)
    else:
        evaluation.scores = scores
        evaluation.comments = comments
        
    db.commit()
    return {"message": "Draft saved"}

def submit_evaluation(db: Session, evaluator: dict, team_id: str, payload: dict):
    evaluator_id = evaluator["evaluator_id"]
    event_id = evaluator["event_id"]

    team = db.query(Team).filter(Team.id == team_id, Team.event_id == event_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    evaluation = db.query(Evaluation).filter(
        Evaluation.team_id == team_id,
        Evaluation.evaluator_id == evaluator_id
    ).first()
    
    if evaluation and evaluation.submitted_at is not None:
        raise HTTPException(status_code=403, detail="Evaluation is locked")
        
    scores = payload.get("scores", {})
    comments = payload.get("comments", "")
    
    # Calculate overall
    event = db.query(Event).filter(Event.id == evaluator["event_id"]).first()
    rubric = event.config.get("rubric", {}) if event and event.config else {}
    
    overall = 0.0
    if rubric:
        for k, v in rubric.items():
            if k not in scores:
                raise HTTPException(status_code=400, detail=f"Missing score for criterion: {k.replace('_', ' ')}")
            try:
                score_val = float(scores[k])
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid score for criterion: {k.replace('_', ' ')}")
            if not (0 <= score_val <= 10):
                raise HTTPException(status_code=400, detail=f"Score for {k.replace('_', ' ')} must be between 0 and 10")
                
            weight = float(v) / 100.0
            overall += score_val * weight
    else:
        if scores:
            overall = sum([float(s) for s in scores.values()]) / len(scores)
            
    if not evaluation:
        evaluation = Evaluation(
            team_id=team_id,
            evaluator_id=evaluator_id,
            scores=scores,
            comments=comments,
            overall=overall,
            submitted_at=datetime.utcnow()
        )
        db.add(evaluation)
    else:
        evaluation.scores = scores
        evaluation.comments = comments
        evaluation.overall = overall
        evaluation.submitted_at = datetime.utcnow()
        
    db.commit()
    return {"message": "Evaluation submitted"}