"""Incident models"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class IncidentStatus(enum.Enum):
    NEW = "NEW"
    TRIAGED = "TRIAGED"
    INVESTIGATING = "INVESTIGATING"
    CONTAINED = "CONTAINED"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class IncidentSeverity(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    severity = Column(SQLEnum(IncidentSeverity), nullable=False)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    assigned_analyst = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.NEW, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolution = Column(Text, nullable=True)
    incident_metadata = Column(Text, nullable=True)  # JSON string - renamed from metadata

    def __repr__(self):
        return f"<Incident(id={self.incident_id}, status={self.status}, severity={self.severity})>"


class IncidentTimeline(Base):
    __tablename__ = "incident_timeline"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    action = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    details = Column(Text, nullable=True)  # JSON string

    def __repr__(self):
        return f"<IncidentTimeline(incident_id={self.incident_id}, action={self.action})>"
