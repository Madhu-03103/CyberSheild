# 🛡️ CyberShield AI

> **Real-Time Public-Sector Cyber Threat Intelligence Platform**

AI-powered cyber threat detection and intelligence system designed for government agencies and public sector organizations. Features real-time threat monitoring, ML-based classification, and comprehensive incident management.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Key Features

### 🔥 Real-Time Capabilities
- **Live Dashboard** with WebSocket updates
- **Real-time threat feed** with instant notifications
- **Auto-refreshing metrics** (5-second intervals)
- **Live charts & visualizations**

### 🤖 ML-Powered Detection
- **URL Scanner** - Detects phishing, malware, and suspicious links
- **Email Inspector** - Identifies phishing attempts and spam
- **Risk Scoring** - AI-driven threat assessment (75%+ accuracy)
- **Feature Analysis** - Detailed threat indicators

### 📊 13 Complete Dashboards
1. **Overview** - Security operations console
2. **Live Threats** - Active threat monitoring with map
3. **URL Scanner** - Instant URL threat analysis
4. **Email Inspector** - Phishing email detection
5. **Analytics** - Threat trends and metrics
6. **Incidents** - Security incident management
7. **Threat Library** - Intelligence database
8. **ML Center** - Model performance tracking
9. **Investigation** - Deep event analysis
10. **Reports** - Compliance and executive reports
11. **Domain Intelligence** - Domain reputation
12. **Watchlist** - High-value target monitoring
13. **AI Copilot** - Natural language queries

### 🔐 Security Features
- JWT authentication
- Role-based access control (RBAC)
- Audit logging
- Encrypted communications
- Rate limiting

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- 4GB RAM minimum
- PostgreSQL (optional, SQLite included)

### Installation

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd cybershield-ai
```

**2. Start Backend (Windows):**
```cmd
start-backend.bat
```

**Or Mac/Linux:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

**3. Start Frontend (new terminal, Windows):**
```cmd
start-frontend.bat
```

**Or Mac/Linux:**
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

**4. Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**5. Login:**
- Email: `admin@cybershield.ai`
- Password: `password`

## 📖 Documentation

- **[START_HERE.md](./START_HERE.md)** - Complete setup guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Detailed installation
- **[FEATURES.md](./FEATURES.md)** - Feature documentation
- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Technical specs
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[backend/SETUP.md](./backend/SETUP.md)** - Backend specifics

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Recharts (visualizations)
- Framer Motion (animations)
- Axios (API client)

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL/SQLite (database)
- Scikit-learn (ML models)
- WebSocket (real-time)
- JWT (authentication)

### Project Structure
```
cybershield-ai/
├── app/                    # Next.js pages (13 dashboards)
├── components/             # React components
├── lib/                    # Frontend utilities & API client
├── backend/
│   ├── app/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic & ML
│   │   ├── main.py        # FastAPI application
│   │   ├── config.py      # Configuration
│   │   └── database.py    # Database setup
│   ├── init_db.py         # Database initialization
│   └── requirements.txt   # Python dependencies
├── start-backend.sh/bat   # Backend startup scripts
├── start-frontend.sh/bat  # Frontend startup scripts
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/summary` - Dashboard statistics
- `GET /api/dashboard/live-timeline` - Recent events

### Threats
- `POST /api/threats/scan/url` - Scan URL
- `POST /api/threats/scan/email` - Scan email
- `GET /api/threats/scans/recent` - Recent scans

### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/trends` - Threat trends
- `GET /api/analytics/ml-metrics` - ML performance

### Incidents
- `GET /api/incidents/` - List incidents
- `POST /api/incidents/` - Create incident
- `GET /api/incidents/{id}` - Get incident
- `PUT /api/incidents/{id}` - Update incident
- `PATCH /api/incidents/{id}/status` - Update status

### WebSocket
- `WS /ws` - Real-time updates

Full API documentation: http://localhost:8000/docs

## 🎯 Sample Data

The system includes pre-loaded sample data:
- ✅ 100 threat events
- ✅ 50 URL scans
- ✅ 50 email scans  
- ✅ 20 incidents
- ✅ Multiple IoC indicators
- ✅ Watchlist entries
- ✅ 2 user accounts

## 🧪 Testing

### Test URL Scanner
```bash
curl -X POST http://localhost:8000/api/threats/scan/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://suspicious-login-verify.tk"}'
```

### Test Email Scanner
```bash
curl -X POST http://localhost:8000/api/threats/scan/email \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "urgent@suspicious.com",
    "recipient": "user@example.com",
    "subject": "URGENT: Verify your account",
    "body": "Click here to verify immediately"
  }'
```

### Health Check
```bash
curl http://localhost:8000/health
```

## 🚢 Deployment

### Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Production Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with production values
python init_db.py
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend:**
```bash
npm install
npm run build
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment guides.

## ⚙️ Configuration

### Backend (.env)
```bash
DATABASE_URL=sqlite:///./cybershield.db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
DEMO_MODE=True
WEBSOCKET_ENABLED=True
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_WEBSOCKET=true
```

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

**Database errors:**
```bash
cd backend
rm cybershield.db
python init_db.py
```

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on port 8000
- Check .env.local has correct API URL
- Disable firewall/antivirus temporarily

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- Next.js for the React framework
- scikit-learn for ML capabilities
- Recharts for beautiful visualizations

## 📞 Support

- Documentation: See docs in repository
- API Docs: http://localhost:8000/docs
- Issues: Create an issue on GitHub

## 🔒 Security

For security issues, please email security@cybershield.ai (or create a private security advisory on GitHub).

## 📊 System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 10GB
- OS: Windows 10, macOS 10.15+, Ubuntu 20.04+

**Recommended:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 20GB SSD
- OS: Latest stable OS version

## 🎓 Learn More

- **FastAPI:** https://fastapi.tiangolo.com/
- **Next.js:** https://nextjs.org/docs
- **Scikit-learn:** https://scikit-learn.org/
- **Cyber Threat Intelligence:** https://www.cisa.gov/

---

**Built with ❤️ for public sector cybersecurity**

**Happy threat hunting! 🛡️**
