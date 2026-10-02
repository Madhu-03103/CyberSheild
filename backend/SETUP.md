# 🚀 CyberShield AI Backend Setup Guide

## ✅ What's Been Created

### 1. **Core Backend Structure**
```
backend/
├── app/
│   ├── __init__.py          ✅ Package init
│   ├── main.py              ✅ FastAPI app
│   ├── config.py            ✅ Configuration
│   ├── database.py          ✅ Database setup
│   ├── models/              ✅ Database models
│   │   ├── user.py          ✅ User model
│   │   ├── threat.py        ✅ Threat models
│   │   ├── incident.py      ✅ Incident models
│   │   └── indicator.py     ✅ Indicator models
│   └── routes/              ✅ API endpoints
│       ├── auth.py          ✅ Authentication
│       └── dashboard.py     ✅ Dashboard API
├── requirements.txt         ✅ Dependencies
└── .env.example            ✅ Config template
```

### 2. **Database Models Implemented**
- ✅ Users (with roles: ADMIN, ANALYST, INVESTIGATOR, VIEWER)
- ✅ ThreatEvents (all threat data)
- ✅ URLScans (URL analysis results)
- ✅ EmailScans (Email analysis results)
- ✅ Incidents (incident management)
- ✅ IncidentTimeline (audit trail)
- ✅ Indicators (threat indicators)
- ✅ Watchlist (monitoring)
- ✅ WatchlistMatches (matches)

### 3. **API Endpoints Ready**
- ✅ `POST /api/auth/register` - Register user
- ✅ `POST /api/auth/login` - Login
- ✅ `GET /api/auth/me` - Get current user
- ✅ `GET /api/dashboard/summary` - Dashboard stats
- ✅ `GET /api/dashboard/live-timeline` - Recent events

---

## 🔧 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Install packages
pip install -r requirements.txt
```

### Step 2: Set Up Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
```

### Step 3: Initialize Database

```bash
# Run the FastAPI server (it will create tables automatically)
python -m app.main
```

Or manually:
```python
python
>>> from app.database import init_db
>>> init_db()
>>> exit()
```

### Step 4: Run Backend Server

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Backend will be available at: **http://localhost:8000**

### Step 5: Test API

Visit: **http://localhost:8000/docs** for interactive API documentation

Test endpoints:
```bash
# Health check
curl http://localhost:8000/health

# Dashboard summary
curl http://localhost:8000/api/dashboard/summary
```

---

## 📝 Next Steps to Complete

### Still Need to Create:

1. **ML Service** (`app/services/ml_service.py`)
   - URL classification
   - Email analysis
   - Feature extraction
   - Risk scoring

2. **Threat Routes** (`app/routes/threats.py`)
   - URL scanning endpoint
   - Email scanning endpoint
   - Threat management

3. **Analytics Routes** (`app/routes/analytics.py`)
   - Chart data endpoints
   - Time-series data
   - Aggregations

4. **Incidents Routes** (`app/routes/incidents.py`)
   - CRUD operations
   - Timeline management
   - Status updates

5. **WebSocket Server** (`app/websocket/events.py`)
   - Real-time event broadcasting
   - Client connection management
   - Live updates

6. **Background Workers** (Optional)
   - Threat feed ingestion
   - Scheduled intelligence updates
   - Automated tasks

7. **Frontend Updates**
   - Update `lib/api.ts` to use real backend
   - Add WebSocket client
   - Add authentication
   - Update all components

---

## 🔌 Frontend Integration

### Update Frontend API Client

Create `lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = {
  // Dashboard
  async getDashboardSummary() {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`)
    return response.json()
  },

  // URL Scan
  async scanURL(url: string) {
    const response = await fetch(`${API_BASE_URL}/api/threats/url/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    return response.json()
  },

  // Email Scan
  async scanEmail(emailData: any) {
    const response = await fetch(`${API_BASE_URL}/api/threats/email/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    })
    return response.json()
  }
}
```

---

## 🗄️ Database

### Using SQLite (Default - Development)
- No setup needed
- File: `cybershield.db` (auto-created)
- Good for development and testing

### Using PostgreSQL (Production)

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE cybershield;
CREATE USER cybershield_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cybershield TO cybershield_user;
```

3. Update `.env`:
```
DATABASE_URL=postgresql://cybershield_user:your_password@localhost:5432/cybershield
```

---

## 🔐 Security

### Create Admin User

```python
python
>>> from app.database import SessionLocal
>>> from app.models.user import User, UserRole
>>> from app.routes.auth import get_password_hash
>>> 
>>> db = SessionLocal()
>>> admin = User(
...     username="admin",
...     email="admin@cybershield.local",
...     password_hash=get_password_hash("change_this_password"),
...     role=UserRole.ADMIN
... )
>>> db.add(admin)
>>> db.commit()
>>> print("Admin user created!")
>>> exit()
```

### Generate Secret Key

```python
python
>>> import secrets
>>> print(secrets.token_urlsafe(32))
```

Copy the output to `.env` as `SECRET_KEY`

---

## 📊 Testing

### Create Test Data

```python
python
>>> from app.database import SessionLocal, init_db
>>> from app.models.threat import ThreatEvent, EventSource, Severity, ThreatType
>>> from datetime import datetime
>>> import uuid
>>> 
>>> init_db()
>>> db = SessionLocal()
>>> 
>>> # Create test threat
>>> threat = ThreatEvent(
...     event_id=f"EVT-{uuid.uuid4().hex[:8]}",
...     source=EventSource.URL_SCANNER,
...     event_type="URL_THREAT",
...     severity=Severity.HIGH,
...     confidence=0.92,
...     entity="https://suspicious-site.com",
...     risk_score=87,
...     threat_type=ThreatType.PHISHING,
...     status="NEW"
... )
>>> db.add(threat)
>>> db.commit()
>>> print("Test threat created!")
>>> exit()
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Database Issues
```bash
# Reset database
rm cybershield.db
python -m app.main  # Will recreate
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📖 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## ✅ Current Status

### ✅ Completed:
- Database models
- Authentication system
- Dashboard API
- Core structure
- Configuration

### ⏳ In Progress:
- ML service integration
- Threat scanning endpoints
- WebSocket real-time
- Analytics endpoints
- Frontend integration

### 📋 TODO:
- Background workers
- External API integrations
- Advanced analytics
- Report generation
- Email notifications

---

## 🚀 Production Deployment

See `DEPLOYMENT.md` for production deployment with Docker, PostgreSQL, and HTTPS.

---

**Backend foundation is ready! Next: Complete ML service and threat scanning endpoints.**
