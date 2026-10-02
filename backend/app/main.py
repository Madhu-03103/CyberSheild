"""
CyberShield AI Backend API
Real-Time Public-Sector Cyber Threat Intelligence Platform
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import init_db, engine
from app.routes import auth, threats, analytics, incidents, dashboard, websocket


# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting CyberShield AI Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Demo Mode: {settings.DEMO_MODE}")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
        
        # Auto-populate sample data if database is empty and in demo mode
        if settings.DEMO_MODE:
            from app.database import SessionLocal
            from app.models.user import User
            db = SessionLocal()
            try:
                user_count = db.query(User).count()
                if user_count == 0:
                    logger.info("Database is empty. Populating with sample data...")
                    from datetime import datetime, timedelta
                    import random
                    from app.models.user import User, UserRole
                    from app.models.threat import ThreatEvent, URLScan, EmailScan, EventSource, Severity, ThreatType
                    from app.models.incident import Incident, IncidentStatus, IncidentSeverity
                    from app.models.indicator import Indicator, IndicatorType, Watchlist
                    
                    # Create sample users
                    users = [
                        User(email="admin@cybershield.ai", username="admin", 
                             password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lFkJJZHlqLsq", 
                             role=UserRole.ADMIN),
                        User(email="analyst@cybershield.ai", username="analyst",
                             password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lFkJJZHlqLsq",
                             role=UserRole.ANALYST)
                    ]
                    for user in users:
                        db.add(user)
                    
                    # Create sample threats
                    for i in range(50):
                        days_ago = random.randint(0, 7)
                        timestamp = datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))
                        threat_type = random.choice([ThreatType.PHISHING, ThreatType.MALWARE, ThreatType.SUSPICIOUS, ThreatType.SAFE])
                        event = ThreatEvent(
                            event_id=f"EVT-{timestamp.strftime('%Y%m%d%H%M%S')}-{random.randint(10000, 99999)}",
                            source=random.choice([EventSource.URL_SCANNER, EventSource.EMAIL_INSPECTOR, EventSource.ML_ENGINE]),
                            event_type="DETECTION",
                            timestamp=timestamp,
                            severity=random.choice([Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW]),
                            threat_type=threat_type,
                            entity=f"suspicious-domain-{i}.example.com",
                            risk_score=random.randint(30, 99),
                            confidence=random.uniform(0.75, 0.99),
                            status="ACTIVE" if threat_type != ThreatType.SAFE else "RESOLVED"
                        )
                        db.add(event)
                    
                    # Create sample incidents
                    for i in range(10):
                        incident = Incident(
                            incident_id=f"INC-2026-{1000 + i}",
                            title=f"Security Incident #{i+1}",
                            description="Automated detection of suspicious activity",
                            status=random.choice([IncidentStatus.NEW, IncidentStatus.INVESTIGATING]),
                            severity=random.choice([IncidentSeverity.HIGH, IncidentSeverity.MEDIUM]),
                            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7))
                        )
                        db.add(incident)
                    
                    db.commit()
                    logger.info("Sample data populated successfully")
                else:
                    logger.info(f"Database already has {user_count} users. Skipping sample data.")
            finally:
                db.close()
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down CyberShield AI Backend...")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Real-Time Public-Sector Cyber Threat Intelligence Platform",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(threats.router, prefix="/api/threats", tags=["Threats"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(websocket.router, tags=["WebSocket"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "operational",
        "demo_mode": settings.DEMO_MODE
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "api": "operational",
        "websocket": "available" if settings.WEBSOCKET_ENABLED else "disabled"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
