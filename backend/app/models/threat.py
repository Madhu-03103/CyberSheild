"""Threat event models"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class ThreatType(enum.Enum):
    SAFE = "SAFE"
    PHISHING = "PHISHING"
    MALWARE = "MALWARE"
    SPAM = "SPAM"
    SUSPICIOUS = "SUSPICIOUS"


class Severity(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class EventSource(enum.Enum):
    URL_SCANNER = "URL_SCANNER"
    EMAIL_INSPECTOR = "EMAIL_INSPECTOR"
    DOMAIN_INTEL = "DOMAIN_INTEL"
    ML_ENGINE = "ML_ENGINE"
    WATCHLIST = "WATCHLIST"
    EXTERNAL_FEED = "EXTERNAL_FEED"


class ThreatEvent(Base):
    __tablename__ = "threat_events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    source = Column(SQLEnum(EventSource), nullable=False)
    event_type = Column(String(50), nullable=False)
    severity = Column(SQLEnum(Severity), nullable=False, index=True)
    confidence = Column(Float, nullable=False)
    entity = Column(Text, nullable=False)
    status = Column(String(50), default="NEW")
    risk_score = Column(Float, nullable=False)
    threat_type = Column(SQLEnum(ThreatType), nullable=False)
    geolocation_data = Column(Text, nullable=True)  # JSON string
    event_metadata = Column(Text, nullable=True)  # JSON string - renamed from metadata
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    def __repr__(self):
        return f"<ThreatEvent(id={self.event_id}, type={self.threat_type}, severity={self.severity})>"


class URLScan(Base):
    __tablename__ = "url_scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), unique=True, nullable=False, index=True)
    url = Column(Text, nullable=False)
    prediction = Column(SQLEnum(ThreatType), nullable=False)
    risk_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    features = Column(Text, nullable=True)  # JSON string
    feature_importance = Column(Text, nullable=True)  # JSON string
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    threat_event_id = Column(Integer, ForeignKey("threat_events.id"), nullable=True)

    def __repr__(self):
        return f"<URLScan(id={self.scan_id}, prediction={self.prediction}, risk={self.risk_score})>"


class EmailScan(Base):
    __tablename__ = "email_scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), unique=True, nullable=False, index=True)
    sender = Column(String(255), nullable=False)
    recipient = Column(String(255), nullable=True)
    subject = Column(Text, nullable=True)
    prediction = Column(SQLEnum(ThreatType), nullable=False)
    risk_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    indicators = Column(Text, nullable=True)  # JSON string
    authentication = Column(Text, nullable=True)  # JSON string
    features = Column(Text, nullable=True)  # JSON string
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    threat_event_id = Column(Integer, ForeignKey("threat_events.id"), nullable=True)

    def __repr__(self):
        return f"<EmailScan(id={self.scan_id}, prediction={self.prediction}, risk={self.risk_score})>"
