# 🚀 CyberShield AI - Quick Start Guide

Get your real-time cyber threat intelligence platform running in minutes!

## 📋 Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL** (or use SQLite for quick testing)

## ⚡ Quick Start (5 Minutes)

### Windows Users:

1. **Start Backend:**
   ```cmd
   start-backend.bat
   ```

2. **Start Frontend** (in new terminal):
   ```cmd
   start-frontend.bat
   ```

### Mac/Linux Users:

1. **Start Backend:**
   ```bash
   chmod +x start-backend.sh
   ./start-backend.sh
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   chmod +x start-frontend.sh
   ./start-frontend.sh
   ```

## 🌐 Access Your Application

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 👤 Default Login

- **Email:** admin@cybershield.ai
- **Password:** password

## 📊 What's Running Now?

✅ **Real-Time Features:**
- Live threat detection dashboard
- WebSocket real-time updates
- ML-powered URL scanning
- Email phishing detection
- Incident management
- Analytics & reporting

## 🔧 Manual Setup (If scripts don't work)

### Backend Setup:

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Setup environment
cp .env.example .env

# 6. Initialize database with sample data
python init_db.py

# 7. Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup:

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 3. Start development server
npm run dev
```

## 📡 Test the API

### Health Check:
```bash
curl http://localhost:8000/health
```

### Scan a URL:
```bash
curl -X POST http://localhost:8000/api/threats/scan/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://suspicious-site.com"}'
```

### Get Dashboard Summary:
```bash
curl http://localhost:8000/api/dashboard/summary
```

## 🎯 Available Dashboards

1. **Overview** - Real-time statistics and live threat feed
2. **Live Threats** - Active threat monitoring with map visualization
3. **URL Scanner** - Scan suspicious URLs with ML analysis
4. **Email Inspector** - Detect phishing emails
5. **Analytics** - Threat trends and detection metrics
6. **Incidents** - Manage security incidents
7. **Threat Library** - Browse threat intelligence database
8. **ML Center** - Machine learning model performance
9. **Investigation** - Deep dive into security events
10. **Reports** - Generate compliance reports
11. **Domain Intelligence** - Domain reputation analysis
12. **Watchlist** - Monitor high-value targets
13. **AI Copilot** - Natural language security queries

## 🔥 Key Features Working Now

✅ **Real-Time Dashboard** - Live updates via WebSocket
✅ **ML Classification** - URL and email threat detection
✅ **Database** - 100+ sample threat events
✅ **REST API** - Full CRUD operations
✅ **Authentication** - JWT-based security
✅ **Analytics** - Charts and metrics
✅ **Incident Management** - Ticket system

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check Python version
python --version  # Should be 3.8+

# Try without virtual env
cd backend
pip install -r requirements.txt
python init_db.py
uvicorn app.main:app --reload
```

### Frontend won't start?
```bash
# Check Node version
node --version  # Should be 18+

# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use?
```bash
# Change backend port
uvicorn app.main:app --reload --port 8001

# Update frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Database errors?
```bash
# Re-initialize database
cd backend
rm -f cybershield.db  # If using SQLite
python init_db.py
```

## 📚 Next Steps

1. **Explore the API:** http://localhost:8000/docs
2. **Try scanning URLs** in the URL Scanner dashboard
3. **Create incidents** in the Incidents dashboard
4. **View analytics** to see threat trends
5. **Customize** settings in `backend/.env`

## 🚢 Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guides:
- Docker deployment
- Vercel (frontend)
- Railway/Render (backend)
- AWS/GCP/Azure

## 💡 Tips

- **Auto-refresh:** Dashboard updates every 5 seconds
- **WebSocket:** Real-time events push instantly
- **Sample Data:** 100 threats, 50 URLs, 50 emails loaded
- **Demo Mode:** Perfect for presentations
- **API First:** All features available via REST API

## 🆘 Need Help?

- Check API docs: http://localhost:8000/docs
- Review logs: Check terminal output
- Test health: http://localhost:8000/health
- Read [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)

## 🎉 You're Ready!

Your CyberShield AI platform is now running with:
- ✅ Real-time threat detection
- ✅ ML-powered analysis
- ✅ Live dashboard updates
- ✅ Complete incident management
- ✅ Full API access

**Happy threat hunting! 🛡️**
