# 🚀 Deployment Guide - EcoBin

Choose your preferred hosting platform:

---

## Option 1: GitHub Pages (Recommended - Easiest)

### Steps:

1. **Create GitHub Repository**
```bash
# In your IITBHU folder:
git init
git add .
git commit -m "Initial commit - EcoBin project"
```

2. **Push to GitHub**
```bash
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/ecobin.git
git branch -M main
git push -u origin main
```

3. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Click **Settings** → **Pages**
   - Source: **Deploy from main branch**
   - Folder: **/ (root)**
   - Click **Save**

4. **Get Your Link**
   - Wait 2-3 minutes
   - Your link: `https://YOUR_USERNAME.github.io/ecobin/`
   - Add this to README.md

**✅ Done! Free, fast, automatic updates.**

---

## Option 2: Netlify (Fast & Professional)

### Steps:

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up** (use GitHub account)
3. **Drag & drop** your IITBHU folder
4. **Get instant link**: `https://YOUR-SITE-NAME.netlify.app`

**OR via Git:**
1. Push code to GitHub first
2. Click "New site from Git"
3. Connect GitHub repo
4. Click "Deploy"

**🎨 Custom domain:** Settings → Domain management

---

## Option 3: Vercel (Ultra Fast)

### Steps:

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up** with GitHub
3. **Import** your ecobin repo
4. **Deploy**
5. **Link**: `https://ecobin.vercel.app`

**📦 One command:**
```bash
npx vercel
```

---

## 🎬 Demo Video Guide

### What to Record (3-5 minutes):

**Scene 1: Problem (20 sec)**
- Show e-waste statistics
- Explain the issue

**Scene 2: Home Screen (15 sec)**
- Show logo animation
- Language selector
- "Want Help?" button

**Scene 3: Waste Selection (20 sec)**
- Click "Start Recycling"
- Show 4 waste types
- Select "Phone"

**Scene 4: Live Map (30 sec)**
- User location marker
- 3 nearby centers
- Click marker → Get Directions

**Scene 5: Scanning (25 sec)**
- Simulated camera
- Progress bar
- AI detection animation

**Scene 6: Results (30 sec)**
- Value: ₹450
- Eco Points: 120
- CO₂ saved: 1.8 kg
- Energy: 5 days

**Scene 7: Nature Reaction (15 sec)**
- Happy Earth animation
- Celebration confetti

**Scene 8: Impact & History (30 sec)**
- Total items: 3
- Total points: 370
- Badges unlocked
- Timeline view

**Scene 9: Features (40 sec)**
- Google Translate (change language)
- Chatbot (ask question)
- Map navigation

**Scene 10: Conclusion (15 sec)**
- Summary of impact
- Call to action

### Recording Tips:

✅ **Use OBS Studio** (free) or Loom
✅ **Record in HD** (1080p)
✅ **Clear audio** (speak confidently)
✅ **Show cursor** movements
✅ **Zoom in** on important features
✅ **Add text overlays** if needed

### Upload to Google Drive:

1. Record video
2. Go to Google Drive
3. Upload file
4. Right-click → Share
5. **Change to: Anyone with the link can view**
6. Copy link
7. Add to README

---

## ✅ Submission Checklist

Before submitting:

### GitHub Repository
- [ ] Code is pushed
- [ ] Repo is **PUBLIC**
- [ ] README.md exists
- [ ] Hosted link added to README
- [ ] All files included:
  - [ ] index.html
  - [ ] style.css
  - [ ] script.js
  - [ ] README.md

### Hosted Link
- [ ] Site is live
- [ ] Link opens successfully
- [ ] Works on mobile
- [ ] Works on desktop
- [ ] All features work
- [ ] Map loads correctly
- [ ] Translate works
- [ ] Chatbot opens

### Demo Video
- [ ] Recorded walkthrough
- [ ] Uploaded to Google Drive
- [ ] Sharing: **Anyone with link**
- [ ] Link tested in incognito
- [ ] Link added to README
- [ ] Duration: 3-5 minutes

### Form Submission
- [ ] Project title
- [ ] GitHub link
- [ ] Hosted link
- [ ] Demo video link
- [ ] One-line description
- [ ] Team member details

---

## 🎯 One-Line Description (for form)

**Option 1:**
"EcoBin - AI-powered gamified platform that makes e-waste recycling rewarding through live maps, multi-language support, and impact tracking."

**Option 2:**
"Transform e-waste into eco-rewards with our gamified recycling app featuring AI scanning, real-time maps, and 100+ language support."

**Option 3:**
"Smart e-waste recycling platform with live geolocation, AI chatbot, gamification, and multi-language accessibility for sustainable impact."

---

## 📞 Need Help?

**Common Issues:**

**Q: GitHub Pages not working?**
A: Wait 5 minutes, clear cache, check Settings → Pages

**Q: Map not loading?**
A: Check browser console, allow location permissions

**Q: Demo video file too large?**
A: Compress with HandBrake or upload to YouTube (unlisted)

**Q: Git errors?**
A: Make sure you've committed all files:
```bash
git status
git add .
git commit -m "Fix"
git push
```

---

**Good luck with your hackathon! 🚀🌱**
