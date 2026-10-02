# ⚡ Quick Deployment Guide

Deploy CyberShield AI in 15 minutes!

---

## 🎯 Quick Steps

### 1️⃣ Deploy Backend (Render)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"PostgreSQL"**
   - Name: `cybershield-db`
   - Click **Create**
   - **Copy the Internal Database URL**
4. Click **"New +"** → **"Web Service"**
   - Connect: `Madhu-03103/CyberSheild`
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variables:
     ```
     DATABASE_URL = [paste database URL]
     SECRET_KEY = your-secret-key-here
     ALGORITHM = HS256
     ```
   - Click **Create**
5. Wait 5 minutes, then **copy your backend URL**

### 2️⃣ Deploy Frontend (Vercel)

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. Click **"New Project"**
4. Import: `Madhu-03103/CyberSheild`
5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = [your backend URL from step 1.5]
   ```
6. Click **Deploy**
7. Wait 3 minutes - **Done!** 🎉

### 3️⃣ Initialize Database

1. Go to Render → Your Backend Service → **Shell** tab
2. Run: `python init_db.py`
3. Done!

---

## 🎊 You're Live!

**Login:**
- Email: `admin@cybershield.ai`
- Password: `password`

**URLs:**
- Frontend: Your Vercel URL
- Backend: Your Render URL
- API Docs: `[Render URL]/docs`

---

## 🔧 One-Command Deployment (Advanced)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
./deploy-frontend.sh
```

---

**Need detailed instructions?** See [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)
