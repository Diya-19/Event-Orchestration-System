from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(
            f"Connected. Active connections = {len(self.active_connections)}"
            )

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

        print(
            f"Disconnected. Active connections = {len(self.active_connections)}"
        )

    async def broadcast(self, message):
        print("BROADCAST MANAGER ID:", id(self))
        print(f"Broadcasting to {len(self.active_connections)} connections")
        for connection in self.active_connections:
            print("Sending to:", connection)
            await connection.send_json(message)

manager = ConnectionManager()