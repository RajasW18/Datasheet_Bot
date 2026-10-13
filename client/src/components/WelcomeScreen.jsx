import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, ArrowRight, ClipboardPaste, Sparkles, Cpu, Zap, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "./ui/SpotlightCard";
import { BorderBeam } from "./ui/BorderBeam";
import { ShimmerButton } from "./ui/ShimmerButton";
import { Badge } from "./ui/Badge";

/**
 * WelcomeScreen — Enhanced with Aceternity & MagicUI style spotlight and beam aesthetics.
 */
export function WelcomeScreen({ onFileUpload, onTextUpload, isUploading, progress }) {
  const [pastedText, setPastedText] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [activeTab, setActiveTab] = useState("file"); // "file" | "text"

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleTextSubmit = () => {
    if (pastedText.trim()) {
      onTextUpload(pastedText, textTitle || "Pasted Datasheet");
    }
  };

  const handleSampleSelect = (chip) => {
    const samples = {
      ESP32: {
        title: "ESP32 Series Datasheet Excerpt",
        text: `Espressif ESP32 2.4GHz Wi-Fi and Bluetooth SoC.
Absolute Maximum Ratings:
VDD33 Supply Voltage: -0.3V to 3.6V
Input Voltage to GPIO: -0.3V to (VDD + 0.3V)
DC Current per I/O Pin: 40 mA
Operating Temperature: -40°C to +125°C
Recommended Operating Conditions:
Supply Voltage VDD: 3.0V to 3.6V (Typ 3.3V)
Operating Current: 80mA typ, up to 500mA RF peak
Pinout: Pin 1: 3V3, Pin 2: EN, Pin 3: SENSOR_VP, Pin 4: SENSOR_VN, Pin 5: IO34, Pin 6: IO35, Pin 7: IO32, Pin 8: IO33.`,
      },
      ICE2PCS01: {
        title: "Infineon ICE2PCS01 PFC Controller",
        text: `Infineon ICE2PCS01 Standalone Power Factor Correction Controller.
Absolute Maximum Ratings:
VCC Supply Voltage: -0.3V to 26V
GATE Driver Output: -0.3V to 26V
ICOMP / ISENSE / OVP: -0.3V to 6.5V
Operating Range:
VCC Turn-on Threshold: 11.8V typ
VCC Operating Range: 11V to 25V
Operating Frequency: 50 kHz to 250 kHz
Pin 1: GND, Pin 2: ICOMP, Pin 3: ISENSE, Pin 4: OVP, Pin 5: RD, Pin 6: VINS, Pin 7: VCC, Pin 8: GATE.`,
      },
      ATmega328P: {
        title: "Microchip ATmega328P 8-Bit MCU",
        text: `Microchip ATmega328P 8-bit AVR Microcontroller with 32K Flash.
Absolute Maximum Ratings:
Operating Voltage (VCC): -0.5V to 6.0V
Voltage on any Pin except RESET: -0.5V to VCC + 0.5V
DC Current per I/O Pin: 40.0 mA
DC Current VCC and GND Pins: 200.0 mA
Operating Range:
1.8V - 5.5V for ATmega328P (0-4MHz @ 1.8-5.5V, 0-20MHz @ 4.5-5.5V)
Internal 8MHz RC oscillator or external crystal.
Pin 1: PC6 (/RESET), Pin 2: PD0 (RXD), Pin 3: PD1 (TXD), Pin 7: VCC, Pin 8: GND, Pin 9: XTAL1, Pin 10: XTAL2.`,
      },
    };

    if (samples[chip]) {
      onTextUpload(samples[chip].text, samples[chip].title);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-badge-row">
          <Badge variant="cyan" dot={true}>
            Hardware Architecture Assistant
          </Badge>
        </div>

        <h2 className="welcome-title">Analyze Any Hardware Datasheet</h2>
        <p className="welcome-subtitle">
          Upload component PDFs or paste pinout specs to get instant electrical validation,
          extract tables, and flag dangerous absolute maximum rating violations.
        </p>

        {/* Mode switcher tabs */}
        <div className="welcome-tab-bar">
          <button
            type="button"
            className={`welcome-tab-btn ${activeTab === "file" ? "active" : ""}`}
            onClick={() => setActiveTab("file")}
          >
            <Upload size={14} />
            <span>Upload PDF File</span>
          </button>
          <button
            type="button"
            className={`welcome-tab-btn ${activeTab === "text" ? "active" : ""}`}
            onClick={() => setActiveTab("text")}
          >
            <ClipboardPaste size={14} />
            <span>Paste Raw Text / Spec</span>
          </button>
        </div>

        {activeTab === "file" ? (
          /* Drop Zone inside SpotlightCard */
          <SpotlightCard
            className="welcome-spotlight-box"
            spotlightColor="rgba(0, 212, 255, 0.12)"
          >
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
            >
              <BorderBeam size={180} duration={8} colorFrom="#00d4ff" colorTo="#3b82f6" />
              <input {...getInputProps()} />
              <div className="dropzone-icon">
                <Upload size={28} className="text-cyan animate-pulse" />
              </div>
              <p className="dropzone-text">
                {isDragActive ? (
                  "Release to analyze datasheet..."
                ) : (
                  <>
                    Drag & drop a component PDF, or <strong>click to browse</strong>
                  </>
                )}
              </p>
              <p className="dropzone-hint">
                Supports PDF and TXT files up to 50MB • Vector & scanned OCR fallback
              </p>

              {isUploading && progress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {progress < 100 ? "Decoding datasheet tables & parameters..." : "Parsing complete!"}
                  </span>
                </div>
              )}
            </div>
          </SpotlightCard>
        ) : (
          /* Text Paste inside SpotlightCard */
          <SpotlightCard
            className="welcome-spotlight-box"
            spotlightColor="rgba(139, 92, 246, 0.12)"
          >
            <div className="text-paste-area">
              <input
                type="text"
                placeholder="Component part number or title (e.g. Infineon ICE2PCS01)"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="text-paste-title-input"
              />
              <textarea
                className="text-paste-textarea"
                placeholder="Paste datasheet text here — pin descriptions, electrical characteristics, absolute maximum ratings, operating ranges..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
              <div className="text-paste-actions">
                <ShimmerButton
                  onClick={handleTextSubmit}
                  disabled={!pastedText.trim() || isUploading}
                  className="analyze-btn"
                >
                  <span className="flex-center gap-2">
                    <ClipboardPaste size={16} />
                    <span>Analyze Pasted Specs</span>
                    <ArrowRight size={16} />
                  </span>
                </ShimmerButton>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* Quick Start Preset Chips */}
        <div className="quick-start-wrapper">
          <span className="quick-start-label">
            <Sparkles size={13} className="text-cyan" />
            Or test with sample datasheets:
          </span>
          <div className="quick-chips-row">
            {["ICE2PCS01", "ESP32", "ATmega328P"].map((chip) => (
              <button
                key={chip}
                type="button"
                className="quick-chip-btn"
                onClick={() => handleSampleSelect(chip)}
              >
                <Cpu size={12} className="text-cyan" />
                <span>{chip}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Engineering features strip */}
        <div className="features-strip">
          <div className="feature-item">
            <ShieldCheck size={15} className="text-emerald" />
            <span>Absolute Max Rating Guardian</span>
          </div>
          <div className="feature-item">
            <Zap size={15} className="text-cyan" />
            <span>Sub-second Groq LPU Inference</span>
          </div>
          <div className="feature-item">
            <FileText size={15} className="text-purple" />
            <span>Automatic Pinout & Table Extractor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
