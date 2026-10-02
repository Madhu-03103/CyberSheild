# 🚀 CyberShield AI - Deployment Instructions

Complete guide to deploy your CyberShield AI platform to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- [x] GitHub account with code pushed
- [x] Vercel account (free) - https://vercel.com
- [x] Render account (free) - https://render.com
- [x] Git installed locally

---

## 🎯 Deployment Overview

**Architecture:**
- **Frontend (Vercel):** Next.js application with SSR
- **Backend (Render):** FastAPI with PostgreSQL database
- **Database (Render):** PostgreSQL (included with backend)

**Total Cost:** $0 (Free tier for both platforms)

---

## Part 1: Deploy Backend to Render 🐍

### Step 1: Sign Up / Log In to Render
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your GitHub repositories

### Step 2: Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `cybershield-db`
   - **Database:** `cybershield`
   - **User:** `cybershield_user`
   - **Region:** Oregon (US West)
   - **Plan:** Free
3. Click **"Create Database"**
4. Wait for database to provision (~2 minutes)
5. **IMPORTANT:** Copy the **"Internal Database URL"** (we'll need this)

### Step 3: Create Web Service for Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Madhu-03103/CyberSheild`
3. Configure:

   **Basic Settings:**
   - **Name:** `cybershield-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Python 3

   **Build & Deploy:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select **"Free"** ($0/month)

4. Click **"Advanced"** to add Environment Variables:

   ```
   PYTHON_VERSION = 3.11.0
   DATABASE_URL = [paste Internal Database URL from Step 2]
   SECRET_KEY = [generate random string, e.g., use: openssl rand -hex 32]
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   CORS_ORIGINS = *
   ENVIRONMENT = production
   DEBUG = False
   LOG_LEVEL = INFO
   DEMO_MODE = True
   WEBSOCKET_ENABLED = True
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~5-10 minutes)
7. **IMPORTANT:** Copy your backend URL (e.g., `https://cybershield-backend.onrender.com`)

### Step 4: Initialize Database with Sample Data

After deployment completes:

1. Go to your backend service page on Render
2. Click **"Shell"** tab (console access)
3. Run these commands:

```bash
python init_db.py
```

This will populate your database with sample data.

**Backend Deployment Complete! ✅**

Your API is now live at: `https://cybershield-backend.onrender.com`

Test it: https://cybershield-backend.onrender.com/health

---

## Part 2: Deploy Frontend to Vercel ⚡

### Step 1: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import `Madhu-03103/CyberSheild` repository
3. Configure:

   **Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Environment Variables** - Add these:

   ```
   NEXT_PUBLIC_API_URL = https://cybershield-backend.onrender.com
   ```

   Replace with YOUR actual backend URL from Part 1, Step 3.7

5. Click **"Deploy"**
6. Wait for deployment (~3-5 minutes)

**Frontend Deployment Complete! ✅**

Your app is now live at: `https://your-project.vercel.app`

---

## 🎉 Post-Deployment Steps

### 1. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Login page loads
- ✅ Can login with: `admin@cybershield.ai` / `password`
- ✅ Dashboards load with real data
- ✅ Real-time updates work
- ✅ URL scanner functions
- ✅ Email inspector works

### 2. Configure Custom Domain (Optional)

**On Vercel:**
1. Go to project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Backend API:**
- Free Render plan doesn't support custom domains
- Use the `onrender.com` subdomain provided

### 3. Update Backend CORS (Important!)

After getting your Vercel URL, update backend CORS:

1. Go to Render dashboard → cybershield-backend
2. Navigate to **Environment** tab
3. Update `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS = https://your-project.vercel.app,https://www.your-domain.com
   ```
4. Save and redeploy

### 4. Monitor Your Deployment

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- View logs, analytics, and deployments
- Automatic deployments on git push

**Render:**
- Dashboard: https://dashboard.render.com
- View logs and metrics
- Database management tools

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Database connection errors
```
Solution: Verify DATABASE_URL is set correctly in Render environment variables
Check: Render Dashboard → Service → Environment → DATABASE_URL
```

**Problem:** Module not found errors
```
Solution: Ensure requirements.txt includes all dependencies
Fix: Add missing package to requirements.txt and redeploy
```

**Problem:** 502 Bad Gateway
```
Solution: Check backend logs in Render dashboard
Common causes: Database not initialized, environment variables missing
```

### Frontend Issues

**Problem:** API requests failing
```
Solution: Check NEXT_PUBLIC_API_URL is set correctly
Verify: Should be your Render backend URL (not localhost!)
```

**Problem:** Build fails
```
Solution: Check Vercel build logs
Common causes: Missing dependencies, TypeScript errors
```

**Problem:** "Failed to fetch" errors
```
Solution: Backend CORS not configured properly
Fix: Update CORS_ORIGINS in Render to include your Vercel URL
```

### Database Issues

**Problem:** No data showing
```
Solution: Database not initialized
Fix: Access Render Shell and run: python init_db.py
```

**Problem:** Authentication fails
```
Solution: Database not seeded with users
Fix: Run init_db.py to create default users
```

---

## 💡 Important Notes

### Free Tier Limitations

**Render Free:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month (sufficient for demo)
- Public GitHub repo required

**Vercel Free:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Global CDN

### Security Recommendations

For production use:
1. ✅ Change default SECRET_KEY
2. ✅ Update default user passwords
3. ✅ Enable rate limiting
4. ✅ Set up monitoring and alerts
5. ✅ Configure proper CORS origins
6. ✅ Use environment-specific configs

### Performance Tips

1. **Backend:** First request may be slow (cold start)
2. **Frontend:** Cached on CDN after first visit
3. **Database:** Free tier has connection limits
4. **WebSocket:** May have intermittent connections on free tier

---

## 📊 Deployment Checklist

Before going live:

- [ ] Backend deployed to Render
- [ ] Database created and initialized
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS origins updated
- [ ] Default passwords changed
- [ ] Health check endpoint responding
- [ ] Login functionality tested
- [ ] All dashboards loading
- [ ] Real-time features working
- [ ] API endpoints responding
- [ ] Documentation updated with live URLs

---

## 🆘 Need Help?

**Resources:**
- Vercel Documentation: https://vercel.com/docs
- Render Documentation: https://render.com/docs
- FastAPI Documentation: https://fastapi.tiangolo.com
- Next.js Documentation: https://nextjs.org/docs

**Common Commands:**

```bash
# Redeploy backend (via git push)
git add .
git commit -m "Update backend"
git push origin main

# View backend logs
# Go to Render dashboard → Service → Logs

# Access backend shell
# Go to Render dashboard → Service → Shell

# Check frontend build
npm run build

# View Vercel logs
# Go to Vercel dashboard → Project → Deployments → [Latest] → Logs
```

---

## 🎊 Congratulations!

Your CyberShield AI platform is now live and accessible worldwide!

**Share your deployment:**
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://cybershield-backend.onrender.com`
- API Docs: `https://cybershield-backend.onrender.com/docs`

---

Made with ❤️ for Cybersecurity Professionals
