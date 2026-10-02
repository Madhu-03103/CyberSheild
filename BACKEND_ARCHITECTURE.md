# 🏗️ Real-Time Public-Sector Cyber Threat Intelligence Platform
## Backend Architecture Implementation Plan

---

## 🎯 TRANSFORMATION OVERVIEW

**Current State:** Frontend-only with simulated data  
**Target State:** Full-stack real-time platform with backend, database, WebSocket, ML pipeline

---

## 📊 ARCHITECTURE LAYERS

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  - React Components - Real-time Updates - WebSocket Client  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   API GATEWAY (Express/FastAPI)              │
│  - REST Endpoints - Authentication - Rate Limiting - CORS   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  WEBSOCKET/SSE SERVER                        │
│  - Live Events - Broadcast Updates - Connection Management  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  EVENT PROCESSING ENGINE                     │
│  - Event Normalization - Threat Detection - Risk Scoring    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  ML PREDICTION ENGINE                        │
│  - URL Classification - Email Analysis - Risk Assessment    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              DATABASE (PostgreSQL/SQLite)                    │
│  - Threats - Incidents - Indicators - Audit Logs - Users    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECH STACK

### Backend:
- **API Server:** Python Flask/FastAPI
- **Real-Time:** Socket.IO or Server-Sent Events
- **Database:** PostgreSQL (production) / SQLite (development)
- **ORM:** SQLAlchemy
- **ML:** scikit-learn (existing models)
- **Task Queue:** Celery + Redis (optional for background jobs)
- **Authentication:** JWT tokens
- **CORS:** Configured for Next.js frontend

### Frontend Updates:
- **WebSocket Client:** socket.io-client
- **API Client:** Axios with interceptors
- **State Management:** React Context + WebSocket updates
- **Auth:** JWT storage + protected routes

---

## 📁 PROJECT STRUCTURE

```
cybershield-ai/
├── frontend/              # Next.js app (existing)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── backend/               # NEW Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI app
│   │   ├── config.py     # Configuration
│   │   ├── database.py   # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── threat.py
│   │   │   ├── incident.py
│   │   │   ├── indicator.py
│   │   │   └── ...
│   │   ├── routes/       # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── threats.py
│   │   │   ├── analytics.py
│   │   │   ├── incidents.py
│   │   │   └── ...
│   │   ├── services/     # Business logic
│   │   │   ├── ml_service.py
│   │   │   ├── threat_detection.py
│   │   │   ├── risk_scoring.py
│   │   │   └── ...
│   │   ├── websocket/    # WebSocket handlers
│   │   │   └── events.py
│   │   ├── ml/           # ML models
│   │   │   ├── url_classifier.py
│   │   │   ├── email_classifier.py
│   │   │   └── models/   # Trained model files
│   │   └── utils/        # Utilities
│   │       ├── validators.py
│   │       ├── security.py
│   │       └── ...
│   ├── migrations/       # Database migrations
│   ├── tests/            # Backend tests
│   ├── requirements.txt
│   └── README.md
│
├── docker-compose.yml    # NEW - Full stack deployment
├── .env.example          # Environment variables template
└── README.md             # Updated documentation
```

---

## 🗄️ DATABASE SCHEMA

### Core Tables:

