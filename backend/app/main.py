from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Auth
from app.routers import auth

# Committee Routers
from app.routers.committee import (
    events,
    participants,
    teams,
    approvals,
    evaluators,
    scores,
    dashboard,
    rules,
    communications
)

# Portal Routers
from app.routers.portal import participant as portal_participant
from app.routers.portal import evaluator as portal_evaluator
from app.websocket_manager import manager

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
app.include_router(approvals.router, prefix="/api/approvals", tags=["Approvals"])
app.include_router(scores.router, prefix="/api/events/{event_id}/scores", tags=["scores"])
app.include_router(rules.router, prefix="/api/events", tags=["rules"])
app.include_router(communications.router, prefix="/api/events/{event_id}/communications", tags=["communications"])
app.include_router(evaluators.router, prefix="/api/events/{event_id}/evaluators", tags=["evaluators"])


# Public/Portal API
#app.include_router(portal_participant.router, prefix="/api/portal/participant", tags=["Portal - Participant"])
#app.include_router(portal_evaluator.router, prefix="/api/portal/evaluator", tags=["Portal - Evaluator"])

# Judge Portal Routers
from app.routers.portal import judge, judge_evaluations
from app.routers.portal import judge as portal_judge
app.include_router(portal_judge.router, prefix="/api/judge", tags=["Judge Portal"])
app.include_router(judge_evaluations.router, prefix="/api/judge/evaluations", tags=["Judge Portal"])


@app.websocket("/ws/events/{event_id}/scoring")
async def websocket_endpoint(websocket: WebSocket, event_id: str):
    await manager.connect(websocket, event_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, event_id)