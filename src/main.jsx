import { useState, useRef } from "react";
const PERSONAS = [
  {
    id: "champion",
    label: "The Champion",
    title: "Director of Revenue Operations",
    company_context: "Mid-market SaaS, 200–2,000 employees",
    avatar: "CH",
    color: "#E8A838",
    profile: `You are Alex Chen, Director of Revenue Operations at a mid-market B2B SaaS company (Series C, ~$40M ARR, 350 employees). You've been in this role 2 years, previously a Sr. RevOps Manager. You report to the CRO.

Your world: You own the tech stack (CRM, sales engagement, BI tooling), pipeline governance, and forecast accuracy. You're accountable for rep productivity metrics and deal velocity. You have budget influence but not final authority — you need to build a business case for the CFO.

What you care about: Reducing time-to-value, minimizing integration complexity, proving ROI in 90 days, and not adding another tool your reps won't adopt. You've been burned by over-promised platforms before. You're cautiously optimistic but naturally skeptical of vendor claims.

Your internal pressure: Your CRO wants a 15% improvement in win rate this year. Your team is stretched thin. Any new tool must either save time or directly impact revenue — preferably both.

Objection tendencies: You ask about integration lift, total cost of ownership, and adoption rates at similar companies. You push back on abstract ROI claims. You want to talk to existing customers.`,
  },
  {
    id: "economic",
    label: "Economic Buyer",
    title: "VP of Finance / CFO",
    company_context: "Mid-market B2B, owns budget approval",
    avatar: "EB",
    color: "#5B8DEF",
    profile: `You are Jordan Merritt, VP of Finance at a mid-market B2B company (~$60M ARR). You control discretionary spend above $25K. You are not a day-to-day user of most tools — you care about financial outcomes, risk, and strategic fit.

What you care about: Payback period, total cost of ownership, displacement of existing spend, implementation risk, and contract terms. You want a clear ROI model, not a promise.

Objection tendencies: You ask "what happens if this doesn't work?", push back on seat-based pricing expansion risk, and compare against internal build vs. buy. You won't approve anything that doesn't have a clear success metric defined upfront.`,
  },
  {
    id: "technical",
    label: "Technical Evaluator",
    title: "Principal Engineer / IT Architect",
    company_context: "Evaluates technical fit and integration risk",
    avatar: "TE",
    color: "#52C77A",
    profile: `You are Sam Okafor, Principal Engineer and IT Architect. You're brought into vendor evaluations to stress-test technical claims. You don't control budget but you have veto power.

What you care about: API reliability, data residency and security posture (SOC 2, GDPR), integration complexity with existing infrastructure, uptime SLAs, and vendor lock-in risk. You are deeply skeptical of marketing language.

Objection tendencies: You ask for API documentation, penetration test results, and uptime history. You push back on "seamless integration" claims with specific edge case questions. You want to talk to the engineering team, not sales.`,
  },
];

const SCORE_DIMENSIONS = [
  { key: "message_resonance", label: "Message Resonance", icon: "◈" },
  { key: "pain_alignment", label: "Pain Alignment", icon: "◉" },
  { key: "differentiation", label: "Differentiation Clarity", icon: "◆" },
  { key: "urgency", label: "Urgency / Compelling Event", icon: "▲" },
  { key: "objection_risk", label: "Objection Risk", icon: "◇", inverted: true },
];

const VERDICT_CONFIG = {
  Advance: { color: "#52C77A", bg: "rgba(82,199,122,0.12)", icon: "↑" },
  Nurture: { color: "#E8A838", bg: "rgba(232,168,56,0.12)", icon: "→" },
  "Re-position": { color: "#EF5B5B", bg: "rgba(239,91,91,0.12)", icon: "↺" },
};

function ScoreBar({ value, inverted }) {
  const display = inverted ? 10 - value : value;
  const pct = (display / 10) * 100;
  const color = display >= 7 ? "#52C77A" : display >= 4 ? "#E8A838" : "#EF5B5B";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 11, color, minWidth: 24, textAlign: "right", letterSpacing: 1 }}>
        {display.toFixed(1)}
      </span>
    </div>
  );
}