```sql
-- Users & Authentication
users
├── id (PK)
├── username
├── email
├── password_hash
├── role (ADMIN, ANALYST, INVESTIGATOR, VIEWER)
├── created_at
└── last_login

-- Threat Events
threat_events
├── id (PK)
├── event_id (UUID)
├── timestamp
├── source (URL_SCANNER, EMAIL_INSPECTOR, etc.)
├── event_type (URL_THREAT, EMAIL_THREAT, etc.)
├── severity (CRITICAL, HIGH, MEDIUM, LOW)
├── confidence (0-100)
├── entity (URL, email, domain, IP)
├── status (NEW, INVESTIGATING, RESOLVED)
├── risk_score (0-100)
├── threat_type (PHISHING, MALWARE, SPAM, SUSPICIOUS, SAFE)
├── geolocation_data (JSON)
├── metadata (JSON)
└── created_by (FK to users)

-- URL Scans
url_scans
├── id (PK)
├── scan_id (UUID)
├── url
├── prediction (PHISHING, MALWARE, etc.)
├── risk_score
├── confidence
├── features (JSON - url_length, domain_age, etc.)
├── feature_importance (JSON)
├── timestamp
├── user_id (FK)
└── threat_event_id (FK)

-- Email Scans
email_scans
├── id (PK)
├── scan_id (UUID)
├── sender
├── recipient
├── subject
├── prediction
├── risk_score
├── confidence
├── indicators (JSON array)
├── authentication (JSON - SPF, DKIM, DMARC)
├── features (JSON)
├── timestamp
├── user_id (FK)
└── threat_event_id (FK)

-- Indicators
indicators
├── id (PK)
├── indicator (URL, domain, IP, email, hash)
├── indicator_type
├── threat_category
├── risk_score
├── confidence
├── first_seen
├── last_seen
├── source
├── status (ACTIVE, ARCHIVED)
├── tags (JSON array)
└── related_incidents (JSON array)

-- Domains
domains
├── id (PK)
├── domain_name
├── registration_date
├── domain_age
├── dns_info (JSON)
├── https_status
├── certificate_info (JSON)
├── reputation_score
├── threat_history (JSON array)
├── first_seen
├── last_observed
└── watchlist_status

-- Incidents
incidents
├── id (PK)
├── incident_id (e.g., INC-2026-0042)
├── title
├── severity
├── category
├── description
├── assigned_analyst (FK to users)
├── status (NEW, TRIAGED, INVESTIGATING, CONTAINED, RESOLVED, CLOSED)
├── created_at
├── updated_at
├── resolution
└── metadata (JSON)

-- Incident Timeline
incident_timeline
├── id (PK)
├── incident_id (FK)
├── timestamp
├── action
├── user_id (FK)
├── details (JSON)

-- Investigations
investigations
├── id (PK)
├── investigation_id
├── analyst_id (FK to users)
├── created_at
├── updated_at
├── severity
├── status
├── description
└── metadata (JSON)

-- Investigation Evidence
investigation_evidence
├── id (PK)
├── investigation_id (FK)
├── evidence_type
├── evidence_data (JSON)
├── added_by (FK to users)
├── added_at

-- Watchlist
watchlist
├── id (PK)
├── indicator
├── indicator_type
├── added_by (FK to users)
├── created_at
├── status (ACTIVE, PAUSED)
├── notes

-- Watchlist Matches
watchlist_matches
├── id (PK)
├── watchlist_id (FK)
├── threat_event_id (FK)
├── matched_at
├── severity
└── notified

-- ML Predictions
ml_predictions
├── id (PK)
├── prediction_id
├── model_name
├── model_version
├── input_data (JSON)
├── prediction
├── confidence
├── inference_time_ms
├── timestamp

-- Model Versions
model_versions
├── id (PK)
├── model_name
├── version
├── accuracy
├── precision
├── recall
├── f1_score
├── roc_auc
├── trained_at
├── dataset_version
├── status (ACTIVE, ARCHIVED)

-- Audit Logs
audit_logs
├── id (PK)
├── user_id (FK)
├── role
├── action
├── resource
├── resource_id
├── timestamp
├── ip_address
├── result (SUCCESS, FAILURE)
└── details (JSON)

-- Notifications
notifications
├── id (PK)
├── user_id (FK)
├── type (CRITICAL_THREAT, INCIDENT, WATCHLIST_MATCH, etc.)
├── title
├── message
├── severity
├── read (boolean)
├── created_at
└── metadata (JSON)

-- System Health
system_health
├── id (PK)
├── component (FRONTEND, BACKEND, DATABASE, ML_SERVICE, etc.)
├── status (ONLINE, DEGRADED, OFFLINE)
├── response_time_ms
├── error_count
├── last_check
└── metadata (JSON)

-- Threat Sources
threat_sources
├── id (PK)
├── source_name
├── source_type (API, DATABASE, FEED)
├── status (CONNECTED, DEGRADED, OFFLINE)
├── last_update
├── records_count
├── latency_ms
└── error_count
```

---

## 🔌 API ENDPOINTS

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Dashboard
```
GET    /api/dashboard/summary
GET    /api/dashboard/live-timeline
```

### Threats
```
GET    /api/threats
GET    /api/threats/:id
POST   /api/threats
PATCH  /api/threats/:id
DELETE /api/threats/:id
GET    /api/threats/live (SSE endpoint)
```

### URL Scanner
```
POST   /api/url/scan
GET    /api/url/scans
GET    /api/url/scans/:id
GET    /api/url/history
```

### Email Inspector
```
POST   /api/email/analyze
GET    /api/email/scans
GET    /api/email/scans/:id
```

