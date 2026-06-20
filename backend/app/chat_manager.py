from fastapi import WebSocket
from collections import defaultdict


class ChatManager:
    def __init__(self):
        # room_id -> list of (websocket, participant_id)
        self.active_connections: dict[str, list[tuple[WebSocket, str]]] = defaultdict(list)

    async def connect(self, websocket: WebSocket, room_id: str, participant_id: str):
        await websocket.accept()
        self.active_connections[room_id].append((websocket, participant_id))

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id] = [
            (ws, pid) for ws, pid in self.active_connections[room_id] if ws is not websocket
        ]

    async def broadcast(self, room_id: str, message: dict):
        for ws, _ in list(self.active_connections[room_id]):
            try:
                await ws.send_json(message)
            except Exception:
                pass


chat_manager = ChatManager()