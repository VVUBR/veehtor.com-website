import { useEffect } from "react";

const NAVY = "#111828";
const TEAL = "#15B7A8";
const ORANGE = "#F87316";
const GREEN = "#21C65D";
const LIGHT1 = "#E6E7E9";
const LIGHT2 = "#DBDCE0";
const DARK_TEXT = "#030619";

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      style={{
        fontWeight: 700,
        letterSpacing: "-0.02em",
        fontSize: "1.1rem",
        color: light ? "#fff" : NAVY,
      }}
    >
      v<span style={{ color: ORANGE }}>.</span>AI
    </span>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Adcole() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "AdCoach, partnership concept for Adcole Corporation";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);

  return (
    <div
      style={{
        fontFamily:
          'Calibri, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: DARK_TEXT,
        background: "#fff",
        lineHeight: 1.55,
      }}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        .adcole-h1 { font-size: clamp(2rem, 4.5vw, 3.25rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; margin: 0; }
        .adcole-h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: -0.015em; line-height: 1.15; margin: 0 0 1rem; }
        .adcole-eyebrow { font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        .adcole-section { padding: 5rem 1.25rem; }
        .adcole-container { max-width: 1040px; margin: 0 auto; }
        .adcole-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.85rem 1.4rem; border-radius: 8px; font-weight: 700; font-size: 0.98rem; cursor: pointer; border: 2px solid transparent; transition: transform .15s ease, background .15s ease; text-decoration: none; }
        .adcole-btn:hover { transform: translateY(-1px); }
        .adcole-btn:focus-visible { outline: 3px solid ${TEAL}; outline-offset: 3px; }
        .adcole-btn-primary { background: ${TEAL}; color: ${NAVY}; }
        .adcole-btn-primary:hover { background: #13a596; }
        .adcole-flow { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 2.5rem; }
        .adcole-node { padding: 1rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.95rem; text-align: center; min-width: 200px; }
        .adcole-arrow { color: ${NAVY}; opacity: 0.4; font-size: 1.5rem; }
        .adcole-cards-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2rem; }
        .adcole-card { background: #fff; border: 1px solid ${LIGHT2}; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
        .adcole-card h3 { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.5rem; color: ${NAVY}; }
        .adcole-tag { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.55rem; border-radius: 4px; background: rgba(33,198,93,0.12); color: ${GREEN}; margin-bottom: 0.75rem; }
        .adcole-iframe-card { background: #fff; border: 1px solid ${LIGHT2}; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(17,24,40,0.08); margin-top: 2rem; }
        .adcole-iframe { width: 100%; height: 820px; border: 0; display: block; }
        @media (max-width: 820px) {
          .adcole-iframe { height: 1040px; }
          .adcole-section { padding: 3.5rem 1.25rem; }
          .adcole-cards-3 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <section
        className="adcole-section"
        style={{ background: NAVY, color: "#fff", paddingTop: "2rem" }}
      >
        <div className="adcole-container">
          <div style={{ marginBottom: "3rem" }}>
            <Wordmark light />
          </div>
          <p
            className="adcole-eyebrow"
            style={{ color: TEAL, margin: "0 0 1.25rem" }}
          >
            Partnership concept, prepared for Adcole Corporation
          </p>
          <h1 className="adcole-h1" style={{ color: "#fff", maxWidth: "900px" }}>
            AdCoach: turn decades of field knowledge into a system that
            compounds.
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "780px",
              marginTop: "1.5rem",
            }}
          >
            A field service assistant that resolves faster and captures what it
            learns, so expertise stops walking out the door when a senior
            engineer retires.
          </p>
          <div style={{ marginTop: "2.5rem" }}>
            <button
              className="adcole-btn adcole-btn-primary"
              onClick={() => scrollToId("live-concept")}
            >
              See the live concept
            </button>
          </div>
        </div>
      </section>

      {/* OPPORTUNITY */}
      <section className="adcole-section" style={{ background: LIGHT1 }}>
        <div className="adcole-container">
          <p className="adcole-eyebrow" style={{ color: NAVY, opacity: 0.7 }}>
            The opportunity
          </p>
          <h2 className="adcole-h2" style={{ color: NAVY, marginTop: "1rem" }}>
            The knowledge is leaving the building.
          </h2>
          <p style={{ fontSize: "1.1rem", maxWidth: "820px" }}>
            Today every resolution lives in a senior engineer's head or a
            scattered guide, and it leaves when they retire. AdCoach answers
            from your own documented knowledge and captures every new
            resolution, so the knowledge base compounds with use instead of
            draining with turnover.
          </p>

          <div className="adcole-flow" role="img" aria-label="Flow: knowledge drains, AdCoach captures, knowledge compounds">
            <div
              className="adcole-node"
              style={{ background: "#fff", color: "#6b7280", border: `1px dashed #b8bcc4` }}
            >
              Knowledge drains
              <br />
              with turnover
            </div>
            <span className="adcole-arrow" aria-hidden>→</span>
            <div
              className="adcole-node"
              style={{ background: TEAL, color: NAVY }}
            >
              AdCoach captures
              <br />
              every resolution
            </div>
            <span className="adcole-arrow" aria-hidden>→</span>
            <div
              className="adcole-node"
              style={{ background: GREEN, color: "#fff" }}
            >
              Knowledge base
              <br />
              compounds
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CONCEPT */}
      <section className="adcole-section" id="live-concept" style={{ background: "#fff" }}>
        <div className="adcole-container">
          <p className="adcole-eyebrow" style={{ color: NAVY, opacity: 0.7 }}>
            The look and feel
          </p>
          <h2 className="adcole-h2" style={{ color: NAVY, marginTop: "1rem" }}>
            An interactive concept of AdCoach.
          </h2>
          <p style={{ fontSize: "1.05rem", maxWidth: "820px" }}>
            It uses your own diagnostic tree and the guardrails from your scope,
            illustrative and not trained on Adcole data. Click the options,
            switch the language, and toggle Online to see the offline behavior.
          </p>

          <div className="adcole-iframe-card">
            <iframe
              src="https://remarkable-hotteok-e67140.netlify.app/"
              title="AdCoach interactive concept"
              loading="lazy"
              allowFullScreen
              style={{ width: "100%", height: "820px", border: 0, borderRadius: "14px" }}
            />
          </div>
        </div>
      </section>

      {/* SUCCESS */}
      <section className="adcole-section" id="success" style={{ background: LIGHT1 }}>
        <div className="adcole-container">
          <p className="adcole-eyebrow" style={{ color: NAVY, opacity: 0.7 }}>
            What success looks like
          </p>
          <p style={{ fontSize: "1.05rem", maxWidth: "780px", marginTop: "1rem" }}>
            Measured against the baseline we set in the proof of concept, on
            your own metrics.
          </p>

          <div className="adcole-cards-3">
            <div className="adcole-card">
              <span className="adcole-tag">Down</span>
              <h3>Time to resolution</h3>
              <p style={{ margin: 0, fontSize: "0.98rem", color: "#374151" }}>
                A cited answer in seconds, not an escalation.
              </p>
            </div>
            <div className="adcole-card">
              <span className="adcole-tag">Down</span>
              <h3>Escalations per month</h3>
              <p style={{ margin: 0, fontSize: "0.98rem", color: "#374151" }}>
                The senior engineer is the last resort, not the first call.
              </p>
            </div>
            <div className="adcole-card">
              <span className="adcole-tag">Up</span>
              <h3>Knowledge captured</h3>
              <p style={{ margin: 0, fontSize: "0.98rem", color: "#374151" }}>
                Every resolved case becomes reusable, validated knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHERE THIS GOES */}
      <section className="adcole-section" style={{ background: NAVY, color: "#fff" }}>
        <div className="adcole-container">
          <p className="adcole-eyebrow" style={{ color: TEAL }}>
            Where this goes
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.82)",
              maxWidth: "820px",
              marginTop: "1rem",
            }}
          >
            The proof of concept is phase one. The same foundation extends, with
            no rebuild, to dashboards, predictive maintenance, and self-diagnostic
            machines that detect and report issues on their own, a new service
            line and revenue stream for Adcole.
          </p>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "820px",
            }}
          >
            Governance first. Your data stays in your environment, no
            third-party training, every answer cited, every query logged.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: NAVY, color: "#fff", padding: "3rem 1.25rem" }}>
        <div className="adcole-container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Wordmark light />
            <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
              Veehtor AI
            </span>
          </div>
          <p style={{ marginTop: "1.25rem", fontSize: "1rem", color: "rgba(255,255,255,0.9)" }}>
            Vitor Ungari, vitor@veehtor.com, (781) 655-9279, veehtor.com
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>
            Private concept prepared for Adcole Corporation. Sample content for
            demonstration, not trained on Adcole data.
          </p>
        </div>
      </footer>
    </div>
  );
}
