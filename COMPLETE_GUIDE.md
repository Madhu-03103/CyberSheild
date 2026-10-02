# 🎯 CyberShield AI - Complete Integration Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Real-Time Features](#real-time-features)
5. [API Reference](#api-reference)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

---

## System Overview

**CyberShield AI** is a complete real-time cyber threat intelligence platform featuring:

### 🎨 Frontend (Next.js)
- 13 interactive dashboards
- Real-time WebSocket integration
- Responsive design
- Dark theme optimized for SOC environments

### ⚙️ Backend (FastAPI)
- RESTful API with 20+ endpoints
- WebSocket server for real-time updates
- SQLAlchemy ORM with PostgreSQL/SQLite
- JWT authentication
- ML-powered threat classification

### 🤖 ML Engine (Scikit-learn)
- URL threat classifier
- Email phishing detector
- Risk scoring algorithms
- Feature extraction and analysis

---

## Quick Start

### Prerequisites Check
```bash
# Check Python version (need 3.8+)
python --version

# Check Node version (need 18+)
node --version

# Check pip
pip --version

# Check npm
npm --version
```

### Installation (5 Minutes)

**1. Start Backend:**
```bash
# Windows
start-backend.bat

# Mac/Linux
chmod +x start-backend.sh
./start-backend.sh
```

This script will:
- Create Python virtual environment
- Install all dependencies
- Setup .env configuration
- Initialize database with sample data
- Start FastAPI server on port 8000

**2. Start Frontend (New Terminal):**
```bash
# Windows
start-frontend.bat

# Mac/Linux
chmod +x start-frontend.sh
./start-frontend.sh
```

This script will:
- Install npm dependencies
- Setup .env.local configuration
- Start Next.js dev server on port 3000

**3. Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**4. Login:**
```
Email: admin@cybershield.ai
Password: password
```

---

## Architecture

### System Flow

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Dashboard │ │ Scanner  │ │Analytics │ + 10 more │
│  └──────────┘ └──────────┘ └──────────┘           │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST API
                   │ WebSocket
┌──────────────────▼──────────────────────────────────┐
│              Backend (FastAPI)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   API    │ │WebSocket │ │   Auth   │           │
│  │ Routes   │ │  Server  │ │   JWT    │           │
│  └────┬─────┘ └──────────┘ └──────────┘           │
│       │                                             │
│  ┌────▼─────┐ ┌──────────┐ ┌──────────┐           │
│  │    ML    │ │ Database │ │ Services │           │
│  │  Engine  │ │   ORM    │ │ Business │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│          Database (PostgreSQL/SQLite)               │
│  Threats | Incidents | Users | Scans | Indicators  │
└─────────────────────────────────────────────────────┘
```

### Tech Stack Detail

**Frontend:**
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React

**Backend:**
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.8+
- **ORM**: SQLAlchemy 2.0
- **Database**: PostgreSQL/SQLite
- **Auth**: python-jose (JWT)
- **ML**: Scikit-learn
- **WebSocket**: Native FastAPI
- **Server**: Uvicorn

---

## Real-Time Features

### WebSocket Implementation

**Backend** (`backend/app/routes/websocket.py`):
```python
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    # Broadcasts real-time updates
```

**Frontend** (`lib/api.ts`):
```typescript
export function createWebSocket(onMessage: (data: any) => void): WebSocket {
  const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws'
  const ws = new WebSocket(wsUrl)
  // Handles incoming messages
}
```

### Event Types

The system broadcasts these real-time events:

1. **threat_event** - New threat detected
2. **dashboard_update** - Dashboard metrics changed
3. **incident_update** - Incident status changed
4. **analytics_update** - Analytics data refreshed

### Usage Example

```typescript
// In your dashboard
useEffect(() => {
  const ws = createWebSocket((data) => {
    if (data.type === 'threat_event') {
      // Update threat feed
      setThreats(prev => [data.data, ...prev])
    }
  })
  
  return () => ws.close()
}, [])
```

---

## API Reference

### Authentication

**Register User:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "full_name": "Full Name"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@cybershield.ai
password=password
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Dashboard APIs

**Get Summary:**
```bash
GET /api/dashboard/summary

Response:
{
  "total_events_today": 1284,
  "active_threats": 324,
  "critical_alerts": 84,
  "open_incidents": 23,
  "detection_rate": 94.7,
  ...
}
```

**Live Timeline:**
```bash
GET /api/dashboard/live-timeline?limit=20

Response:
{
  "events": [...],
  "count": 20
}
```

### Threat Scanning

**Scan URL:**
```bash
POST /api/threats/scan/url
Content-Type: application/json

{
  "url": "https://suspicious-site.com"
}

Response:
{
  "scan_id": 123,
  "url": "https://suspicious-site.com",
  "threat_type": "phishing",
  "risk_score": 85,
  "confidence": 0.92,
  "features": {...},
  "recommendations": [...]
}
```

**Scan Email:**
```bash
POST /api/threats/scan/email
Content-Type: application/json

{
  "sender": "attacker@evil.com",
  "recipient": "victim@example.com",
  "subject": "URGENT: Verify account",
  "body": "Click here immediately..."
}

Response:
{
  "scan_id": 124,
  "threat_type": "phishing",
  "risk_score": 92,
  "confidence": 0.89,
  "indicators": ["Urgency language", "Suspicious sender"],
  "authentication": {...}
}
```

### Analytics

**Get Overview:**
```bash
GET /api/analytics/overview?time_range=24h

Response:
{
  "threat_distribution": [...],
  "severity_breakdown": [...],
  "hourly_detections": [...],
  "detection_accuracy": {...}
}
```

### Incidents

**List Incidents:**
```bash
GET /api/incidents/?status=NEW

Response:
{
  "incidents": [...],
  "total": 10
}
```

**Create Incident:**
```bash
POST /api/incidents/
Content-Type: application/json

{
  "title": "Phishing Campaign Detected",
  "description": "Multiple phishing emails targeting employees",
  "priority": "high",
  "assignee": "analyst"
}
```

**Update Status:**
```bash
PATCH /api/incidents/INC-2024-1001/status
Content-Type: application/json

{
  "status": "INVESTIGATING"
}
```

---

## Testing Guide

### 1. Backend Health Check

```bash
curl http://localhost:8000/health

# Expected:
{
  "status": "healthy",
  "database": "connected",
  "api": "operational",
  "websocket": "available"
}
```

### 2. Test URL Scanner

```bash
# Phishing URL
curl -X POST http://localhost:8000/api/threats/scan/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://paypal-verify-login.tk/secure"}'

# Safe URL
curl -X POST http://localhost:8000/api/threats/scan/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

### 3. Test Email Scanner

```bash
# Phishing Email
curl -X POST http://localhost:8000/api/threats/scan/email \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "urgent@suspicious.tk",
    "recipient": "user@example.com",
    "subject": "URGENT: Verify your account now",
    "body": "Click this link immediately to avoid suspension"
  }'

# Safe Email
curl -X POST http://localhost:8000/api/threats/scan/email \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "team@company.com",
    "recipient": "user@example.com",
    "subject": "Team meeting notes",
    "body": "Here are the notes from yesterdays meeting"
  }'
```

### 4. Test Dashboard APIs

```bash
# Get summary
curl http://localhost:8000/api/dashboard/summary

# Get timeline
curl http://localhost:8000/api/dashboard/live-timeline?limit=10

# Get analytics
curl http://localhost:8000/api/analytics/overview?time_range=24h
```

### 5. Test WebSocket

Open browser console at http://localhost:3000 and check:
```javascript
// Should see WebSocket connection established
// Look for: "WebSocket connected successfully"
```

---

## Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Error: Port 8000 already in use**
```bash
# Find process on port
# Windows:
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Mac/Linux:
lsof -i :8000
kill -9 <pid>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

**Error: ModuleNotFoundError**
```bash
cd backend
pip install -r requirements.txt
```

**Error: Database locked**
```bash
cd backend
rm cybershield.db
python init_db.py
```

#### 2. Frontend Won't Start

**Error: Port 3000 in use**
```bash
# Next.js will auto-prompt for 3001
# Or manually kill process like backend
```

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: API connection refused**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env.local
cat .env.local
# Should have: NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 3. WebSocket Not Connecting

**Issue: Shows "Offline" in dashboard**

1. Check browser console for errors
2. Verify backend WebSocket is enabled in .env
3. Check firewall/antivirus
4. Try different browser
5. Disable browser extensions

**Fix:**
```bash
# backend/.env
WEBSOCKET_ENABLED=True

# Restart backend
```

#### 4. No Data Showing

**Issue: Dashboard shows zero events**

```bash
# Reinitialize database
cd backend
python init_db.py

# Should see:
# ✓ Created 100 sample threat events
# ✓ Created 50 sample URL scans
# etc.
```

#### 5. ML Classification Not Working

**Error: Model file not found**

The system uses built-in ML algorithms. No model files needed. If getting errors:

```bash
# Check ML service
cd backend
python -c "from app.services.ml_service import MLService; print('ML OK')"
```

### Debug Mode

**Enable verbose logging:**

```bash
# backend/.env
LOG_LEVEL=DEBUG

# Restart backend and check terminal for detailed logs
```

**Check browser console:**
```
F12 (Developer Tools) → Console tab
Look for errors or WebSocket messages
```

---

## Performance Optimization

### Backend

**Use PostgreSQL for production:**
```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/cybershield
```

**Enable connection pooling:**
```python
# database.py
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20
)
```

**Use Gunicorn for production:**
```bash
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### Frontend

