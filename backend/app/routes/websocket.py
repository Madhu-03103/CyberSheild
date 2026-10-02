"""WebSocket routes for real-time updates"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List, Dict
import json
import asyncio
from datetime import datetime

from app.database import get_db

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_count = 0

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_count += 1
        print(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: Dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for connection in disconnected:
            try:
                self.active_connections.remove(connection)
            except ValueError:
                pass


manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    
    try:
        # Send initial connection success message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "message": "WebSocket connected successfully",
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle ping/pong for keepalive
            if message.get("type") == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                })
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


async def broadcast_threat_event(event_data: Dict):
    """Broadcast new threat event to all connected clients"""
    await manager.broadcast({
        "type": "threat_event",
        "data": event_data,
        "timestamp": datetime.utcnow().isoformat()
    })


async def broadcast_dashboard_update(dashboard_data: Dict):
    """Broadcast dashboard statistics update"""
    await manager.broadcast({
        "type": "dashboard_update",
        "data": dashboard_data,
        "timestamp": datetime.utcnow().isoformat()
    })


async def broadcast_incident_update(incident_data: Dict):
    """Broadcast incident status update"""
    await manager.broadcast({
        "type": "incident_update",
        "data": incident_data,
        "timestamp": datetime.utcnow().isoformat()
    })


async def broadcast_analytics_update(analytics_data: Dict):
    """Broadcast analytics data update"""
    await manager.broadcast({
        "type": "analytics_update",
        "data": analytics_data,
        "timestamp": datetime.utcnow().isoformat()
    })


@router.get("/ws/status")
async def websocket_status():
    """Get WebSocket connection status"""
    return {
        "active_connections": len(manager.active_connections),
        "total_connections": manager.connection_count,
        "status": "operational"
    }
