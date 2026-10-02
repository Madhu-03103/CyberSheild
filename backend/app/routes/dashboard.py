"""Dashboard routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.threat import ThreatEvent, URLScan, EmailScan, Severity
from app.models.incident import Incident, IncidentStatus

router = APIRouter()


@router.get("/summary")
async def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary statistics"""
    
    # Get today's date range
    today = datetime.utcnow().date()
    tomorrow = today + timedelta(days=1)
    
    # Total events today
    total_events_today = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.timestamp >= today,
        ThreatEvent.timestamp < tomorrow
    ).scalar() or 0
    
    # Active threats (non-resolved)
    active_threats = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.status != "RESOLVED"
    ).scalar() or 0
    
    # Critical alerts
    critical_alerts = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.severity == Severity.CRITICAL,
        ThreatEvent.status != "RESOLVED"
    ).scalar() or 0
    
    # Open incidents
    open_incidents = db.query(func.count(Incident.id)).filter(
        Incident.status.in_([IncidentStatus.NEW, IncidentStatus.INVESTIGATING, IncidentStatus.TRIAGED])
    ).scalar() or 0
    
    # Resolved incidents today
    resolved_incidents_today = db.query(func.count(Incident.id)).filter(
        Incident.status == IncidentStatus.RESOLVED,
        Incident.updated_at >= today,
        Incident.updated_at < tomorrow
    ).scalar() or 0
    
    # Threats detected in last hour
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    threats_last_hour = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.timestamp >= one_hour_ago,
        ThreatEvent.threat_type != "SAFE"
    ).scalar() or 0
    
    # Safe vs Threat ratio
    total_scans = db.query(func.count(ThreatEvent.id)).scalar() or 1
    safe_count = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.threat_type == "SAFE"
    ).scalar() or 0
    threat_count = total_scans - safe_count
    
    # Average risk score
    avg_risk_score = db.query(func.avg(ThreatEvent.risk_score)).filter(
        ThreatEvent.threat_type != "SAFE"
    ).scalar() or 0.0
    
    # ML detection confidence
    avg_confidence = db.query(func.avg(ThreatEvent.confidence)).scalar() or 0.0
    
    # URL and Email scan counts
    url_scans_count = db.query(func.count(URLScan.id)).scalar() or 0
    email_scans_count = db.query(func.count(EmailScan.id)).scalar() or 0
    
    return {
        "total_events_today": total_events_today,
        "active_threats": active_threats,
        "critical_alerts": critical_alerts,
        "open_incidents": open_incidents,
        "resolved_incidents": resolved_incidents_today,
        "threats_last_hour": threats_last_hour,
        "safe_count": safe_count,
        "threat_count": threat_count,
        "detection_rate": round((threat_count / total_scans * 100) if total_scans > 0 else 0, 1),
        "avg_risk_score": round(float(avg_risk_score), 1),
        "avg_confidence": round(float(avg_confidence) * 100, 1),
        "url_scans_count": url_scans_count,
        "email_scans_count": email_scans_count,
        "system_status": {
            "frontend": "ONLINE",
            "backend": "ONLINE",
            "database": "CONNECTED",
            "ml_service": "OPERATIONAL",
            "websocket": "AVAILABLE"
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@router.get("/live-timeline")
async def get_live_timeline(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent events for live timeline"""
    events = db.query(ThreatEvent).order_by(
        ThreatEvent.timestamp.desc()
    ).limit(limit).all()
    
    timeline = []
    for event in events:
        timeline.append({
            "id": event.id,
            "event_id": event.event_id,
            "timestamp": event.timestamp.isoformat(),
            "source": event.source.value,
            "event_type": event.event_type,
            "severity": event.severity.value,
            "threat_type": event.threat_type.value,
            "entity": event.entity[:100],  # Truncate long URLs
            "risk_score": event.risk_score,
            "status": event.status
        })
    
    return {
        "events": timeline,
        "count": len(timeline),
        "timestamp": datetime.utcnow().isoformat()
    }
