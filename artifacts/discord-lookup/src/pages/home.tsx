import { useState } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { DiscordLookup } from "@/components/DiscordLookup";
import { SocialLinks } from "@/components/SocialLinks";

type Tab = "discord" | "contacto";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("discord");

  return (
    <main className="min-h-[100dvh] relative overflow-hidden text-foreground selection:bg-primary/30">
      <SpaceBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-[-1]" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-1 p-4 backdrop-blur-md border-b border-white/5 bg-background/40">
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

      <div className="container mx-auto px-4 pt-32 pb-24 flex flex-col items-center justify-center min-h-[100dvh] gap-12">

        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full border border-primary/20 mb-4 text-primary backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider pr-2">Sistema en línea</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter glow-hover">
            ZERO <span className="text-primary">GOOD</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-md mx-auto">
            Interfaz terminal // Protocolo de identificación
          </p>
        </header>

        <div className="w-full relative z-10">
          {activeTab === "discord" ? <DiscordLookup /> : <SocialLinks />}
        </div>

      </div>
    </main>
  );
}
