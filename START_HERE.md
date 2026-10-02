# 🚀 START HERE - CyberShield AI Setup

Welcome to **CyberShield AI** - Your Real-Time Cyber Threat Intelligence Platform!

## ⚡ Quick Start (Choose One)

### Option 1: Automated Setup (Recommended)

**Windows:**
```cmd
start-backend.bat
```
Then in a new terminal:
```cmd
start-frontend.bat
```

**Mac/Linux:**
```bash
chmod +x start-backend.sh start-frontend.sh
./start-backend.sh
```
Then in a new terminal:
```bash
./start-frontend.sh
```

### Option 2: Manual Setup

See [QUICKSTART.md](./QUICKSTART.md) for detailed manual setup instructions.

## 🌐 Access Your Application

Once both servers are running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 👤 Login Credentials

```
Email: admin@cybershield.ai
Password: password
```

## ✅ What You Get Out of the Box

✨ **13 Real-Time Dashboards:**
1. Overview - Security operations console
2. Live Threats - Active threat monitoring
3. URL Scanner - ML-powered URL analysis
4. Email Inspector - Phishing detection
5. Analytics - Threat trends & metrics
6. Incidents - Security incident management
7. Threat Library - Intelligence database
8. ML Center - Model performance
9. Investigation - Deep event analysis
10. Reports - Compliance reporting
11. Domain Intelligence - Reputation analysis
12. Watchlist - High-value target monitoring
13. AI Copilot - Natural language queries

🔥 **Real-Time Features:**
- Live WebSocket updates
- Real-time threat feed
- Auto-refreshing dashboard
- Instant notifications
- Live charts & graphs

🤖 **ML-Powered Detection:**
- URL threat classification
- Email phishing detection
- Risk scoring algorithms
- Feature importance analysis
- 75%+ accuracy confidence

📊 **Sample Data Included:**
- 100 threat events
- 50 URL scans
- 50 email scans
- 20 incidents
- Multiple indicators
- Watchlist entries

## 🔧 System Requirements

- **Python 3.8+** (Backend)
- **Node.js 18+** (Frontend)
- **4GB RAM** (Minimum)
- **PostgreSQL** (Optional, SQLite included)

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Detailed setup guide
- [FEATURES.md](./FEATURES.md) - Complete feature list
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - Technical docs
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [backend/SETUP.md](./backend/SETUP.md) - Backend specifics

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use different port
cd backend
uvicorn app.main:app --reload --port 8001

# Update frontend .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
```

**Database errors:**
```bash
cd backend
rm cybershield.db  # Delete old database
python init_db.py  # Recreate with fresh data
```

**Missing dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Next.js will prompt for 3001 automatically
npm run dev
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection failed:**
- Check if backend is running on port 8000
- Verify .env.local has correct API URL
- Check firewall settings

## 🎯 Next Steps

1. ✅ **Start both servers** (backend & frontend)
2. ✅ **Open http://localhost:3000** in browser
3. ✅ **Login** with admin credentials
4. ✅ **Explore dashboards** - Try URL Scanner or Email Inspector
5. ✅ **Check live feed** - Watch real-time threat detection
6. ✅ **View analytics** - See threat trends
7. ✅ **Test API** - Visit http://localhost:8000/docs

## 🚢 Ready for Production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Docker deployment
- Kubernetes configuration
- Cloud platform guides (AWS, GCP, Azure)
- CI/CD pipelines
- Security hardening

## 💡 Tips

- **Demo Mode:** Perfect for presentations (enabled by default)
- **WebSocket:** Real-time updates work automatically
- **Sample Data:** Already loaded, no manual setup needed
- **API First:** All features accessible via REST API
- **Extensible:** Easy to add custom threat feeds

## 🆘 Need Help?

1. Check the logs in your terminal
2. Visit API docs: http://localhost:8000/docs
3. Read troubleshooting section above
4. Check [QUICKSTART.md](./QUICKSTART.md)
5. Review backend logs for errors

## 🎉 You're All Set!

Your CyberShield AI platform is ready to:
- 🔍 Detect threats in real-time
- 🤖 Analyze URLs and emails with ML
- 📊 Visualize threat intelligence
- 🚨 Manage security incidents
- 📈 Generate analytics reports

**Happy threat hunting! 🛡️**

---

**Quick Commands Reference:**

```bash
# Backend
cd backend
python init_db.py          # Initialize database
uvicorn app.main:app --reload  # Start server

# Frontend
npm install                # Install dependencies
npm run dev               # Start development server

# Health Check
curl http://localhost:8000/health

# API Docs
http://localhost:8000/docs
```