### Analytics
```
GET    /api/analytics/summary
GET    /api/analytics/threats-by-category
GET    /api/analytics/threats-over-time
GET    /api/analytics/severity-distribution
GET    /api/analytics/top-indicators
```

### Map Events
```
GET    /api/map/events
GET    /api/map/events/live (SSE)
```

### Incidents
```
GET    /api/incidents
GET    /api/incidents/:id
POST   /api/incidents
PATCH  /api/incidents/:id
DELETE /api/incidents/:id
GET    /api/incidents/:id/timeline
POST   /api/incidents/:id/timeline
```

### Investigations
```
GET    /api/investigations
GET    /api/investigations/:id
POST   /api/investigations
PATCH  /api/investigations/:id
POST   /api/investigations/:id/evidence
```

### Indicators
```
GET    /api/indicators
GET    /api/indicators/:id
POST   /api/indicators
PATCH  /api/indicators/:id
DELETE /api/indicators/:id
```

### Domains
```
GET    /api/domains/:domain
GET    /api/domains/:domain/history
POST   /api/domains/analyze
```

### Watchlist
```
GET    /api/watchlist
POST   /api/watchlist
PATCH  /api/watchlist/:id
DELETE /api/watchlist/:id
GET    /api/watchlist/matches
```

### ML Models
```
GET    /api/models
GET    /api/models/:model/metrics
GET    /api/models/:model/predictions
GET    /api/models/performance
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id
```

### Reports
```
GET    /api/reports
POST   /api/reports/generate
GET    /api/reports/:id
GET    /api/reports/:id/download
```

### Audit Logs
```
GET    /api/audit-logs
GET    /api/audit-logs/:id
```

### System Health
```
GET    /api/system/health
GET    /api/system/status
```

---

## ⚡ WEBSOCKET EVENTS

### Client → Server
```javascript
connect
authenticate
subscribe_threats
unsubscribe_threats
subscribe_incidents
subscribe_analytics
ping
```

### Server → Client
```javascript
connected
authenticated
threat_detected
incident_created
incident_updated
watchlist_match
notification
dashboard_update
analytics_update
system_status
disconnected
error
```

---

## 🔐 SECURITY IMPLEMENTATION

### Authentication Flow:
```
1. User Login → Verify credentials
2. Generate JWT token (access + refresh)
3. Return tokens to client
4. Client stores in httpOnly cookie or localStorage
5. Include token in all API requests
6. Backend verifies token on each request
7. Refresh token when expired
```

### Role-Based Access:
```
ADMIN: Full access
ANALYST: Threat analysis, investigations, incidents
INVESTIGATOR: Investigations, evidence, incident details
VIEWER: Read-only dashboard, analytics, reports
```

### Security Features:
- Password hashing (bcrypt)
- JWT tokens with expiration
- Rate limiting (Flask-Limiter)
- Input validation (Pydantic)
- SQL injection protection (SQLAlchemy ORM)
- XSS protection (sanitization)
- CORS configuration
- HTTPS required in production
- API key management for external services
- Audit logging for all sensitive operations

---

## 🎯 IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1)
- ✅ Database schema design
- ✅ Backend API setup (Flask/FastAPI)
- ✅ Database ORM models
- ✅ Basic authentication
- ✅ Core REST endpoints

### Phase 2: ML Integration (Week 1)
- ✅ ML service setup
- ✅ URL classification endpoint
- ✅ Email analysis endpoint
- ✅ Feature extraction
- ✅ Risk scoring algorithm

### Phase 3: Real-Time (Week 2)
- ✅ WebSocket server
- ✅ Event processing engine
- ✅ Live dashboard updates
- ✅ Frontend WebSocket client
- ✅ Connection management

### Phase 4: Features (Week 2)
- ✅ Incident management
- ✅ Investigation system
- ✅ Watchlist functionality
- ✅ Domain intelligence
- ✅ Analytics queries

### Phase 5: Advanced (Week 3)
- ✅ Notification system
- ✅ Report generation
- ✅ Audit logging
- ✅ System health monitoring
- ✅ Role-based access

### Phase 6: Production (Week 3)
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Docker deployment
- ✅ Documentation
- ✅ Testing

---

## 📝 NEXT STEPS

1. **Create backend directory structure**
2. **Set up Python virtual environment**
3. **Install dependencies**
4. **Create database schema**
5. **Implement core API endpoints**
6. **Set up ML service**
7. **Implement WebSocket server**
8. **Update frontend to use real APIs**
9. **Add authentication**
10. **Deploy and test**

---

**Ready to begin implementation?**
