"""Indicator models"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class IndicatorType(enum.Enum):
    URL = "URL"
    DOMAIN = "DOMAIN"
    IP = "IP"
    EMAIL = "EMAIL"
    HASH = "HASH"
    KEYWORD = "KEYWORD"


class IndicatorStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"


class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, index=True)
    indicator = Column(String(500), nullable=False, index=True)
    indicator_type = Column(SQLEnum(IndicatorType), nullable=False)
    threat_category = Column(String(50), nullable=True)
    risk_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    first_seen = Column(DateTime(timezone=True), server_default=func.now())
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    source = Column(String(100), nullable=True)
    status = Column(SQLEnum(IndicatorStatus), default=IndicatorStatus.ACTIVE)
    tags = Column(Text, nullable=True)  # JSON array
    related_incidents = Column(Text, nullable=True)  # JSON array

    def __repr__(self):
        return f"<Indicator(type={self.indicator_type}, indicator={self.indicator[:50]})>"


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    indicator = Column(String(500), nullable=False, index=True)
    indicator_type = Column(SQLEnum(IndicatorType), nullable=False)
    added_by = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="ACTIVE")
    notes = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Watchlist(indicator={self.indicator[:50]}, status={self.status})>"


class WatchlistMatch(Base):
    __tablename__ = "watchlist_matches"

    id = Column(Integer, primary_key=True, index=True)
    watchlist_id = Column(Integer, nullable=False)
    threat_event_id = Column(Integer, nullable=False)
    matched_at = Column(DateTime(timezone=True), server_default=func.now())
    severity = Column(String(20), nullable=False)
    notified = Column(Integer, default=0)

    def __repr__(self):
        return f"<WatchlistMatch(watchlist_id={self.watchlist_id}, threat_id={self.threat_event_id})>"
