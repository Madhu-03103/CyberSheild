"""Analytics routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.threat import ThreatEvent, ThreatType, Severity
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("/threats-by-category")
async def get_threats_by_category(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get threat distribution by category"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    results = db.query(
        ThreatEvent.threat_type,
        func.count(ThreatEvent.id).label('count')
    ).filter(
        ThreatEvent.timestamp >= start_date
    ).group_by(
        ThreatEvent.threat_type
    ).all()
    
    return {
        "data": [
            {
                "category": result.threat_type.value,
                "count": result.count
            }
            for result in results
        ],
        "period_days": days
    }


@router.get("/threats-over-time")
async def get_threats_over_time(
    hours: int = 24,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get threat trends over time"""
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    # Group by hour
    results = db.query(
        func.date_trunc('hour', ThreatEvent.timestamp).label('hour'),
        ThreatEvent.threat_type,
        func.count(ThreatEvent.id).label('count')
    ).filter(
        ThreatEvent.timestamp >= start_time
    ).group_by(
        'hour',
        ThreatEvent.threat_type
    ).order_by('hour').all()
    
    # Format data
    data_points = {}
    for result in results:
        hour_str = result.hour.strftime('%H:%00')
        if hour_str not in data_points:
            data_points[hour_str] = {
                'time': hour_str,
                'SAFE': 0,
                'PHISHING': 0,
                'MALWARE': 0,
                'SPAM': 0,
                'SUSPICIOUS': 0
            }
        data_points[hour_str][result.threat_type.value] = result.count
    
    return {
        "data": list(data_points.values()),
        "period_hours": hours
    }


@router.get("/severity-distribution")
async def get_severity_distribution(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get threat distribution by severity"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    results = db.query(
        ThreatEvent.severity,
        func.count(ThreatEvent.id).label('count')
    ).filter(
        ThreatEvent.timestamp >= start_date
    ).group_by(
        ThreatEvent.severity
    ).all()
    
    return {
        "data": [
            {
                "severity": result.severity.value,
                "count": result.count
            }
            for result in results
        ],
        "period_days": days
    }


@router.get("/top-indicators")
async def get_top_indicators(
    limit: int = 10,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get top threat indicators"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # This is a simplified version - would be more complex in production
    results = db.query(
        ThreatEvent.entity,
        func.count(ThreatEvent.id).label('count'),
        func.avg(ThreatEvent.risk_score).label('avg_risk')
    ).filter(
        ThreatEvent.timestamp >= start_date,
        ThreatEvent.threat_type != ThreatType.SAFE
    ).group_by(
        ThreatEvent.entity
    ).order_by(
        func.count(ThreatEvent.id).desc()
    ).limit(limit).all()
    
    return {
        "indicators": [
            {
                "indicator": result.entity[:100],
                "count": result.count,
                "avg_risk_score": round(float(result.avg_risk), 1)
            }
            for result in results
        ],
        "period_days": days
    }


@router.get("/summary")
async def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get analytics summary"""
    
    # Today's stats
    today = datetime.utcnow().date()
    tomorrow = today + timedelta(days=1)
    
    total_today = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.timestamp >= today,
        ThreatEvent.timestamp < tomorrow
    ).scalar() or 0
    
    threats_today = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.timestamp >= today,
        ThreatEvent.timestamp < tomorrow,
        ThreatEvent.threat_type != ThreatType.SAFE
    ).scalar() or 0
    
    # Overall stats
    total_all_time = db.query(func.count(ThreatEvent.id)).scalar() or 0
    
    threats_all_time = db.query(func.count(ThreatEvent.id)).filter(
        ThreatEvent.threat_type != ThreatType.SAFE
    ).scalar() or 0
    
    avg_risk = db.query(func.avg(ThreatEvent.risk_score)).filter(
        ThreatEvent.threat_type != ThreatType.SAFE
    ).scalar() or 0.0
    
    return {
        "today": {
            "total_events": total_today,
            "threats_detected": threats_today,
            "safe_events": total_today - threats_today
        },
        "all_time": {
            "total_events": total_all_time,
            "threats_detected": threats_all_time,
            "safe_events": total_all_time - threats_all_time,
            "avg_risk_score": round(float(avg_risk), 1)
        },
        "timestamp": datetime.utcnow().isoformat()
    }
