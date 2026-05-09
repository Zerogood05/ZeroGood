import { SpaceBackground } from "@/components/SpaceBackground";
import { DiscordLookup } from "@/components/DiscordLookup";
import { SocialLinks } from "@/components/SocialLinks";

export default function Home() {
  return (
    <main className="min-h-[100dvh] relative overflow-hidden text-foreground selection:bg-primary/30">
      <SpaceBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-[-1]" />
      
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[100dvh] gap-20">
        
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full border border-primary/20 mb-4 text-primary backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-xs font-mono font-medium uppercase tracking-wider pr-2">System Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter glow-hover">
            NEXUS <span className="text-primary">CORE</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-md mx-auto">
            Terminal interface // User identification protocol
          </p>
        </header>

        <div className="w-full relative z-10">
          <DiscordLookup />
        </div>

        <div className="w-full relative z-10">
          <SocialLinks />
        </div>

      </div>
    </main>
  );
}