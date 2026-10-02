# 🚀 CyberShield AI - Deployment Guide

## Quick Deployment Options

Choose your preferred platform for deployment:

---

## 1️⃣ VERCEL (Recommended - Easiest)

**Best for:** Next.js applications (Made by Next.js creators)

### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Select your account**
   - Link to existing project? **No**
   - Project name? **cybershield-ai** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **No**

5. **Production Deploy**
```bash
vercel --prod
```

**✅ Your app will be live at:** `https://cybershield-ai.vercel.app`

### Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your GitHub repository
5. Click "Deploy"

**Done!** Automatic deployments on every git push.

---

## 2️⃣ NETLIFY

**Best for:** Static sites with great performance

### Steps:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Login to Netlify**
```bash
netlify login
```

4. **Deploy**
```bash
netlify deploy --prod
```

5. **Follow prompts:**
   - Create & configure new site? **Yes**
   - Team? **Select your team**
   - Site name? **cybershield-ai**
   - Publish directory? **.next**

**✅ Your app will be live at:** `https://cybershield-ai.netlify.app`

### Alternative: Drag & Drop

1. Build: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `.next` folder to the deploy zone

---

## 3️⃣ GITHUB PAGES

**Best for:** Free hosting on GitHub

### Steps:

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
Add to scripts:
```json
"scripts": {
  "deploy": "next build && next export && gh-pages -d out"
}
```

3. **Update next.config.js**
```javascript
module.exports = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

**✅ Your app will be live at:** `https://yourusername.github.io/cybershield-ai`

---

## 4️⃣ RENDER

**Best for:** Full-stack apps with backend support

### Steps:

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** cybershield-ai
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. Click "Create Web Service"

**✅ Your app will be live at:** `https://cybershield-ai.onrender.com`

---

## 5️⃣ AWS AMPLIFY

**Best for:** AWS ecosystem integration

### Steps:

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click "Get Started" → "Host web app"
4. Connect your repository
5. Build settings (auto-detected):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

6. Click "Save and Deploy"

**✅ Your app will be live at:** `https://main.xxxxx.amplifyapp.com`

---

## 6️⃣ RAILWAY

**Best for:** Simple deployment with database support

### Steps:

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Railway auto-detects Next.js
6. Click "Deploy"

**✅ Your app will be live at:** `https://cybershield-ai.up.railway.app`

---

## 7️⃣ DOCKER (Any Platform)

**Best for:** Containerized deployment anywhere

### Create Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create .dockerignore:

```
node_modules
.next
.git
.env.local
```

### Build and Run:

```bash
# Build image
docker build -t cybershield-ai .

# Run container
docker run -p 3000:3000 cybershield-ai
```

### Deploy to Docker Hub:

```bash
docker tag cybershield-ai yourusername/cybershield-ai
docker push yourusername/cybershield-ai
```

---

## 🔧 PRE-DEPLOYMENT CHECKLIST

Before deploying, ensure:

- [ ] All dependencies are in package.json
- [ ] No console errors in production build
- [ ] Environment variables are set (if any)
- [ ] Build command works: `npm run build`
- [ ] Start command works: `npm start`
- [ ] All pages load correctly
- [ ] Real-time features work
- [ ] Mobile responsive

### Test Production Build Locally:

```bash
npm run build
npm start
```

Visit http://localhost:3000 and verify everything works.

---

## 🌍 CUSTOM DOMAIN

### For Vercel:

1. Go to your project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

### For Netlify:

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS instructions

---

## 📊 MONITORING

### Add Analytics (Optional):

**Google Analytics:**
1. Get tracking ID from analytics.google.com
2. Add to `app/layout.tsx`:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🚀 RECOMMENDED: VERCEL

**Why Vercel?**
- ✅ Built for Next.js
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant deployments
- ✅ Free tier generous
- ✅ Auto-scaling
- ✅ Perfect for hackathons

**Deploy in 30 seconds:**
```bash
npm install -g vercel
vercel
```

---

## 🎯 FOR HACKATHON DEMO

**Quick Options:**

1. **Vercel** (30 seconds)
2. **Netlify** (1 minute)
3. **Railway** (2 minutes)

All provide:
- Free tier
- HTTPS
- Custom domain
- Fast deployment
- No credit card needed

---

## 🆘 TROUBLESHOOTING

### Build Fails?
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port Issues?
```bash
# Use different port
PORT=3001 npm start
```

### Environment Variables?
Create `.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## 📞 DEPLOYMENT SUPPORT

**Vercel:** [vercel.com/docs](https://vercel.com/docs)
**Netlify:** [docs.netlify.com](https://docs.netlify.com)
**Railway:** [docs.railway.app](https://docs.railway.app)

---

## ✅ DEPLOYMENT COMPLETE!

Once deployed:
1. Test all pages
2. Verify real-time updates work
3. Check mobile responsiveness
4. Share the URL with judges!

**Your CyberShield AI platform is now LIVE! 🎉**
