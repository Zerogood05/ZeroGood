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
        Transmissions
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 group ${link.color}`}
          >
            <link.icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="font-medium tracking-wide">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}