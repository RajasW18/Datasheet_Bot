import { useState } from "react";
import {
  Cpu,
  Zap,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Activity,
  Layers,
  Sparkles,
  Terminal,
  FileText,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";
import { ShimmerButton } from "../ui/ShimmerButton";
import { Badge } from "../ui/Badge";
import { BackgroundGrid } from "../ui/BackgroundGrid";
import { BorderBeam } from "../ui/BorderBeam";

/**
 * LandingPage — Aceternity & MagicUI-inspired premium presentation for DatasheetIQ.
 */
export function LandingPage({ onEnterApp, onOpenAuth, user }) {
  // Interactive Simulator state in Hero
  const [selectedChip, setSelectedChip] = useState("ice2pcs01");
  const [testVoltage, setTestVoltage] = useState(18);

  const chipsData = {
    ice2pcs01: {
      name: "Infineon ICE2PCS01",
      category: "PFC Controller IC",
      vccMin: 11,
      vccMax: 25,
      vccAbsMax: 26,
      pins: [
        { pin: 1, name: "GND", desc: "IC Ground reference" },
        { pin: 2, name: "ICOMP", desc: "Current loop compensation" },
        { pin: 3, name: "ISENSE", desc: "Current sensing input" },
        { pin: 4, name: "OVP", desc: "Overvoltage protection input" },
        { pin: 5, name: "RD", desc: "Resistor setting frequency" },
        { pin: 6, name: "VINS", desc: "AC input line sensing" },
        { pin: 7, name: "VCC", desc: "Supply voltage input" },
        { pin: 8, name: "GATE", desc: "MOSFET gate driver output" },
      ],
      description: "Standalone power factor correction controller in continuous conduction mode.",
    },
    esp32s3: {
      name: "Espressif ESP32-S3",
      category: "Dual-Core Wi-Fi & BLE MCU",
      vccMin: 3.0,
      vccMax: 3.6,
      vccAbsMax: 3.6,
      pins: [
        { pin: 1, name: "VDD3P3", desc: "3.3V Power Supply" },
        { pin: 2, name: "CHIP_PU", desc: "Chip enable (pull high)" },
        { pin: 3, name: "GPIO0", desc: "Boot strap / General I/O" },
        { pin: 4, name: "GPIO1", desc: "ADC1_CH0 / Touch_CH1" },
        { pin: 5, name: "TXD0", desc: "UART0 Transmit pin" },
        { pin: 6, name: "RXD0", desc: "UART0 Receive pin" },
        { pin: 7, name: "USB_D+", desc: "Native USB Full Speed D+" },
        { pin: 8, name: "GND", desc: "Ground thermal pad" },
      ],
      description: "240MHz Xtensa 32-bit LX7 dual-core MCU with vector instructions for AI on the edge.",
    },
    atmega328p: {
      name: "Microchip ATmega328P",
      category: "8-bit AVR Microcontroller",
      vccMin: 1.8,
      vccMax: 5.5,
      vccAbsMax: 6.0,
      pins: [
        { pin: 1, name: "PC6 / RESET", desc: "Active-low reset pin" },
        { pin: 2, name: "PD0 / RXD", desc: "USART Serial input" },
        { pin: 3, name: "PD1 / TXD", desc: "USART Serial output" },
        { pin: 4, name: "PD2 / INT0", desc: "External interrupt 0" },
        { pin: 5, name: "VCC", desc: "Digital supply voltage" },
        { pin: 6, name: "GND", desc: "Digital ground reference" },
        { pin: 7, name: "XTAL1", desc: "Crystal oscillator input" },
        { pin: 8, name: "XTAL2", desc: "Crystal oscillator output" },
      ],
      description: "Industry standard low-power 8-bit AVR RISC microcontroller powering Arduino Uno.",
    },
  };

  const currentChip = chipsData[selectedChip];
  const isViolated = testVoltage > currentChip.vccAbsMax;
  const isOutOfRecommended =
    testVoltage < currentChip.vccMin || testVoltage > currentChip.vccMax;

  return (
    <div className="landing-root">
      {/* Background circuit grid with vignette */}
      <BackgroundGrid type="dots" opacity={0.35} />

      {/* Floating glowing orbs */}
      <div className="landing-glow-orb orb-1" />
      <div className="landing-glow-orb orb-2" />

      {/* ── Navbar ─────────────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="brand-icon-box">
              <Cpu size={22} className="text-cyan animate-pulse" />
            </div>
            <span className="brand-text">Datasheet<span className="text-cyan">IQ</span></span>
            <Badge variant="cyan" dot={true}>v2.0 AI</Badge>
          </div>

          <nav className="landing-links">
            <a href="#simulator">Live Simulator</a>
            <a href="#bento">Safety Engine</a>
            <a href="#comparison">Why DatasheetIQ</a>
            <a href="#specs">Specifications</a>
          </nav>

          <div className="landing-nav-actions">
            {user ? (
              <div className="nav-user-pill">
                <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
                <span className="user-name-text">{user.name}</span>
                <button onClick={onEnterApp} className="nav-app-btn">
                  Open Workspace <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={onOpenAuth} className="nav-signin-btn">
                  Sign In
                </button>
                <ShimmerButton onClick={onEnterApp} className="nav-cta-btn">
                  Launch App Free
                </ShimmerButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge-wrap">
            <Badge variant="purple" dot={true}>
              ⚡ Groq LPU Accelerated • Sub-second Response Times
            </Badge>
          </div>

          <h1 className="hero-title">
            Decode Datasheets at the <br />
            <span className="hero-gradient-text">Speed of Thought</span>
          </h1>

          <p className="hero-subhead">
            Never risk hardware damage again. Upload complex component datasheets to
            instantly extract pinouts, verify operating conditions, and validate circuit designs
            with strict <strong>Absolute Maximum Rating</strong> safety guardrails.
          </p>

          <div className="hero-cta-group">
            <ShimmerButton onClick={onEnterApp} className="hero-primary-cta">
              <span className="flex-center gap-2">
                <span>Launch Interactive Workspace</span>
                <ArrowRight size={18} />
              </span>
            </ShimmerButton>

            <a href="#simulator" className="hero-secondary-cta">
              <Sliders size={16} />
              <span>Try Interactive Sandbox</span>
            </a>
          </div>

          <div className="hero-social-proof">
            <div className="proof-avatars">
              <span className="avatar-chip">EE</span>
              <span className="avatar-chip">PCB</span>
              <span className="avatar-chip">HW</span>
            </div>
            <span className="proof-text">
              Trusted by hardware engineers, makers, and embedded developers worldwide
            </span>
          </div>
        </div>

        {/* ── Interactive Hero Simulator ────────────── */}
        <div id="simulator" className="hero-simulator-wrap">
          <SpotlightCard className="hero-simulator-card" spotlightColor="rgba(0, 212, 255, 0.2)">
            <BorderBeam size={240} duration={7} />

            <div className="sim-header">
              <div className="sim-chip-tabs">
                {Object.entries(chipsData).map(([key, c]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedChip(key);
                      setTestVoltage(c.vccMin + 2);
                    }}
                    className={`sim-tab-btn ${selectedChip === key ? "active" : ""}`}
                  >
                    <Cpu size={14} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>

              <div className="sim-status-chip">
                {isViolated ? (
                  <span className="sim-badge danger animate-pulse">
                    <ShieldAlert size={14} /> ⚠️ ABSOLUTE MAX VIOLATED
                  </span>
                ) : isOutOfRecommended ? (
                  <span className="sim-badge warning">
                    <Sliders size={14} /> Out of Recommended Range
                  </span>
                ) : (
                  <span className="sim-badge safe">
                    <ShieldCheck size={14} /> Nominal Safe Operating
                  </span>
                )}
              </div>
            </div>

            <div className="sim-body">
              {/* Left Column: Interactive Voltage Stress Slider */}
              <div className="sim-controls">
                <div className="sim-voltage-box">
                  <div className="voltage-meta">
                    <span className="voltage-label">Simulate Applied VCC Input:</span>
                    <span className={`voltage-value ${isViolated ? "text-danger" : "text-cyan"}`}>
                      {testVoltage.toFixed(1)} V
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="0.5"
                    value={testVoltage}
                    onChange={(e) => setTestVoltage(parseFloat(e.target.value))}
                    className="sim-slider"
                  />

                  <div className="voltage-scale">
                    <span>0V</span>
                    <span>Rec: {currentChip.vccMin}V–{currentChip.vccMax}V</span>
                    <span className="text-danger">Abs Max: {currentChip.vccAbsMax}V</span>
                    <span>32V</span>
                  </div>
                </div>

                <div className={`sim-alert-box ${isViolated ? "alert-danger" : isOutOfRecommended ? "alert-warning" : "alert-safe"}`}>
                  <div className="alert-header">
                    {isViolated ? (
                      <>
                        <ShieldAlert size={18} className="text-danger" />
                        <strong>CRITICAL HARDWARE VIOLATION</strong>
                      </>
                    ) : isOutOfRecommended ? (
                      <>
                        <Sliders size={18} className="text-amber" />
                        <strong>NON-OPTIMAL OPERATING VOLTAGE</strong>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} className="text-emerald" />
                        <strong>CIRCUIT VALIDATION PASSED</strong>
                      </>
                    )}
                  </div>
                  <p className="alert-desc">
                    {isViolated
                      ? `Applying ${testVoltage}V violates the ${currentChip.vccAbsMax}V Absolute Maximum limit. This induces gate-oxide breakdown and permanent silicon destruction!`
                      : isOutOfRecommended
                      ? `Recommended VCC is ${currentChip.vccMin}V to ${currentChip.vccMax}V. At ${testVoltage}V, internal reference generators may fall out of regulation.`
                      : `Applied ${testVoltage}V is within optimal specs. Internal regulator, charge pumps, and logic gates function with full stability.`}
                  </p>
                </div>
              </div>

              {/* Right Column: Pinout Extracted Matrix */}
              <div className="sim-pins-preview">
                <div className="pins-preview-header">
                  <Terminal size={14} className="text-cyan" />
                  <span>Auto-Extracted Pinout Table (8 Pins)</span>
                </div>
                <div className="pins-grid-scroll">
                  {currentChip.pins.map((p) => (
                    <div key={p.pin} className="pin-item-row">
                      <span className="pin-num">Pin {p.pin}</span>
                      <span className="pin-name">{p.name}</span>
                      <span className="pin-desc">{p.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sim-footer">
              <span className="sim-footer-hint">
                <Sparkles size={14} className="text-cyan" />
                DatasheetIQ automatically runs this check on every user query and circuit proposal.
              </span>
              <button onClick={onEnterApp} className="sim-open-btn">
                Ask Questions About This IC <ArrowRight size={14} />
              </button>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ── Bento Grid Section (Aceternity Style) ─── */}
      <section id="bento" className="landing-bento-section">
        <div className="section-head">
          <Badge variant="cyan" dot={false}>THE ARCHITECTURE</Badge>
          <h2 className="section-title">Engineered for Hardware Safety & Speed</h2>
          <p className="section-sub">
            Built from first principles to solve OCR errors, table misalignment, and LLM hallucinations in electronics engineering.
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento Card 1: Absolute Max Ratings */}
          <SpotlightCard className="bento-card bento-col-2">
            <div className="bento-icon-badge bg-danger-soft">
              <ShieldAlert size={24} className="text-danger" />
            </div>
            <h3 className="bento-heading">Absolute Maximum Ratings Guardian</h3>
            <p className="bento-text">
              Generic chatbots happily suggest connecting 12V to 3.3V pins. DatasheetIQ acts as a hardware safety arbiter, strictly checking input voltages, junction temperatures, and pin sink/source currents against rated thresholds.
            </p>
            <div className="bento-metric-row">
              <div className="metric-pill">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Safety Priority</span>
              </div>
              <div className="metric-pill">
                <span className="metric-val">0V–1000V</span>
                <span className="metric-lbl">Range Checking</span>
              </div>
              <div className="metric-pill">
                <span className="metric-val">Instant</span>
                <span className="metric-lbl">Smoke Prevention</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Bento Card 2: Groq LPU Speed */}
          <SpotlightCard className="bento-card">
            <div className="bento-icon-badge bg-cyan-soft">
              <Zap size={24} className="text-cyan" />
            </div>
            <h3 className="bento-heading">Groq LPU Inference</h3>
            <p className="bento-text">
              Powered by Groq's Language Processing Units. Enjoy stream rates exceeding 500 tokens per second for immediate answers right on the workbench.
            </p>
            <div className="bento-code-snippet">
              <code>⚡ Stream latency &lt; 280ms</code>
            </div>
          </SpotlightCard>

          {/* Bento Card 3: Table & Pinout Extractor */}
          <SpotlightCard className="bento-card">
            <div className="bento-icon-badge bg-purple-soft">
              <Layers size={24} className="text-purple" />
            </div>
            <h3 className="bento-heading">Heuristic Table Parsing</h3>
            <p className="bento-text">
              Extracts Electrical Characteristics, Pin Functions, and Recommended Operating Conditions directly into structured JSON cards.
            </p>
            <div className="bento-tag-list">
              <span className="tag-pill">Pinouts</span>
              <span className="tag-pill">DC Specs</span>
              <span className="tag-pill">Timing</span>
            </div>
          </SpotlightCard>

          {/* Bento Card 4: Actionable Hardware Checklist */}
          <SpotlightCard className="bento-card bento-col-2">
            <div className="bento-icon-badge bg-emerald-soft">
              <CheckCircle2 size={24} className="text-emerald" />
            </div>
            <h3 className="bento-heading">Hardware Design Checklist & Next Steps</h3>
            <p className="bento-text">
              Every response concludes with exactly two actionable next steps: recommending decoupling capacitors, pull-up resistor calculations, level-shifter needs, and thermal layout considerations.
            </p>
            <div className="bento-checklist-sample">
              <div className="check-item">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Calculate I2C pull-up resistor (4.7kΩ standard for 5V buses)</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Place 0.1µF ceramic decoupling capacitor within 3mm of VCC pin</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ── Comparison Section ──────────────────────── */}
      <section id="comparison" className="landing-comparison-section">
        <div className="section-head">
          <Badge variant="emerald" dot={false}>HEAD-TO-HEAD</Badge>
          <h2 className="section-title">Why Generic AI Fails at Hardware</h2>
          <p className="section-sub">
            General purpose LLMs hallucinate pin numbers, ignore maximum ratings, and don't understand circuit physics.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional PDF Reader</th>
                <th>Standard Chatbots</th>
                <th className="highlight-col">DatasheetIQ AI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Absolute Maximum Rating Alerts</td>
                <td className="text-muted">Manual Search</td>
                <td className="text-danger">❌ Often Ignores</td>
                <td className="highlight-col text-emerald">✅ Enforced & Highlighted</td>
              </tr>
              <tr>
                <td>Table & Pin Extraction</td>
                <td className="text-muted">Manual Copy/Paste</td>
                <td className="text-danger">❌ Tables get misaligned</td>
                <td className="highlight-col text-emerald">✅ Auto-Parsed Parameters</td>
              </tr>
              <tr>
                <td>Missing Sub-system Catching</td>
                <td className="text-muted">None</td>
                <td className="text-danger">❌ Rarely suggests decoupling</td>
                <td className="highlight-col text-emerald">✅ Flags missing pull-ups/caps</td>
              </tr>
              <tr>
                <td>Inference Speed</td>
                <td className="text-muted">N/A</td>
                <td className="text-amber">10–30s wait time</td>
                <td className="highlight-col text-cyan">⚡ &lt; 1s on Groq LPU</td>
              </tr>
              <tr>
                <td>OCR Error Rectification</td>
                <td className="text-muted">N/A</td>
                <td className="text-danger">❌ Hallucinates garbage</td>
                <td className="highlight-col text-emerald">✅ Heuristic Correction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Quick Component Launch ─────────────────── */}
      <section id="specs" className="landing-samples-section">
        <div className="section-head">
          <Badge variant="cyan" dot={false}>INSTANT SANDBOX</Badge>
          <h2 className="section-title">Start with Popular Components</h2>
          <p className="section-sub">
            Click any component below to launch straight into DatasheetIQ with the pre-parsed dataset.
          </p>
        </div>

        <div className="samples-grid">
          <div className="sample-card" onClick={onEnterApp}>
            <div className="sample-card-head">
              <span className="sample-type">PFC Controller</span>
              <span className="sample-part">ICE2PCS01</span>
            </div>
            <p className="sample-desc">Infineon Continuous Conduction Mode PFC IC with 26V max VCC.</p>
            <div className="sample-card-foot">
              <span>Launch Analysis</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="sample-card" onClick={onEnterApp}>
            <div className="sample-card-head">
              <span className="sample-type">AI / IoT MCU</span>
              <span className="sample-part">ESP32-S3</span>
            </div>
            <p className="sample-desc">Dual-core Xtensa 32-bit LX7 with vector instructions for edge ML.</p>
            <div className="sample-card-foot">
              <span>Launch Analysis</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="sample-card" onClick={onEnterApp}>
            <div className="sample-card-head">
              <span className="sample-type">8-Bit AVR MCU</span>
              <span className="sample-part">ATmega328P</span>
            </div>
            <p className="sample-desc">Microchip 8-bit AVR microcontroller with 32KB flash and 23 I/O lines.</p>
            <div className="sample-card-foot">
              <span>Launch Analysis</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="sample-card" onClick={onEnterApp}>
            <div className="sample-card-head">
              <span className="sample-type">Digital Accelerometer</span>
              <span className="sample-part">ADXL345</span>
            </div>
            <p className="sample-desc">Analog Devices ultra-low power, 3-axis accelerometer with SPI/I2C.</p>
            <div className="sample-card-foot">
              <span>Launch Analysis</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* ── High-Impact CTA Banner ─────────────────── */}
      <section className="landing-cta-banner">
        <SpotlightCard className="cta-banner-card" spotlightColor="rgba(0, 212, 255, 0.25)">
          <BorderBeam size={300} duration={6} colorFrom="#00d4ff" colorTo="#3b82f6" />
          <h2 className="cta-banner-title">Ready to Design Safe Hardware?</h2>
          <p className="cta-banner-text">
            Upload your first datasheet in PDF or text form and start chatting with your AI Hardware Assistant in seconds.
          </p>
          <div className="cta-banner-buttons">
            <ShimmerButton onClick={onEnterApp} className="banner-primary-btn">
              <span>Launch DatasheetIQ Workspace</span>
              <ArrowRight size={18} />
            </ShimmerButton>
            {!user && (
              <button onClick={onOpenAuth} className="banner-signin-btn">
                Sign In with Account
              </button>
            )}
          </div>
        </SpotlightCard>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-left">
            <div className="footer-logo">
              <Cpu size={18} className="text-cyan" />
              <span>DatasheetIQ</span>
            </div>
            <p className="footer-copy">
              Expert hardware architecture intelligence powered by Groq LPUs.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#simulator">Simulator</a>
              <a href="#bento">Safety Guard</a>
              <a href="#comparison">Comparison</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="https://console.groq.com" target="_blank" rel="noreferrer">
                Groq Console <ExternalLink size={12} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub Repository <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} DatasheetIQ. Designed for Makers & Electrical Engineers.</span>
          <span>Zero Hallucinations • Absolute Max Ratings Enforced</span>
        </div>
      </footer>
    </div>
  );
}
