# How to Deploy Your PatientPoint CI Prototype — Step by Step

This guide gets you from zero to a live, shareable URL that Graham can click
and interact with on his phone. Total time: ~15 minutes.

---

## PHASE 1: Push the Code to GitHub (~5 minutes)

### Step 1 — Create a GitHub account (skip if you have one)
- Go to https://github.com and sign up

### Step 2 — Create a new repository
- Click the "+" icon in the top-right corner → "New repository"
- Repository name: `patientpoint-ci-prototype`
- Description: `AI-powered competitive intelligence prototype for field sales`
- Set to **Public** (so Graham can see the README and code)
- Do NOT check "Add a README file" (we already have one)
- Click "Create repository"

### Step 3 — Upload the files
**Option A: If you're comfortable with terminal/command line:**

1. Unzip the downloaded `patientpoint-ci-prototype.zip`
2. Open your terminal and navigate to the unzipped folder:
   ```
   cd patientpoint-ci-prototype
   ```
3. Run these commands one at a time:
   ```
   git init
   git add .
   git commit -m "PatientPoint CI Field Assistant prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/patientpoint-ci-prototype.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your actual GitHub username)

**Option B: If you prefer the browser (no terminal needed):**

1. On your new repo page, click "uploading an existing file" link
2. Drag and drop ALL the files from the unzipped folder:
   - .gitignore
   - README.md
   - index.html
   - package.json
   - vite.config.js
   - src/main.jsx
   - src/App.jsx
3. IMPORTANT: GitHub's web uploader doesn't handle folders well.
   You may need to:
   - First upload the root files (README.md, index.html, package.json,
     vite.config.js, .gitignore)
   - Then click "Add file" → "Create new file"
   - Type "src/main.jsx" as the filename (this creates the src folder)
   - Paste the contents of main.jsx
   - Repeat for "src/App.jsx"
4. Click "Commit changes"

### Step 4 — Verify
- Visit https://github.com/YOUR_USERNAME/patientpoint-ci-prototype
- You should see the README rendered with all the formatting
- Click into the "src" folder and confirm App.jsx and main.jsx are there

---

## PHASE 2: Deploy to Vercel (Free Live URL) (~5 minutes)

Vercel is free, requires no credit card, and auto-deploys from GitHub.

### Step 1 — Sign up for Vercel
- Go to https://vercel.com
- Click "Sign Up" → "Continue with GitHub"
- Authorize Vercel to access your GitHub account

### Step 2 — Import your project
- After signing in, you'll see a dashboard
- Click "Add New..." → "Project"
- You'll see a list of your GitHub repos
- Find "patientpoint-ci-prototype" and click "Import"

### Step 3 — Configure (mostly automatic)
- Vercel will auto-detect it's a Vite project
- Framework Preset should say "Vite" — if not, select it from the dropdown
- Leave all other settings as default
- Click "Deploy"

### Step 4 — Wait ~60 seconds
- Vercel will install dependencies, build the project, and deploy it
- You'll see a "Congratulations!" screen with a preview of your app
- Your live URL will be something like:
  https://patientpoint-ci-prototype.vercel.app
  or
  https://patientpoint-ci-prototype-YOUR_USERNAME.vercel.app

### Step 5 — Test it yourself
- Click the URL Vercel gives you
- Test on your phone too (text yourself the link)
- Click through all three tabs: Battlecards, Practice Intel, Adoption Fix
- Tap the red 🎤 mic button and go through the voice flow
- Make sure the "Save to CRM + Klue" button triggers the green toast

---

## PHASE 3: Customize Your URL (Optional, ~2 minutes)

If Vercel gives you an ugly URL, you can change it:

1. In your Vercel dashboard, click on the project
2. Go to "Settings" → "Domains"
3. You can change the subdomain to something cleaner like:
   `patientpoint-ci-demo.vercel.app`
   (as long as it's not already taken)

---

## WHAT TO PUT IN YOUR EMAIL

Replace the GitHub line in your email with BOTH links:

   "You can click through the interactive demo here:
    https://patientpoint-ci-prototype.vercel.app

    For a closer look at the code and thinking behind it:
    https://github.com/YOUR_USERNAME/patientpoint-ci-prototype"

The Vercel link is the one Graham will actually use — he taps it on his
phone and he's immediately in the prototype. The GitHub link shows the
README (your strategic thinking) and the code (your technical credibility).

---

## TIPS FOR BEST IMPRESSION

1. TEST ON MOBILE — This prototype is designed as a phone-first
   experience. Text yourself the Vercel link and make sure everything
   works smoothly on your actual phone before sending to Graham.

2. USE CHROME DEVTOOLS — If testing on desktop, open Chrome DevTools
   (F12), click the phone icon to toggle device mode, and select
   "iPhone 14 Pro" or similar to see the mobile layout.

3. SHARE THE VERCEL LINK, NOT GITHUB — Graham is a VP of Sales.
   He wants to tap and interact, not read code. Lead with the Vercel
   URL; include the GitHub link as a secondary "behind the scenes" option.

---

## TROUBLESHOOTING

**Vercel build fails:**
- Make sure all files are in the right places:
  - index.html in the ROOT (not inside src/)
  - App.jsx and main.jsx inside src/
  - package.json in the ROOT
- Check that vite.config.js is in the ROOT

**Blank page after deploy:**
- Open browser console (F12 → Console tab) and look for errors
- Most common cause: a file is missing or in the wrong folder

**Vercel says "No framework detected":**
- Manually select "Vite" as the framework preset during import
- Make sure package.json has the "dev" and "build" scripts

**Need to update the prototype:**
- Edit files in GitHub (or push new commits)
- Vercel auto-redeploys within ~60 seconds of any push

---

## TIMELINE

If you do this step by step, you should have a live URL in about 15
minutes. Here's a realistic breakdown:

- GitHub account + repo setup: 3-5 min
- Upload files: 3-5 min
- Vercel signup + deploy: 3-5 min
- Testing: 2-3 min
- Total: ~15 minutes
