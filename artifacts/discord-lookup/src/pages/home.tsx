import { useState, useEffect, useRef } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { DiscordLookup } from "@/components/DiscordLookup";
import { SocialLinks } from "@/components/SocialLinks";
import { MusicPlayer } from "@/components/MusicPlayer";

type Tab = "discord" | "contacto";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const STRENGTH = 12;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetRef.current = {
        x: ((e.clientX - cx) / cx) * -STRENGTH,
        y: ((e.clientY - cy) / cy) * -STRENGTH,
      };
    };
    window.addEventListener("mousemove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x = lerp(cur.x, tgt.x, 0.05);
      cur.y = lerp(cur.y, tgt.y, 0.05);
      setParallax({ x: Math.round(cur.x * 100) / 100, y: Math.round(cur.y * 100) / 100 });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="min-h-[100dvh] relative overflow-hidden text-foreground selection:bg-primary/30">
      <SpaceBackground parallaxX={parallax.x} parallaxY={parallax.y} />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-[-1]" />

      {/* Nav — always visible */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-1 p-4 backdrop-blur-md border-b border-white/5 bg-background/40">
        {activeTab !== null && (
          <button
            onClick={() => setActiveTab(null)}
            title="Inicio"
            className="absolute left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"/>
            </svg>
            <span className="hidden sm:inline">Inicio</span>
          </button>
        )}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            data-testid="tab-discord"
            onClick={() => setActiveTab("discord")}
            className={`relative px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
              activeTab === "discord"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Discord ID Lookup
          </button>
          <button
            data-testid="tab-contacto"
            onClick={() => setActiveTab("contacto")}
            className={`relative px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
              activeTab === "contacto"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Contacto
          </button>
        </div>
      </nav>

      {/* Landing */}
      {activeTab === null && (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-6 px-4 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full border border-primary/20 text-primary backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider pr-2">Sistema en línea</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter glow-hover">
            ZERO <span className="text-primary">GOOD</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-md">
            Interfaz terminal // Protocolo de identificación
          </p>
        </div>
      )}

      {/* Tab content */}
      {activeTab !== null && (
        <div className="container mx-auto px-4 pt-32 pb-24 flex flex-col items-center justify-center min-h-[100dvh]">
          <div className="w-full relative z-10">
            {activeTab === "discord" ? <DiscordLookup /> : <SocialLinks />}
          </div>
        </div>
      )}

      {/* Music player — always visible */}
      <MusicPlayer />
    </main>
  );
}