export default function SyntheticBuyerLab() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [companyContext, setCompanyContext] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const runCountRef = useRef(0);

  const runAnalysis = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    runCountRef.current += 1;
    const runId = runCountRef.current;

    const systemPrompt = `${selectedPersona.profile}

${companyContext ? `COMPANY CONTEXT FOR THIS EVALUATION: ${companyContext}` : ""}

You are evaluating a GTM message / value proposition from a vendor who wants to sell to you. Respond ONLY with a valid JSON object — no markdown, no preamble. Use this exact schema:

{
  "reaction": "Your immediate, authentic first-person reaction to the message (2–3 sentences, in character)",
  "internal_thought": "What you're really thinking but wouldn't say to the vendor (1–2 sentences)",
  "top_objection": "Your single sharpest objection or concern (1 sentence)",
  "follow_up_question": "The one question you'd ask next if on a call (1 sentence)",
  "scores": {
    "message_resonance": <integer 1–10>,
    "pain_alignment": <integer 1–10>,
    "differentiation": <integer 1–10>,
    "urgency": <integer 1–10>,
    "objection_risk": <integer 1–10>
  },
  "verdict": "Advance" | "Nurture" | "Re-position",
  "verdict_rationale": "One sentence explaining your verdict"
}

Score definitions:
- message_resonance: How clearly and compellingly this message lands for your role
- pain_alignment: How closely the message maps to your actual pain points
- differentiation: How distinct this feels from other vendor messages you've heard
- urgency: How much this creates a sense of "I need to act on this now"
- objection_risk: How many red flags or concerns this message raises (higher = more risk)`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Evaluate this GTM message:\n\n"${message}"` }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setHistory(prev => [{ id: runId, persona: selectedPersona, message, result: parsed, company: companyContext }, ...prev].slice(0, 5));
    } catch (e) {
      setError("Analysis failed. Check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? VERDICT_CONFIG[result.verdict] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F12",
      color: "#E4E4E7",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      padding: "0",
    }}>
      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: "linear-gradient(135deg, #E8A838, #EF5B5B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#0D0F12",
          }}>SB</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#FAFAFA" }}>SYNTHETIC BUYER LAB</div>
            <div style={{ fontSize: 10, color: "#52525B", letterSpacing: "0.12em" }}>GTM MESSAGING INTELLIGENCE · v1.0</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "#3F3F46", letterSpacing: "0.1em" }}>
          {history.length > 0 ? `${history.length} RUN${history.length > 1 ? "S" : ""} THIS SESSION` : "NO RUNS YET"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, minHeight: "calc(100vh - 65px)" }}>
        {/* LEFT PANEL — Inputs */}
        <div style={{ padding: 32, borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 10, color: "#52525B", letterSpacing: "0.14em", marginBottom: 12 }}>
              01 · SELECT BUYER PERSONA
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PERSONAS.map(p => (
                <button key={p.id} onClick={() => { setSelectedPersona(p); setResult(null); }}
                  style={{
                    all: "unset", cursor: "pointer",
                    padding: "14px 16px",
                    borderRadius: 8,
                    border: `1px solid ${selectedPersona.id === p.id ? p.color : "rgba(255,255,255,0.07)"}`,
                    background: selectedPersona.id === p.id ? `${p.color}10` : "rgba(255,255,255,0.02)",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.15s ease",
                  }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: selectedPersona.id === p.id ? p.color : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: selectedPersona.id === p.id ? "#0D0F12" : "#71717A",
                  }}>{p.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: selectedPersona.id === p.id ? p.color : "#A1A1AA", letterSpacing: "0.04em" }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: "#52525B", marginTop: 2 }}>{p.title}</div>
                  </div>
                  {selectedPersona.id === p.id && (
                    <div style={{ marginLeft: "auto", fontSize: 12, color: p.color }}>◉</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 10, color: "#52525B", letterSpacing: "0.14em", marginBottom: 10 }}>
              02 · COMPANY CONTEXT <span style={{ color: "#3F3F46" }}>(OPTIONAL — CUSTOMIZE PER INTERVIEW)</span>
            </label>
            <input
              value={companyContext}
              onChange={e => setCompanyContext(e.target.value)}
              placeholder="e.g. Series B cybersecurity firm, 150 reps, SFDC + Outreach stack..."
              style={{
                all: "unset", display: "block", width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "12px 14px",
                fontSize: 11, color: "#A1A1AA",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 10, color: "#52525B", letterSpacing: "0.14em", marginBottom: 10 }}>
              03 · ENTER GTM MESSAGE / VALUE PROPOSITION
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Paste your positioning statement, email copy, talk track, or value prop here...\n\nExample: "We help RevOps teams cut time-to-pipeline by 40% by unifying CRM hygiene and rep activity data in a single pane — without replacing your existing stack."`}
              rows={9}
              style={{
                all: "unset", display: "block", width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "14px",
                fontSize: 11, color: "#D4D4D8", lineHeight: 1.7,
                fontFamily: "inherit", resize: "vertical",
              }}
            />
            <div style={{ fontSize: 9, color: "#3F3F46", marginTop: 8, textAlign: "right" }}>
              {message.length} CHARS
            </div>
          </div>

          <button onClick={runAnalysis} disabled={loading || !message.trim()}
            style={{
              all: "unset", cursor: loading || !message.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", boxSizing: "border-box",
              padding: "15px",
              borderRadius: 8,
              background: loading || !message.trim()
                ? "rgba(255,255,255,0.04)"
                : `linear-gradient(135deg, ${selectedPersona.color}CC, ${selectedPersona.color}88)`,
              color: loading || !message.trim() ? "#3F3F46" : "#0D0F12",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
              transition: "all 0.2s ease",
            }}>
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                RUNNING PERSONA SIMULATION...
              </>
            ) : (
              <>▶ RUN BUYER SIMULATION</>
            )}
          </button>

          {/* History */}
          {history.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 10, color: "#3F3F46", letterSpacing: "0.12em", marginBottom: 12 }}>RECENT RUNS</div>
              {history.map(h => {
                const v = VERDICT_CONFIG[h.result.verdict];
                return (
                  <div key={h.id} onClick={() => { setSelectedPersona(h.persona); setMessage(h.message); setResult(h.result); setCompanyContext(h.company); }}
                    style={{
                      padding: "10px 12px", borderRadius: 6,
                      border: "1px solid rgba(255,255,255,0.05)",
                      marginBottom: 6, cursor: "pointer",
                      background: "rgba(255,255,255,0.02)",
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                    <span style={{ fontSize: 12, color: v.color }}>{v.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: "#71717A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {h.persona.label} · {h.result.verdict}
                      </div>
                      <div style={{ fontSize: 9, color: "#3F3F46", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                        {h.message.slice(0, 60)}...
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT PANEL — Results */}
        <div style={{ padding: 32 }}>
          {!result && !loading && !error && (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "#27272A", textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
              <div style={{ fontSize: 12, letterSpacing: "0.1em" }}>AWAITING INPUT</div>
              <div style={{ fontSize: 10, marginTop: 8, color: "#1C1C1F", maxWidth: 240, lineHeight: 1.7 }}>
                Enter a GTM message and select a buyer persona to run your first simulation
              </div>
            </div>
          )}

          {loading && (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#52525B", letterSpacing: "0.1em", marginBottom: 20 }}>
                  SIMULATING {selectedPersona.label.toUpperCase()}...
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: selectedPersona.color,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: 20, background: "rgba(239,91,91,0.1)", borderRadius: 8, border: "1px solid rgba(239,91,91,0.2)", color: "#EF5B5B", fontSize: 11 }}>
              {error}
            </div>
          )}

          {result && verdict && (
            <div>
              {/* Persona header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: selectedPersona.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#0D0F12",
                }}>{selectedPersona.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA" }}>{selectedPersona.label}</div>
                  <div style={{ fontSize: 10, color: "#52525B", marginTop: 2 }}>{selectedPersona.title}</div>
                </div>
                <div style={{
                  marginLeft: "auto",
                  padding: "6px 14px", borderRadius: 6,
                  background: verdict.bg,
                  border: `1px solid ${verdict.color}40`,
                  fontSize: 11, fontWeight: 700,
                  color: verdict.color, letterSpacing: "0.08em",
                }}>
                  {verdict.icon} {result.verdict.toUpperCase()}
                </div>
              </div>

              {/* Reaction */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#52525B", letterSpacing: "0.12em", marginBottom: 8 }}>IMMEDIATE REACTION</div>
                <div style={{
                  padding: 16, borderRadius: 8,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedPersona.color}30`,
                  fontSize: 12, color: "#D4D4D8", lineHeight: 1.75,
                  fontStyle: "italic",
                }}>
                  "{result.reaction}"
                </div>
              </div>

              {/* Internal thought */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#52525B", letterSpacing: "0.12em", marginBottom: 8 }}>INTERNAL MONOLOGUE <span style={{ color: "#3F3F46" }}>(WHAT THEY WON'T TELL YOU)</span></div>
                <div style={{
                  padding: 14, borderRadius: 8,
                  background: "rgba(239,91,91,0.05)",
                  border: "1px solid rgba(239,91,91,0.12)",
                  fontSize: 11, color: "#A1A1AA", lineHeight: 1.7,
                }}>
                  {result.internal_thought}
                </div>
              </div>

              {/* Objection + Follow-up */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, color: "#52525B", letterSpacing: "0.12em", marginBottom: 8 }}>TOP OBJECTION</div>
                  <div style={{ fontSize: 11, color: "#EF5B5B", lineHeight: 1.6 }}>{result.top_objection}</div>
                </div>
                <div style={{ padding: 14, borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 9, color: "#52525B", letterSpacing: "0.12em", marginBottom: 8 }}>THEY'D ASK NEXT</div>
                  <div style={{ fontSize: 11, color: "#A1A1AA", lineHeight: 1.6 }}>{result.follow_up_question}</div>
                </div>
              </div>

              {/* Scores */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#52525B", letterSpacing: "0.12em", marginBottom: 14 }}>SIGNAL SCORES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SCORE_DIMENSIONS.map(dim => (
                    <div key={dim.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: "#71717A", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#3F3F46" }}>{dim.icon}</span> {dim.label}
                          {dim.inverted && <span style={{ color: "#3F3F46", fontSize: 9 }}>(lower is better)</span>}
                        </span>
                      </div>
                      <ScoreBar value={result.scores[dim.key]} inverted={dim.inverted} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict rationale */}
              <div style={{
                padding: 14, borderRadius: 8,
                background: verdict.bg, border: `1px solid ${verdict.color}30`,
              }}>
                <div style={{ fontSize: 9, color: verdict.color, letterSpacing: "0.12em", marginBottom: 6, opacity: 0.7 }}>VERDICT RATIONALE</div>
                <div style={{ fontSize: 11, color: "#A1A1AA", lineHeight: 1.6 }}>{result.verdict_rationale}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: #3F3F46; }
        textarea:focus, input:focus { outline: none; border-color: rgba(255,255,255,0.15) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>
    </div>
  );
}
