# How to Set Up Visitor Tracking — Step by Step

This adds invisible analytics to your prototype so you know exactly
what Graham (or anyone) does when they interact with your demo.

You'll see events like:
- "session_started" — someone opened the demo (with device type, screen size)
- "tab_switched" — they moved from Battlecards → Practice Intel
- "competitor_card_clicked" — they tapped on Phreesia's battlecard
- "talk_track_opened" — they read the Phreesia talk track
- "voice_modal_opened" — they tapped the mic button
- "voice_recording_started" — they hit record
- "voice_recording_stopped" — they stopped recording (with duration)
- "voice_intel_saved_to_crm" — they clicked "Save to CRM + Klue"
- "session_ended" — they left (with total time on page)

Total setup time: ~10 minutes.

---

## OPTION A: Pipedream → Google Sheets (Recommended)

This sends every event to a Google Sheet in real time. You'll have a
live spreadsheet showing exactly what Graham clicked and when.

### Step 1 — Create a Pipedream account (free)
- Go to https://pipedream.com and sign up (GitHub or Google login works)
- Free tier includes 100 events/day — more than enough

### Step 2 — Create a new workflow
- Click "New +" → "New Workflow"
- For the trigger, search for "HTTP / Webhook"
- Select "New Requests"
- Click "Save and continue"
- You'll see a URL like: https://eo1234abc.m.pipedream.net
- **Copy this URL** — you'll need it in Step 4

### Step 3 — Add a Google Sheets step
- Click the "+" below the trigger
- Search for "Google Sheets"
- Select "Add Single Row"
- Connect your Google account
- Create a new Google Sheet called "PatientPoint Demo Tracking"
- In that sheet, add these column headers in Row 1:
  A: timestamp
  B: session_id
  C: action
  D: details
  E: device
  F: screen
  G: referrer
- Back in Pipedream, select your spreadsheet and sheet
- Map the columns:
  - timestamp → {{steps.trigger.event.body.timestamp}}
  - session_id → {{steps.trigger.event.body.session_id}}
  - action → {{steps.trigger.event.body.action}}
  - details → {{JSON.stringify(steps.trigger.event.body)}}
  - device → {{steps.trigger.event.body.device}}
  - screen → {{steps.trigger.event.body.screen}}
  - referrer → {{steps.trigger.event.body.referrer}}
- Click "Deploy"

### Step 4 — Add your webhook URL to the prototype
- Open `src/App.jsx`
- Find this line near the top:
  const WEBHOOK_URL = "YOUR_PIPEDREAM_URL_HERE";
- Replace it with your actual Pipedream URL:
  const WEBHOOK_URL = "https://eo1234abc.m.pipedream.net";
- Save, commit, and push to GitHub
- Vercel will auto-redeploy in ~60 seconds

### Step 5 — Test it
- Open your Vercel demo URL
- Click around — switch tabs, open a battlecard, try the voice flow
- Check your Google Sheet — you should see rows appearing in real time

---

## OPTION B: Pipedream → Email Notification (Simpler)

If you just want an email when someone visits (instead of a full
spreadsheet), this is faster to set up.

### Step 1 — Same as above (create Pipedream account + webhook trigger)

### Step 2 — Add an email step
- Click the "+" below the trigger
- Search for "Email" → "Send Email"
- Use the built-in Pipedream email (sends to your Pipedream account email)
- Subject: `Demo Visit: {{steps.trigger.event.body.action}}`
- Body:
  ```
  Someone interacted with your PatientPoint demo!

  Action: {{steps.trigger.event.body.action}}
  Time: {{steps.trigger.event.body.timestamp}}
  Device: {{steps.trigger.event.body.device}}
  Screen: {{steps.trigger.event.body.screen}}
  Session: {{steps.trigger.event.body.session_id}}
  Details: {{JSON.stringify(steps.trigger.event.body)}}
  ```
- Click "Deploy"

### Step 3 — Add a filter (recommended)
To avoid getting an email for EVERY click, add a filter step
between the trigger and the email:
- Click "+" between trigger and email
- Select "Filter"
- Condition: Only continue if action is "session_started"
- This way you get ONE email per visit, not per click

Then check the Google Sheet (Option A) for the detailed click data.

---

## OPTION C: Use Both Together (Best)

- Email notification on "session_started" (so you know immediately)
- Google Sheet logging everything (so you can review the full journey)

In Pipedream, you can add multiple steps to one workflow:
1. HTTP Trigger
2. Google Sheets → Add Row (logs everything)
3. Filter → only if action = "session_started"
4. Email → notify you

---

## WHAT YOU'LL SEE

Here's a realistic example of what your Google Sheet will look like
after Graham spends 5 minutes with the demo:

| timestamp | action | device | details |
|-----------|--------|--------|---------|
| 3:14:02 PM | session_started | mobile | landing_tab: battlecards |
| 3:14:18 PM | competitor_card_clicked | mobile | competitor: Phreesia |
| 3:14:19 PM | battlecard_viewed | mobile | competitor: Phreesia, threat: high |
| 3:14:47 PM | talk_track_opened | mobile | competitor: Phreesia |
| 3:15:12 PM | tab_switched | mobile | from: battlecards, to: practices |
| 3:16:01 PM | tab_switched | mobile | from: practices, to: adoption |
| 3:16:45 PM | tab_switched | mobile | from: adoption, to: battlecards |
| 3:17:03 PM | voice_modal_opened | mobile | from_tab: battlecards |
| 3:17:08 PM | voice_recording_started | mobile | |
| 3:17:19 PM | voice_recording_stopped | mobile | duration_seconds: 11 |
| 3:17:25 PM | voice_intel_saved_to_crm | mobile | practice: Summit Orthopedics |
| 3:19:30 PM | session_ended | mobile | total_seconds: 328 |

From this you'd know: Graham spent 5.5 minutes on your demo, on his
phone. He was most interested in the Phreesia battlecard (read the
full talk track). He explored all three tabs. He tried the full voice
flow and even hit "Save to CRM." That's a warm lead.

---

## PRIVACY NOTE

The tracking collects:
- Device type (mobile/desktop)
- Screen size
- Which features were clicked
- Referrer URL
- Session duration

It does NOT collect:
- Name, email, or any personal info
- IP address (Pipedream doesn't forward this by default)
- Location
- Browser fingerprint

This is standard product analytics — less invasive than Google
Analytics. But if you want to be transparent, you could add a small
"Analytics active" note in the footer. For a demo shared with one
person you know, this level of tracking is completely normal.

---

## TROUBLESHOOTING

**No events showing up:**
- Check that WEBHOOK_URL in App.jsx is your actual Pipedream URL
- Make sure you deployed the workflow in Pipedream (green "Deploy" button)
- Check Pipedream's event inspector — events should appear there first

**Events in Pipedream but not in Google Sheet:**
- Verify the column mapping in the Google Sheets step
- Check that the Google account is still connected

**Too many email notifications:**
- Add the filter step (Option C) to only email on session_started

**Want to stop tracking:**
- Change WEBHOOK_URL back to "YOUR_PIPEDREAM_URL_HERE"
- Or just pause the Pipedream workflow
