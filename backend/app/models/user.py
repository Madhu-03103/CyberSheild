"""User model"""
from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    INVESTIGATOR = "INVESTIGATOR"
    VIEWER = "VIEWER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Integer, default=1)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"
