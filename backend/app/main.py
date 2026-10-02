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
