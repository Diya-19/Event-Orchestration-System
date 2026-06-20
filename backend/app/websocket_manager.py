from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        # Dictionary mapping event_id -> list of active websockets
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, event_id: str):
        await websocket.accept()
        self.active_connections[event_id].append(websocket)

    def disconnect(self, websocket: WebSocket, event_id: str):
        if websocket in self.active_connections[event_id]:
            self.active_connections[event_id].remove(websocket)

    async def broadcast_to_event(self, event_id: str, message: dict):
        if event_id in self.active_connections:
            for connection in self.active_connections[event_id]:
                await connection.send_json(message)

# Create the single instance everyone will share
manager = ConnectionManager()