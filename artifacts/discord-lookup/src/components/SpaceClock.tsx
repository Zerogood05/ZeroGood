import { useState, useEffect } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeParts() {
  const now = new Date();
  return {
    h: pad(now.getHours()),
    m: pad(now.getMinutes()),
    s: pad(now.getSeconds()),
  };
}

export function SpaceClock() {
  const [parts, setParts] = useState(getTimeParts);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed top-5 right-5 z-50 select-none group"
    >
      <div
        className="relative overflow-hidden rounded-xl px-3.5 py-2.5 transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(168,85,247,0.18)",
          borderRight: "2px solid rgba(168,85,247,0.5)",
          boxShadow: hovered
            ? "0 0 24px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.04)"
            : "0 0 12px rgba(168,85,247,0.08)",
        }}
      >
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "rgba(168,85,247,0.15)",
            animation: "clockScan 3.5s linear infinite",
          }}
        />

        {/* Top label */}
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(168,85,247,0.9)",
              boxShadow: "0 0 5px rgba(168,85,247,0.8)",
              animation: "clockBlink 2.4s ease-in-out infinite",
            }}
          />
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase transition-colors duration-300"
            style={{ color: "rgba(168,85,247,0.6)" }}
          >
            {hovered ? "SYNCHRONIZED" : "MISSION CONTROL"}
          </span>
        </div>

        {/* Time display */}
        <div className="flex items-baseline gap-1.5 font-mono">
          <span
            className="text-[10px] tracking-widest transition-colors duration-300"
            style={{ color: hovered ? "rgba(168,85,247,0.9)" : "rgba(168,85,247,0.5)" }}
          >
            {hovered ? "SYNC:" : "ST:"}
          </span>

          <div className="flex items-baseline gap-0.5">
            <span
              className="text-xl font-bold tabular-nums transition-all duration-300"
              style={{
                color: hovered ? "#ffffff" : "rgba(230,220,255,0.92)",
                textShadow: hovered
                  ? "0 0 14px rgba(168,85,247,0.9), 0 0 28px rgba(168,85,247,0.4)"
                  : "0 0 8px rgba(168,85,247,0.35)",
                letterSpacing: "0.06em",
              }}
            >
              {parts.h}
            </span>
            <span
              className="text-xl font-bold"
              style={{
                color: "rgba(168,85,247,0.5)",
                animation: "colonBlink 1s step-end infinite",
              }}
            >
              :
            </span>
            <span
              className="text-xl font-bold tabular-nums transition-all duration-300"
              style={{
                color: hovered ? "#ffffff" : "rgba(230,220,255,0.92)",
                textShadow: hovered
                  ? "0 0 14px rgba(168,85,247,0.9), 0 0 28px rgba(168,85,247,0.4)"
                  : "0 0 8px rgba(168,85,247,0.35)",
                letterSpacing: "0.06em",
              }}
            >
              {parts.m}
            </span>
            <span
              className="text-xl font-bold"
              style={{
                color: "rgba(168,85,247,0.5)",
                animation: "colonBlink 1s step-end infinite",
              }}
            >
              :
            </span>
            <span
              className="text-base font-semibold tabular-nums transition-all duration-300"
              style={{
                color: hovered ? "rgba(200,180,255,0.9)" : "rgba(180,160,240,0.6)",
                textShadow: hovered ? "0 0 10px rgba(168,85,247,0.7)" : "none",
                letterSpacing: "0.06em",
                alignSelf: "baseline",
              }}
            >
              {parts.s}
            </span>
          </div>
        </div>

        <style>{`
          @keyframes clockBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.15; }
          }
          @keyframes colonBlink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0.2; }
          }
          @keyframes clockScan {
            0%   { top: 0%; }
            50%  { top: 100%; }
            100% { top: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
