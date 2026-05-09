import { SiDiscord, SiGithub, SiX, SiInstagram, SiYoutube, SiTwitch } from "react-icons/si";

export function SocialLinks() {
  const links = [
    { name: "Discord", icon: SiDiscord, href: "#", color: "hover:text-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:border-[#5865F2]/50" },
    { name: "GitHub", icon: SiGithub, href: "#", color: "hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/50" },
    { name: "X", icon: SiX, href: "#", color: "hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/50" },
    { name: "Instagram", icon: SiInstagram, href: "#", color: "hover:text-[#E1306C] hover:shadow-[0_0_20px_rgba(225,48,108,0.4)] hover:border-[#E1306C]/50" },
    { name: "YouTube", icon: SiYoutube, href: "#", color: "hover:text-[#FF0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:border-[#FF0000]/50" },
    { name: "Twitch", icon: SiTwitch, href: "#", color: "hover:text-[#9146FF] hover:shadow-[0_0_20px_rgba(145,70,255,0.4)] hover:border-[#9146FF]/50" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <h2 className="text-xl font-display font-medium text-center text-muted-foreground glow-hover">
        Redes sociales
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            data-testid={`link-social-${link.name.toLowerCase()}`}
            className={`flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 group ${link.color}`}
          >
            <link.icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium tracking-wide">{link.name}</span>
          </a>
        ))}
      </div>

      <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <h3 className="text-lg font-display font-bold text-foreground glow-hover tracking-tight">
          Gatitos World 2
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm text-muted-foreground font-mono">Cargo:</span>
          <button
            data-testid="badge-supervisor"
            className="group relative px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold tracking-wide text-foreground transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:border-green-400/40 hover:shadow-[0_0_24px_rgba(74,222,128,0.35)]"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-green-300">
              Supervisor
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-600/20 via-emerald-400/20 to-green-500/20" />
          </button>
          <button
            data-testid="badge-dev"
            className="group relative px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-sm font-semibold tracking-wide text-foreground transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:border-red-400/40 hover:shadow-[0_0_24px_rgba(248,113,113,0.35)]"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-red-300">
              Dev
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-600/20 via-rose-400/20 to-red-500/20" />
          </button>
        </div>
      </div>
    </div>
  );
}
