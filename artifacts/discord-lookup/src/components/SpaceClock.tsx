import { useState, useEffect } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeString() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function SpaceClock() {
  const [time, setTime] = useState(getTimeString);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  const prefix = hovered ? "SYNCHRONIZED" : "ST:";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 60,
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "6px",
          borderRight: "3px solid #00ff88",
          borderTop: "1px solid rgba(0,255,136,0.18)",
          borderBottom: "1px solid rgba(0,255,136,0.08)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          padding: "8px 14px 8px 12px",
          boxShadow: hovered
            ? "0 0 24px rgba(0,255,136,0.22), inset 0 0 16px rgba(0,255,136,0.04)"
            : "0 0 12px rgba(0,255,136,0.10), inset 0 0 8px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Scan line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(0,255,136,0.12)",
            animation: "scanLine 3s linear infinite",
            pointerEvents: "none",
          }}
        />

        {/* Top label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "3px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#00ff88",
              flexShrink: 0,
              animation: "blink 2.2s ease-in-out infinite",
              boxShadow: "0 0 6px #00ff88",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(0,255,136,0.6)",
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
          >
            {hovered ? "SYNCHRONIZED" : "MISSION CONTROL"}
          </span>
        </div>

        {/* Time row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              color: hovered ? "#00ff88" : "rgba(0,255,136,0.55)",
              letterSpacing: "0.1em",
              transition: "color 0.3s",
            }}
          >
            {prefix}
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: hovered ? "#ffffff" : "rgba(220,255,240,0.92)",
              textShadow: hovered
                ? "0 0 12px rgba(0,255,136,0.9), 0 0 24px rgba(0,255,136,0.4)"
                : "0 0 6px rgba(0,255,136,0.4)",
              transition: "color 0.3s, text-shadow 0.3s",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {time}
          </span>
        </div>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          @keyframes scanLine {
            0%   { top: 0%; }
            50%  { top: 100%; }
            100% { top: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
