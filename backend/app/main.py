from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Auth
from app.routers import auth

# Committee Routers
from app.routers.committee import (
    events,
    participants,
    dashboard,
    rules,
    teams
)

# Portal Routers
# from app.routers.portal import participant as portal_participant
# from app.routers.portal import evaluator as portal_evaluator
from app.routers.portal import judge, judge_evaluations

app = FastAPI(title="Event Orchestration API", version="1.0.0")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---

# Auth
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Committee API
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(participants.router, prefix="/api/events", tags=["Participants"])
app.include_router(teams.router, prefix="/api/events/{event_id}/teams", tags=["teams"])
# app.include_router(approvals.router, prefix="/api/approvals", tags=["Approvals"])
# app.include_router(evaluators.router, prefix="/api/evaluators", tags=["Evaluators"])
# app.include_router(scores.router, prefix="/api/scores", tags=["Scores"])
app.include_router(rules.router, prefix="/api/events", tags=["rules"])

# Public/Portal API
# app.include_router(portal_participant.router, prefix="/api/portal/participant", tags=["Portal - Participant"])
# app.include_router(portal_evaluator.router, prefix="/api/portal/evaluator", tags=["Portal - Evaluator"])
from app.routers.portal import judge as portal_judge
app.include_router(portal_judge.router, prefix="/api/judge", tags=["Judge Portal"])
app.include_router(judge_evaluations.router, prefix="/api/judge/evaluations", tags=["Judge Portal"])