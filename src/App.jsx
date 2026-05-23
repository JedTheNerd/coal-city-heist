import { useState, useEffect, useRef } from "react";

// ─── FONTS ───
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');
`;

// ─── CONSTANTS ───
const COLORS = {
  charcoal: "#1A1A1A",
  cream: "#F5ECD7",
  gold: "#C9A84C",
  red: "#C0392B",
  offWhite: "#FAF6F0",
  darkWood: "#2C1E12",
  paperShadow: "rgba(0,0,0,0.35)",
};

const QUIZ_QUESTIONS = [
  {
    number: 1,
    question: "It's a group project. What role do you naturally fall into?",
    answers: [
      { text: "The one who does the research nobody asked for", role: "shadow", key: "A" },
      { text: "The one who builds the actual thing", role: "specialist", key: "B" },
      { text: "The one who presents it", role: "charmer", key: "C" },
      { text: "The one who sets the deadlines and makes sure people meet them", role: "driver", key: "D" },
      { text: "The one who joins late but somehow saves it", role: "wildcard", key: "E" },
    ],
  },
  {
    number: 2,
    question: "Your friends would describe you as...",
    answers: [
      { text: "Hard to read but always watching", role: "shadow", key: "A" },
      { text: "The one who fixes everything", role: "specialist", key: "B" },
      { text: "The one who knows everyone", role: "charmer", key: "C" },
      { text: "The one who actually gets things done", role: "driver", key: "D" },
      { text: "The one with the craziest stories", role: "wildcard", key: "E" },
    ],
  },
  {
    number: 3,
    question: "You're at a party. Where are you?",
    answers: [
      { text: "Observing from a quiet corner, picking up on everything", role: "shadow", key: "A" },
      { text: "Fixing the speaker that stopped working", role: "specialist", key: "B" },
      { text: "In the middle of the room holding court", role: "charmer", key: "C" },
      { text: "You organized the party", role: "driver", key: "D" },
      { text: "Showed up uninvited and somehow became the main character", role: "wildcard", key: "E" },
    ],
  },
  {
    number: 4,
    question: "Pick a movie.",
    answers: [
      { text: "Inception", role: "shadow", key: "A" },
      { text: "The Social Network", role: "specialist", key: "B" },
      { text: "Wolf of Wall Street", role: "charmer", key: "C" },
      { text: "Fast Five", role: "driver", key: "D" },
      { text: "Joker", role: "wildcard", key: "E" },
    ],
  },
  {
    number: 5,
    question: "The vault door is open. You have 30 seconds. What do you do?",
    answers: [
      { text: "I already memorized the layout. I know exactly where the diamonds are", role: "shadow", key: "A" },
      { text: "I'm the reason the door is open", role: "specialist", key: "B" },
      { text: "I'm keeping security distracted while the crew moves", role: "charmer", key: "C" },
      { text: "I'm counting down the seconds and making sure everyone gets out", role: "driver", key: "D" },
      { text: "I wasn't supposed to be here but I'm grabbing what I can", role: "wildcard", key: "E" },
    ],
  },
];

const ROLE_DATA = {
  shadow: { title: "THE SHADOW", color: COLORS.charcoal, accent: "#555", desc: "The infiltrator. Gets in and out without anyone knowing." },
  specialist: { title: "THE SPECIALIST", color: "#8A8A8A", accent: "#B0B0B0", desc: "The builder. You're the reason the door opened." },
  charmer: { title: "THE CHARMER", color: COLORS.gold, accent: "#D4B85C", desc: "The front of the operation. People remember you." },
  driver: { title: "THE DRIVER", color: COLORS.offWhite, accent: "#E0D8C8", desc: "You keep the operation moving. Without you, the heist stalls." },
  wildcard: { title: "THE WILDCARD", color: COLORS.red, accent: "#D94E41", desc: "The unpredictable element. The crew doesn't always trust you — but they always need you." },
};

const PAGES = ["hero", "quiz", "identity", "division", "welfare", "confirmation"];

// ─── STYLES ───
const styles = {
  app: {
    minHeight: "100vh",
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(60,35,15,0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(44,30,18,0.3) 0%, transparent 50%),
      linear-gradient(180deg, #1a0f08 0%, #2C1E12 30%, #231510 70%, #0d0806 100%)
    `,
    fontFamily: "'Courier Prime', 'Courier New', monospace",
    color: COLORS.charcoal,
    position: "relative",
    overflow: "hidden",
  },
  woodGrain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      repeating-linear-gradient(
        92deg,
        transparent,
        transparent 18px,
        rgba(255,255,255,0.015) 18px,
        rgba(255,255,255,0.015) 19px
      ),
      repeating-linear-gradient(
        88deg,
        transparent,
        transparent 40px,
        rgba(0,0,0,0.08) 40px,
        rgba(0,0,0,0.08) 41px
      )
    `,
    pointerEvents: "none",
    zIndex: 0,
  },
  paperContainer: {
    position: "relative",
    zIndex: 1,
    maxWidth: 520,
    margin: "0 auto",
    padding: "40px 16px 60px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    background: `
      linear-gradient(135deg, ${COLORS.cream} 0%, #EDE4CC 40%, ${COLORS.cream} 60%, #E8DFC5 100%)
    `,
    padding: "36px 28px 32px",
    position: "relative",
    boxShadow: `
      6px 8px 24px ${COLORS.paperShadow},
      2px 3px 8px rgba(0,0,0,0.2),
      inset 0 0 60px rgba(0,0,0,0.03)
    `,
    transform: "rotate(-0.6deg)",
    width: "100%",
    maxWidth: 480,
    borderRadius: 1,
  },
  paperCrease: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "48%",
    height: 1,
    background: "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.06) 80%, transparent 95%)",
    pointerEvents: "none",
  },
  paperEdge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 28,
    height: 28,
    background: `linear-gradient(135deg, transparent 50%, #d5ccb4 50%, #c8bfaa 100%)`,
    boxShadow: "-1px 1px 3px rgba(0,0,0,0.1)",
    pointerEvents: "none",
  },
  caseHeader: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    letterSpacing: 2,
    color: "rgba(26,26,26,0.5)",
    borderBottom: "1px solid rgba(26,26,26,0.15)",
    paddingBottom: 8,
    marginBottom: 24,
    textTransform: "uppercase",
    lineHeight: 1.8,
  },
  headline: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 32,
    letterSpacing: 2,
    lineHeight: 1.1,
    color: COLORS.charcoal,
    marginBottom: 16,
  },
  redactionBar: {
    display: "inline-block",
    background: COLORS.charcoal,
    height: "1.1em",
    verticalAlign: "middle",
    borderRadius: 1,
    position: "relative",
  },
  bodyText: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    color: "rgba(26,26,26,0.8)",
    marginBottom: 16,
  },
  stamp: {
    position: "absolute",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 18,
    letterSpacing: 4,
    color: COLORS.red,
    border: `2px solid ${COLORS.red}`,
    padding: "4px 12px",
    transform: "rotate(-12deg)",
    opacity: 0.8,
    top: 20,
    right: 20,
  },
  seal: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: `2px solid ${COLORS.gold}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "24px auto 0",
    position: "relative",
  },
  sealInner: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: `1px solid ${COLORS.gold}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  sealText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 7,
    letterSpacing: 2,
    color: COLORS.gold,
    textAlign: "center",
    lineHeight: 1.2,
  },
  ctaButton: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 18,
    letterSpacing: 4,
    background: COLORS.charcoal,
    color: COLORS.cream,
    border: "none",
    padding: "14px 32px",
    cursor: "pointer",
    display: "block",
    width: "100%",
    marginTop: 24,
    transition: "all 0.2s ease",
    position: "relative",
    overflow: "hidden",
  },
  input: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    background: "transparent",
    border: "none",
    borderBottom: `1px solid rgba(26,26,26,0.25)`,
    padding: "8px 0",
    width: "100%",
    color: COLORS.charcoal,
    outline: "none",
    marginBottom: 4,
    transition: "border-color 0.2s",
  },
  label: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    letterSpacing: 1,
    color: "rgba(26,26,26,0.5)",
    textTransform: "uppercase",
    marginBottom: 4,
    display: "block",
    marginTop: 16,
  },
  select: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    background: "transparent",
    border: "none",
    borderBottom: `1px solid rgba(26,26,26,0.25)`,
    padding: "8px 0",
    width: "100%",
    color: COLORS.charcoal,
    outline: "none",
    marginBottom: 4,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A1A1A' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 4px center",
    paddingRight: 20,
  },
  quizOption: (selected) => ({
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    padding: "12px 16px",
    border: `1px solid ${selected ? COLORS.charcoal : "rgba(26,26,26,0.15)"}`,
    background: selected ? "rgba(26,26,26,0.06)" : "transparent",
    cursor: "pointer",
    marginBottom: 8,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    transition: "all 0.15s ease",
    lineHeight: 1.5,
    color: COLORS.charcoal,
  }),
  quizKey: (selected) => ({
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 16,
    color: selected ? COLORS.charcoal : "rgba(26,26,26,0.4)",
    minWidth: 18,
    paddingTop: 1,
  }),
  progressBar: {
    height: 2,
    background: "rgba(26,26,26,0.1)",
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${pct}%`,
    background: COLORS.charcoal,
    transition: "width 0.4s ease",
  }),
  redAnnotation: {
    color: COLORS.red,
    fontStyle: "italic",
    fontSize: 12,
    fontFamily: "'Courier Prime', monospace",
  },
  tapeStrip: {
    position: "absolute",
    width: 60,
    height: 18,
    background: "rgba(200,190,160,0.5)",
    transform: "rotate(-3deg)",
    top: -8,
    left: 30,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    borderRadius: 1,
  },
  paperClip: {
    position: "absolute",
    top: -6,
    right: 40,
    width: 20,
    height: 44,
    borderRadius: "10px 10px 0 0",
    border: "2px solid #999",
    borderBottom: "none",
    transform: "rotate(5deg)",
  },
  noiseOverlay: {
    position: "fixed",
    inset: 0,
    opacity: 0.04,
    pointerEvents: "none",
    zIndex: 999,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  },
};

// ─── COMPONENTS ───

function Seal({ size = 64, gold = false }) {
  const c = gold ? COLORS.gold : COLORS.charcoal;
  return (
    <div style={{ ...styles.seal, width: size, height: size, borderColor: c }}>
      <div style={{ ...styles.sealInner, width: size * 0.75, height: size * 0.75, borderColor: c }}>
        <div style={{ ...styles.sealText, color: c, fontSize: size * 0.1 }}>
          THE COAL CITY
          <br />
          <span style={{ fontSize: size * 0.14, letterSpacing: 3 }}>HEIST</span>
          <br />
          NC ENUGU 2026
        </div>
      </div>
    </div>
  );
}

function CaseHeader({ caseNo = "███", status = "OPEN" }) {
  return (
    <div style={styles.caseHeader}>
      CASE FILE / NO. {caseNo} / STATUS: {status}
      <br />
      AUTHOR: CLASSIFIED / DIVISION: DIGITAL OPERATIONS
    </div>
  );
}

function RedactionBar({ width = 80 }) {
  return <span style={{ ...styles.redactionBar, width }} />;
}

function TypewriterText({ text, speed = 30, onComplete, style = {} }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    idx.current = 0;
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={style}>
      {displayed}
      <span style={{ opacity: 0.4, animation: "blink 1s step-end infinite" }}>▌</span>
    </span>
  );
}

// ─── PAGE: HERO ───
function HeroPage({ onBegin }) {
  const [showCta, setShowCta] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div style={styles.paper}>
      <div style={styles.tapeStrip} />
      <div style={styles.paperClip} />
      <div style={styles.paperCrease} />
      <div style={styles.paperEdge} />

      <div style={styles.stamp}>CLASSIFIED</div>

      <CaseHeader caseNo="001" status="OPEN" />

      <div style={styles.headline}>
        THE{" "}
        <span style={{ position: "relative" }}>
          <RedactionBar width={120} />
          <span
            style={{
              position: "absolute",
              left: 4,
              top: -2,
              color: COLORS.red,
              fontFamily: "'Courier Prime', monospace",
              fontSize: 14,
              fontWeight: "bold",
              fontStyle: "italic",
              transform: "rotate(-2deg)",
              display: "inline-block",
            }}
          >
            COMMITTEE
          </span>
        </span>{" "}
        HAVE BEEN IDENTIFIED.
      </div>

      <div style={{ ...styles.bodyText, marginTop: 24 }}>
        <TypewriterText
          text="You weren't supposed to find this page."
          speed={35}
          onComplete={() => setShowCta(true)}
        />
      </div>

      {showCta && (
        <div style={{ animation: "fadeIn 0.8s ease" }}>
          <p style={styles.bodyText}>
            But since you're here — the Coal City has something worth stealing. The crew is almost
            complete. One question.
          </p>
          <p
            style={{
              ...styles.bodyText,
              fontWeight: "bold",
              color: COLORS.charcoal,
              fontSize: 15,
            }}
          >
            Can you be trusted?
          </p>

          <div style={{ margin: "20px 0 8px" }}>
            <span style={styles.redAnnotation}>↳ begin assessment below</span>
          </div>

          <button
            style={{
              ...styles.ctaButton,
              background: hovered ? COLORS.red : COLORS.charcoal,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onBegin}
          >
            [ BEGIN ASSESSMENT ]
          </button>
        </div>
      )}

      <Seal />

      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 12,
          letterSpacing: 4,
          color: "rgba(26,26,26,0.35)",
        }}
      >
        NC ENUGU 2026 — PRESSURE MAKES DIAMONDS
      </div>
    </div>
  );
}

// ─── PAGE: QUIZ ───
function QuizPage({ onComplete }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const q = QUIZ_QUESTIONS[qIdx];
  const progress = ((qIdx + (selected ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (answer) => {
    setSelected(answer);
    setTimeout(() => {
      const newAnswers = [...answers, answer];
      if (qIdx < QUIZ_QUESTIONS.length - 1) {
        setAnswers(newAnswers);
        setQIdx(qIdx + 1);
        setSelected(null);
      } else {
        // Calculate role
        const scores = {};
        newAnswers.forEach((a, i) => {
          scores[a.role] = (scores[a.role] || 0) + 1;
        });
        const maxScore = Math.max(...Object.values(scores));
        const topRoles = Object.keys(scores).filter((r) => scores[r] === maxScore);
        let role;
        if (topRoles.length === 1) {
          role = topRoles[0];
        } else if (topRoles.length === 2) {
          const q5Role = newAnswers[4].role;
          role = topRoles.includes(q5Role) ? q5Role : topRoles[0];
        } else {
          role = "wildcard";
        }
        onComplete(role);
      }
    }, 400);
  };

  return (
    <div style={styles.paper}>
      <div style={styles.paperCrease} />
      <div style={styles.paperEdge} />
      <div style={styles.stamp}>ASSESSMENT</div>

      <CaseHeader caseNo="002" status="IN PROGRESS" />

      <div style={styles.progressBar}>
        <div style={styles.progressFill(progress)} />
      </div>

      <div
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: 10,
          letterSpacing: 2,
          color: "rgba(26,26,26,0.4)",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Question {q.number} of {QUIZ_QUESTIONS.length}
      </div>

      <div
        style={{
          ...styles.headline,
          fontSize: 20,
          lineHeight: 1.3,
          marginBottom: 20,
          fontFamily: "'Courier Prime', monospace",
          fontWeight: "bold",
        }}
      >
        {q.question}
      </div>

      <div>
        {q.answers.map((a) => (
          <div
            key={a.key}
            style={styles.quizOption(selected?.key === a.key)}
            onClick={() => !selected && handleSelect(a)}
          >
            <span style={styles.quizKey(selected?.key === a.key)}>{a.key}.</span>
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      <Seal size={48} />
    </div>
  );
}

// ─── PAGE: FORM (Identity / Division / Welfare) ───
function FormPage({ page, formData, setFormData, onNext, onBack, role }) {
  const isIdentity = page === "identity";
  const isDivision = page === "division";
  const isWelfare = page === "welfare";

  const update = (key, val) => setFormData({ ...formData, [key]: val });

  const pageNum = isIdentity ? 1 : isDivision ? 2 : 3;
  const totalPages = 3;

  const fields = isIdentity
    ? [
        { key: "name", label: "What name is on your file?", placeholder: "Enter your alias...", type: "text" },
        { key: "phone", label: "Direct line to the operative", placeholder: "In case the crew needs to reach you...", type: "tel" },
        { key: "email", label: "Where do we send the dossier?", placeholder: "Your classified inbox...", type: "email" },
        { key: "dob", label: "Date the operative was commissioned", placeholder: "", type: "date" },
        { key: "yearJoined", label: "When were you first recruited?", placeholder: "Year...", type: "select", options: ["2018","2019","2020","2021","2022","2023","2024","2025","2026"] },
        { key: "social", label: "Where can the crew find you?", placeholder: "Instagram handle...", type: "text" },
      ]
    : isDivision
    ? [
        { key: "rank", label: "What's your clearance level?", placeholder: "", type: "select", options: ["TM","TL","LCVP","LCP"] },
        { key: "role", label: "What's your function in the operation?", placeholder: "", type: "select", options: ["iGV","iGTa","iGTe","oGV","oGTa","oGTe","MKT","FIN","TM","BD","PM","ER"] },
        { key: "lc", label: "Which division are you from?", placeholder: "", type: "select", options: ["AIESEC in ABU","AIESEC in Abuja","AIESEC in Ahmadu Bello","AIESEC in Babcock","AIESEC in Benin","AIESEC in Covenant","AIESEC in Enugu","AIESEC in Ibadan","AIESEC in Ife","AIESEC in Ilorin","AIESEC in Jos","AIESEC in Lagos","AIESEC in OAU","AIESEC in UNILAG","AIESEC in UNN"] },
        { key: "firstConf", label: "Is this your first operation?", placeholder: "", type: "select", options: ["First deployment","I've done this before"] },
        { key: "expectations", label: "What do you expect to take from this heist?", placeholder: "What are you here for...", type: "textarea" },
        { key: "suggestions", label: "Any intel for the masterminds?", placeholder: "Anything we should know...", type: "textarea" },
      ]
    : [
        { key: "allergies", label: "Any substances that compromise the operative?", placeholder: "Anything the crew should know...", type: "text" },
        { key: "treatment", label: "What countermeasure must be on hand?", placeholder: "The antidote for your condition...", type: "text" },
        { key: "accommodation", label: "Will you share quarters with another operative?", placeholder: "", type: "select", options: ["Solo","Shared"] },
        { key: "emergencyContact", label: "Who do we contact if the operation goes sideways?", placeholder: "Next of kin...", type: "text" },
        { key: "emergencyRelation", label: "Their connection to you", placeholder: "", type: "select", options: ["Parent","Sibling","Spouse","Friend","Other"] },
        { key: "emergencyPhone", label: "Their direct line", placeholder: "In case we need to make the call...", type: "tel" },
      ];

  return (
    <div style={styles.paper}>
      <div style={styles.paperCrease} />
      <div style={styles.paperEdge} />

      <CaseHeader caseNo={`003.${pageNum}`} status="OPEN" />

      <div style={styles.progressBar}>
        <div style={styles.progressFill((pageNum / totalPages) * 100)} />
      </div>

      <div
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: 10,
          letterSpacing: 2,
          color: "rgba(26,26,26,0.4)",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Dossier — Page {pageNum} of {totalPages}
      </div>

      <div style={{ ...styles.headline, fontSize: 22 }}>
        {isIdentity ? "IDENTITY FILE" : isDivision ? "DIVISION & FUNCTION" : "WELFARE & EMERGENCY"}
      </div>

      {role && isIdentity && (
        <div
          style={{
            background: "rgba(26,26,26,0.04)",
            border: `1px solid rgba(26,26,26,0.1)`,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 12,
            fontFamily: "'Courier Prime', monospace",
          }}
        >
          <span style={{ color: "rgba(26,26,26,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>
            Crew assignment:{" "}
          </span>
          <span style={{ fontWeight: "bold", color: ROLE_DATA[role]?.color === COLORS.offWhite ? COLORS.charcoal : ROLE_DATA[role]?.color }}>
            {ROLE_DATA[role]?.title}
          </span>
        </div>
      )}

      {fields.map((f) => (
        <div key={f.key}>
          <label style={styles.label}>{f.label}</label>
          {f.type === "select" ? (
            <select
              style={styles.select}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
            >
              <option value="" disabled>
                {f.placeholder || "Select..."}
              </option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              style={{ ...styles.input, resize: "vertical", minHeight: 48, borderBottom: `1px solid rgba(26,26,26,0.25)` }}
              placeholder={f.placeholder}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
            />
          ) : (
            <input
              style={styles.input}
              type={f.type}
              placeholder={f.placeholder}
              value={formData[f.key] || ""}
              onChange={(e) => update(f.key, e.target.value)}
            />
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          style={{
            ...styles.ctaButton,
            background: "transparent",
            color: COLORS.charcoal,
            border: `1px solid rgba(26,26,26,0.2)`,
            flex: "0 0 auto",
            width: "auto",
            padding: "14px 20px",
          }}
          onClick={onBack}
        >
          ← BACK
        </button>
        <button style={{ ...styles.ctaButton, flex: 1 }} onClick={onNext}>
          {isWelfare ? "[ SUBMIT DOSSIER ]" : "CONTINUE →"}
        </button>
      </div>

      <Seal size={48} />
    </div>
  );
}

// ─── PAGE: CONFIRMATION ───
function ConfirmationPage({ formData, role, onReset }) {
  const caseNo = `CCH-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
  const rd = ROLE_DATA[role] || ROLE_DATA.wildcard;

  return (
    <div style={styles.paper}>
      <div style={styles.paperCrease} />
      <div style={styles.paperEdge} />

      <div
        style={{
          ...styles.stamp,
          color: "#2d7a3a",
          borderColor: "#2d7a3a",
        }}
      >
        GRANTED
      </div>

      <CaseHeader caseNo={caseNo} status="CLEARED" />

      <div style={{ ...styles.headline, color: COLORS.gold, fontSize: 36 }}>
        CLEARANCE: GRANTED
      </div>

      <div
        style={{
          border: `1px solid rgba(26,26,26,0.15)`,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ ...styles.label, marginTop: 0 }}>Case No.</div>
        <div style={{ ...styles.bodyText, fontWeight: "bold", marginBottom: 12, fontSize: 16 }}>
          {caseNo}
        </div>

        <div style={styles.label}>Operative</div>
        <div style={{ ...styles.bodyText, marginBottom: 12 }}>
          {formData.name || "CLASSIFIED"}
        </div>

        <div style={styles.label}>Division</div>
        <div style={{ ...styles.bodyText, marginBottom: 12 }}>
          {formData.lc || "UNASSIGNED"}
        </div>

        <div style={styles.label}>Crew Assignment</div>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 24,
            letterSpacing: 3,
            color: rd.color === COLORS.offWhite ? COLORS.charcoal : rd.color,
            marginBottom: 4,
          }}
        >
          {rd.title}
        </div>
        <div style={{ ...styles.bodyText, fontStyle: "italic", fontSize: 12 }}>{rd.desc}</div>
      </div>

      <div style={styles.bodyText}>Your dossier has been filed.</div>
      <div style={styles.bodyText}>Your crew assignment is locked.</div>
      <div style={styles.bodyText}>The masterminds will be in touch.</div>
      <div style={{ ...styles.bodyText, fontWeight: "bold", marginTop: 12 }}>
        Stand by for further instructions.
      </div>

      <div style={{ textAlign: "center", margin: "24px 0 8px" }}>
        <span style={styles.redAnnotation}>↳ the operation is in motion</span>
      </div>

      <Seal gold size={72} />

      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 14,
          letterSpacing: 4,
          color: COLORS.gold,
        }}
      >
        PRESSURE MAKES DIAMONDS
      </div>

      <button
        style={{
          ...styles.ctaButton,
          background: "transparent",
          color: "rgba(26,26,26,0.3)",
          border: `1px solid rgba(26,26,26,0.1)`,
          fontSize: 12,
          marginTop: 24,
          letterSpacing: 2,
        }}
        onClick={onReset}
      >
        ← START OVER
      </button>
    </div>
  );
}

