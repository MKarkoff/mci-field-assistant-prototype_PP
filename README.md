# PatientPoint CI Field Assistant — Prototype Concept

> **An AI-powered competitive intelligence delivery system designed for PatientPoint's outside sales team.**
>
> This prototype explores how Klue's AI capabilities could be extended to solve a specific challenge: field reps who visit 30,000+ physician practices need competitive intelligence in the moment — not back at their desk.

---

## The Problem

PatientPoint's outside sales reps operate in physician offices where they can't pull up Klue between conversations. The competitive landscape is complex — Phreesia tablets at the front desk, CheckedUp wallboards in exam rooms, Health Monitor print materials in the waiting area — and reps need to respond in real time. Meanwhile, the intel they gather in the field (competitor sightings, contract timing, decision-maker insights) rarely makes it back into the CRM.

## The Concept

Three AI-powered interventions that turn Klue from a destination into a distribution engine:

### ⚔️ Mobile-First Battlecards
Pre-visit competitive briefs auto-pushed to reps' phones, matched to each practice's known competitor presence. Includes talk tracks, threat levels, "how to spot them" field tips, and side-by-side positioning for Phreesia, Health Monitor Network, CheckedUp/HMN, and OptimizeRx.

### 🏥 AI-Enriched Practice Profiles
CRM-synced practice cards showing cycle day tracking, competitor installs, deal signals, and AI-generated visit prep — reducing rep prep time from 30+ minutes to zero.

### 🎤 Voice-to-CRM Field Intel
Reps dictate observations from the parking lot after a visit. AI transcribes, extracts competitor mentions, identifies deal signals, and structures a tagged CRM note — automatically synced to Salesforce and Klue. No login required.

### 📊 Adoption Reframe
A diagnostic framework that shifts CI success metrics from "Klue logins" to "intelligence consumed" — with four specific AI-powered interventions to close the adoption gap.

---

## Screenshots

| Battlecards | Practice Intel | Voice-to-CRM |
|:-----------:|:--------------:|:------------:|
| Competitor cards with talk tracks | AI-enriched practice profiles | Dictate → AI structures → CRM |

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/patientpoint-ci-prototype.git
cd patientpoint-ci-prototype

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (mobile view recommended — this is designed as a phone-first experience).

---

## Tech Stack

- **React** + **Vite** — lightweight, fast dev server
- **No external UI libraries** — custom components styled for PatientPoint's brand palette
- **Mobile-first design** — 480px max-width, touch-optimized interactions

---

## Data Sources

All competitive intelligence in this prototype is sourced from publicly available information:

- SEC filings and earnings reports (Phreesia, OptimizeRx)
- POCMA (Point of Care Marketing Association) industry reports
- Press releases and company announcements
- Industry analyst coverage

---

## Context

This prototype was built as a concept demonstration — not production software. It explores how AI-powered CI delivery could work for field sales teams who operate outside traditional desktop workflows. The voice-to-CRM feature, auto-pushed battlecards, and practice intel profiles are simulated to illustrate the user experience and strategic approach.

---

*Built with care for the PatientPoint team.*
