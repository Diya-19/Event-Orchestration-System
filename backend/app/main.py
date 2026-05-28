from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Auth
from app.routers import auth

# Committee Routers
from app.routers.committee import (
    events,
    participants,
    dashboard,
    distribution_rules,
)

# Portal Routers
# from app.routers.portal import participant as portal_participant
# from app.routers.portal import evaluator as portal_evaluator

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
app.include_router(distribution_rules.router, prefix="/api/events", tags=["Distribution Rules"])

# Public/Portal API
# app.include_router(portal_participant.router, prefix="/api/portal/participant", tags=["Portal - Participant"])
# app.include_router(portal_evaluator.router, prefix="/api/portal/evaluator", tags=["Portal - Evaluator"])