**Build for production:**
```bash
npm run build
npm start
```

**Enable caching:**
```typescript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
}
```

---

## Security Checklist

### Production Security

- [ ] Change SECRET_KEY in .env
- [ ] Use strong passwords
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Update dependencies

### Example Production .env

```bash
# PRODUCTION CONFIGURATION
SECRET_KEY=<use: openssl rand -hex 32>
DATABASE_URL=postgresql://user:password@db:5432/cybershield
CORS_ORIGINS=https://your-domain.com
DEBUG=False
ENVIRONMENT=production
```

---

## Next Steps

1. ✅ **Explore all 13 dashboards**
2. ✅ **Test URL and email scanning**
3. ✅ **Create and manage incidents**
4. ✅ **View real-time analytics**
5. ✅ **Test API endpoints**
6. ✅ **Customize for your needs**
7. ✅ **Deploy to production**

---

## Support Resources

- **[START_HERE.md](./START_HERE.md)** - Quick start
- **[QUICKSTART.md](./QUICKSTART.md)** - Detailed setup
- **[README.md](./README.md)** - Project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Technical details
- **API Docs:** http://localhost:8000/docs

---

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can login successfully
- [ ] Dashboard shows data
- [ ] WebSocket connected (green indicator)
- [ ] URL scanner works
- [ ] Email inspector works
- [ ] Can create incidents
- [ ] Analytics displays charts
- [ ] API endpoints accessible

---

**If all items checked: Congratulations! Your CyberShield AI platform is fully operational! 🎉**

**Happy threat hunting! 🛡️**