// ─── MAIN APP ───
export default function CoalCityHeist() {
  const [page, setPage] = useState("hero");
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});

  const goTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setPage("hero");
    setRole(null);
    setFormData({});
  };

  return (
    <>
      <style>{FONTS}{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input:focus, select:focus, textarea:focus { border-bottom-color: ${COLORS.charcoal} !important; }
        button:active { transform: scale(0.98); }
        ::selection { background: ${COLORS.gold}; color: ${COLORS.charcoal}; }
        * { box-sizing: border-box; }
        textarea { font-family: 'Courier Prime', monospace; }
      `}</style>

      <div style={styles.app}>
        <div style={styles.woodGrain} />
        <div style={styles.noiseOverlay} />

        <div style={styles.paperContainer}>
          {page === "hero" && <HeroPage onBegin={() => goTo("quiz")} />}

          {page === "quiz" && (
            <QuizPage
              onComplete={(r) => {
                setRole(r);
                goTo("identity");
              }}
            />
          )}

          {page === "identity" && (
            <FormPage
              page="identity"
              formData={formData}
              setFormData={setFormData}
              role={role}
              onNext={() => goTo("division")}
              onBack={() => goTo("quiz")}
            />
          )}

          {page === "division" && (
            <FormPage
              page="division"
              formData={formData}
              setFormData={setFormData}
              role={role}
              onNext={() => goTo("welfare")}
              onBack={() => goTo("identity")}
            />
          )}

          {page === "welfare" && (
            <FormPage
              page="welfare"
              formData={formData}
              setFormData={setFormData}
              role={role}
              onNext={() => goTo("confirmation")}
              onBack={() => goTo("division")}
            />
          )}

          {page === "confirmation" && (
            <ConfirmationPage formData={formData} role={role} onReset={reset} />
          )}
        </div>
      </div>
    </>
  );
}
