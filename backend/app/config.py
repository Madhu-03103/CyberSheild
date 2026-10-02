"""Application configuration"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CyberShield AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database
    DATABASE_URL: str = "sqlite:///./cybershield.db"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"

    # ML Models
    ML_MODEL_PATH: str = "./app/ml/models"
    URL_MODEL_FILE: str = "url_classifier.joblib"
    EMAIL_MODEL_FILE: str = "email_classifier.joblib"

    # WebSocket
    WEBSOCKET_ENABLED: bool = True
    WEBSOCKET_PATH: str = "/ws"

    # Demo Mode
    DEMO_MODE: bool = True
    DEMO_EVENT_INTERVAL: int = 8

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/cybershield.log"

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra fields in .env

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
