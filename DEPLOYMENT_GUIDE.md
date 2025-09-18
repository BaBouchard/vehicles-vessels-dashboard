# 🚀 Free Hosting Deployment Guide

## Prerequisites
- GitHub account (free)
- Your Google Sheets Sheet ID

## Option 1: Vercel (Recommended - Made by Next.js creators)

### Step 1: Initialize Git Repository
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit - Vehicles & Vessels Dashboard"
```

### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `vehicles-vessels-dashboard`
4. Make it **Public** (required for free Vercel)
5. Don't initialize with README (you already have files)
6. Click "Create repository"

### Step 3: Push to GitHub
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/vehicles-vessels-dashboard.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `vehicles-vessels-dashboard` repository
5. Vercel auto-detects Next.js settings
6. **Add Environment Variable**:
   - Name: `GOOGLE_SHEETS_SHEET_ID`
   - Value: `1tweHvYrvccyoPZoTsIoC9njTE8lmhm-cL-G-uxyWFzc`
7. Click "Deploy"

### Step 5: Custom Domain (Optional)
1. In Vercel dashboard → Project Settings → Domains
2. Add your domain (e.g., `vehicles-vessels.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## Option 2: Netlify

### Step 1-3: Same as Vercel (Git + GitHub)

### Step 4: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Environment variables**:
   - `GOOGLE_SHEETS_SHEET_ID`: `1tweHvYrvccyoPZoTsIoC9njTE8lmhm-cL-G-uxyWFzc`
7. Click "Deploy site"

---

## Option 3: Railway

### Step 1-3: Same as above (Git + GitHub)

### Step 4: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Choose your repository
5. **Environment variables**:
   - `GOOGLE_SHEETS_SHEET_ID`: `1tweHvYrvccyoPZoTsIoC9njTE8lmhm-cL-G-uxyWFzc`
6. Railway auto-detects Next.js and deploys

---

## 🔧 Important Notes

### Environment Variables
Your `.env.local` file contains:
```
GOOGLE_SHEETS_SHEET_ID=1tweHvYrvccyoPZoTsIoC9njTE8lmhm-cL-G-uxyWFzc
```

**Make sure to add this as an environment variable in your hosting platform!**

### Google Sheets Access
Your Google Sheet must remain **publicly viewable** for the CSV export to work:
- Right-click your sheet → "Share" → "Anyone with the link" → "Viewer"

### Custom Domain Costs
- **Domain registration**: ~$10-15/year (Namecheap, GoDaddy, etc.)
- **Hosting**: FREE (with Vercel/Netlify/Railway)
- **SSL Certificate**: FREE (auto-provided)

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- Made by Next.js creators
- Optimized for Next.js
- Automatic deployments on Git push
- Generous free tier
- Easy custom domains
- Built-in analytics

**Free Tier Limits:**
- 100GB bandwidth/month
- Unlimited personal projects
- Custom domains included
- Automatic SSL

---

## 📱 After Deployment

1. **Test your live site**
2. **Update Google Sheets** → Changes appear automatically
3. **Share the URL** with your team
4. **Bookmark** for easy access

Your dashboard will be accessible from any device with internet connection!
