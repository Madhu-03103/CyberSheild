"""Threat scanning routes"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from datetime import datetime
import uuid
import json

from app.database import get_db
from app.models.threat import ThreatEvent, URLScan, EmailScan, ThreatType, Severity, EventSource
from app.models.user import User
from app.routes.auth import get_current_user
from app.services.ml_service import url_classifier, email_classifier

router = APIRouter()


# Request schemas
class URLScanRequest(BaseModel):
    url: str
    
    @validator('url')
    def validate_url(cls, v):
        if not v or len(v) < 10:
            raise ValueError('URL must be at least 10 characters')
        if not v.startswith(('http://', 'https://')):
            v = 'https://' + v
        return v


class EmailScanRequest(BaseModel):
    sender: str
    recipient: str = ""
    subject: str = ""
    body: str = ""


# Routes
@router.post("/url/scan")
async def scan_url(
    request: URLScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Scan URL for threats"""
    
    # Perform ML classification
    prediction, risk_score, confidence, features, feature_importance = url_classifier.classify(request.url)
    
    # Determine severity
    if risk_score >= 80:
        severity = Severity.CRITICAL
    elif risk_score >= 60:
        severity = Severity.HIGH
    elif risk_score >= 40:
        severity = Severity.MEDIUM
    else:
        severity = Severity.LOW
    
    # Create threat event
    event_id = f"EVT-{uuid.uuid4().hex[:8].upper()}"
    threat_event = ThreatEvent(
        event_id=event_id,
        source=EventSource.URL_SCANNER,
        event_type="URL_THREAT",
        severity=severity,
        confidence=confidence,
        entity=request.url,
        risk_score=risk_score,
        threat_type=ThreatType[prediction],
        status="NEW" if prediction != "SAFE" else "RESOLVED",
        created_by=current_user.id,
        metadata=json.dumps({
            'scan_type': 'url',
            'user_agent': 'CyberShield Scanner'
        })
    )
    
    db.add(threat_event)
    db.flush()
    
    # Create URL scan record
    scan_id = f"URL-{uuid.uuid4().hex[:8].upper()}"
    url_scan = URLScan(
        scan_id=scan_id,
        url=request.url,
        prediction=ThreatType[prediction],
        risk_score=risk_score,
        confidence=confidence,
        features=json.dumps(features),
        feature_importance=json.dumps(feature_importance),
        user_id=current_user.id,
        threat_event_id=threat_event.id
    )
    
    db.add(url_scan)
    db.commit()
    db.refresh(url_scan)
    
    return {
        "scan_id": scan_id,
        "event_id": event_id,
        "prediction": prediction,
        "risk_score": risk_score,
        "confidence": confidence,
        "severity": severity.value,
        "features": features,
        "feature_importance": feature_importance,
        "timestamp": url_scan.timestamp.isoformat(),
        "status": "completed"
    }


@router.post("/email/scan")
async def scan_email(
    request: EmailScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Scan email for threats"""
    
    # Perform ML classification
    prediction, risk_score, confidence, features, indicators = email_classifier.classify(
        request.sender,
        request.subject,
        request.body
    )
    
    # Determine severity
    if risk_score >= 80:
        severity = Severity.CRITICAL
    elif risk_score >= 60:
        severity = Severity.HIGH
    elif risk_score >= 40:
        severity = Severity.MEDIUM
    else:
        severity = Severity.LOW
    
    # Create threat event
    event_id = f"EVT-{uuid.uuid4().hex[:8].upper()}"
    threat_event = ThreatEvent(
        event_id=event_id,
        source=EventSource.EMAIL_INSPECTOR,
        event_type="EMAIL_THREAT",
        severity=severity,
        confidence=confidence,
        entity=request.sender,
        risk_score=risk_score,
        threat_type=ThreatType[prediction],
        status="NEW" if prediction != "SAFE" else "RESOLVED",
        created_by=current_user.id,
        metadata=json.dumps({
            'scan_type': 'email',
            'subject': request.subject[:100]
        })
    )
    
    db.add(threat_event)
    db.flush()
    
    # Create email scan record
    scan_id = f"EMAIL-{uuid.uuid4().hex[:8].upper()}"
    email_scan = EmailScan(
        scan_id=scan_id,
        sender=request.sender,
        recipient=request.recipient,
        subject=request.subject,
        prediction=ThreatType[prediction],
        risk_score=risk_score,
        confidence=confidence,
        indicators=json.dumps(indicators),
        authentication=json.dumps({
            'spf': features.get('spf', False),
            'dkim': features.get('dkim', False),
            'dmarc': features.get('dmarc', False)
        }),
        features=json.dumps(features),
        user_id=current_user.id,
        threat_event_id=threat_event.id
    )
    
    db.add(email_scan)
    db.commit()
    db.refresh(email_scan)
    
    return {
        "scan_id": scan_id,
        "event_id": event_id,
        "prediction": prediction,
        "risk_score": risk_score,
        "confidence": confidence,
        "severity": severity.value,
        "indicators": indicators,
        "authentication": {
            'spf': features.get('spf', False),
            'dkim': features.get('dkim', False),
            'dmarc': features.get('dmarc', False)
        },
        "features": features,
        "timestamp": email_scan.timestamp.isoformat(),
        "status": "completed"
    }


@router.get("/url/scans")
async def get_url_scans(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get URL scan history"""
    scans = db.query(URLScan).order_by(
        URLScan.timestamp.desc()
    ).limit(limit).offset(offset).all()
    
    return {
        "scans": [
            {
                "scan_id": scan.scan_id,
                "url": scan.url,
                "prediction": scan.prediction.value,
                "risk_score": scan.risk_score,
                "confidence": scan.confidence,
                "timestamp": scan.timestamp.isoformat()
            }
            for scan in scans
        ],
        "count": len(scans),
        "limit": limit,
        "offset": offset
    }


@router.get("/email/scans")
async def get_email_scans(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get email scan history"""
    scans = db.query(EmailScan).order_by(
        EmailScan.timestamp.desc()
    ).limit(limit).offset(offset).all()
    
    return {
        "scans": [
            {
                "scan_id": scan.scan_id,
                "sender": scan.sender,
                "subject": scan.subject,
                "prediction": scan.prediction.value,
                "risk_score": scan.risk_score,
                "confidence": scan.confidence,
                "timestamp": scan.timestamp.isoformat()
            }
            for scan in scans
        ],
        "count": len(scans),
        "limit": limit,
        "offset": offset
    }


@router.get("/events")
async def get_threat_events(
    limit: int = 50,
    offset: int = 0,
    severity: str = None,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get threat events"""
    query = db.query(ThreatEvent)
    
    if severity:
        query = query.filter(ThreatEvent.severity == Severity[severity.upper()])
    
    if status:
        query = query.filter(ThreatEvent.status == status.upper())
    
    events = query.order_by(ThreatEvent.timestamp.desc()).limit(limit).offset(offset).all()
    
    return {
        "events": [
            {
                "event_id": event.event_id,
                "source": event.source.value,
                "event_type": event.event_type,
                "severity": event.severity.value,
                "threat_type": event.threat_type.value,
                "risk_score": event.risk_score,
                "confidence": event.confidence,
                "entity": event.entity[:100],
                "status": event.status,
                "timestamp": event.timestamp.isoformat()
            }
            for event in events
        ],
        "count": len(events),
        "limit": limit,
        "offset": offset
    }
