"""Incident management routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
import uuid
import json

from app.database import get_db
from app.models.incident import Incident, IncidentTimeline, IncidentStatus, IncidentSeverity
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter()


# Request schemas
class IncidentCreate(BaseModel):
    title: str
    severity: str
    category: str = ""
    description: str = ""


class IncidentUpdate(BaseModel):
    title: str = None
    severity: str = None
    status: str = None
    assigned_analyst: int = None
    resolution: str = None


class TimelineEntry(BaseModel):
    action: str
    details: str = ""


# Routes
@router.post("/")
async def create_incident(
    request: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new incident"""
    
    # Generate incident ID
    incident_id = f"INC-{datetime.utcnow().strftime('%Y')}-{uuid.uuid4().hex[:4].upper()}"
    
    incident = Incident(
        incident_id=incident_id,
        title=request.title,
        severity=IncidentSeverity[request.severity.upper()],
        category=request.category,
        description=request.description,
        assigned_analyst=current_user.id,
        status=IncidentStatus.NEW
    )
    
    db.add(incident)
    db.flush()
    
    # Add timeline entry
    timeline = IncidentTimeline(
        incident_id=incident.id,
        action="Incident created",
        user_id=current_user.id,
        details=json.dumps({"created_by": current_user.username})
    )
    db.add(timeline)
    
    db.commit()
    db.refresh(incident)
    
    return {
        "id": incident.id,
        "incident_id": incident.incident_id,
        "title": incident.title,
        "severity": incident.severity.value,
        "status": incident.status.value,
        "created_at": incident.created_at.isoformat()
    }


@router.get("/")
async def get_incidents(
    limit: int = 50,
    offset: int = 0,
    status: str = None,
    severity: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get incidents"""
    query = db.query(Incident)
    
    if status:
        query = query.filter(Incident.status == IncidentStatus[status.upper()])
    
    if severity:
        query = query.filter(Incident.severity == IncidentSeverity[severity.upper()])
    
    incidents = query.order_by(Incident.created_at.desc()).limit(limit).offset(offset).all()
    
    return {
        "incidents": [
            {
                "id": incident.id,
                "incident_id": incident.incident_id,
                "title": incident.title,
                "severity": incident.severity.value,
                "status": incident.status.value,
                "created_at": incident.created_at.isoformat(),
                "updated_at": incident.updated_at.isoformat() if incident.updated_at else None
            }
            for incident in incidents
        ],
        "count": len(incidents)
    }


@router.get("/{incident_id}")
async def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get incident details"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return {
        "id": incident.id,
        "incident_id": incident.incident_id,
        "title": incident.title,
        "severity": incident.severity.value,
        "category": incident.category,
        "description": incident.description,
        "status": incident.status.value,
        "assigned_analyst": incident.assigned_analyst,
        "resolution": incident.resolution,
        "created_at": incident.created_at.isoformat(),
        "updated_at": incident.updated_at.isoformat() if incident.updated_at else None
    }


@router.patch("/{incident_id}")
async def update_incident(
    incident_id: int,
    request: IncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update incident"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    # Update fields
    if request.title:
        incident.title = request.title
    if request.severity:
        incident.severity = IncidentSeverity[request.severity.upper()]
    if request.status:
        old_status = incident.status.value
        incident.status = IncidentStatus[request.status.upper()]
        
        # Add timeline entry
        timeline = IncidentTimeline(
            incident_id=incident.id,
            action=f"Status changed from {old_status} to {request.status.upper()}",
            user_id=current_user.id
        )
        db.add(timeline)
    
    if request.assigned_analyst:
        incident.assigned_analyst = request.assigned_analyst
    if request.resolution:
        incident.resolution = request.resolution
    
    incident.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(incident)
    
    return {
        "id": incident.id,
        "incident_id": incident.incident_id,
        "status": incident.status.value,
        "updated_at": incident.updated_at.isoformat()
    }


@router.get("/{incident_id}/timeline")
async def get_incident_timeline(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get incident timeline"""
    timeline = db.query(IncidentTimeline).filter(
        IncidentTimeline.incident_id == incident_id
    ).order_by(IncidentTimeline.timestamp.desc()).all()
    
    return {
        "timeline": [
            {
                "id": entry.id,
                "timestamp": entry.timestamp.isoformat(),
                "action": entry.action,
                "user_id": entry.user_id,
                "details": entry.details
            }
            for entry in timeline
        ]
    }


@router.post("/{incident_id}/timeline")
async def add_timeline_entry(
    incident_id: int,
    request: TimelineEntry,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add timeline entry"""
    # Verify incident exists
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    timeline = IncidentTimeline(
        incident_id=incident_id,
        action=request.action,
        user_id=current_user.id,
        details=request.details
    )
    
    db.add(timeline)
    db.commit()
    db.refresh(timeline)
    
    return {
        "id": timeline.id,
        "timestamp": timeline.timestamp.isoformat(),
        "action": timeline.action
    }
