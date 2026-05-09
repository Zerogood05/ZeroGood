export interface DiscordBadge {
  name: string;
  icon: string;
  color: string;
}

const CDN = "https://cdn.discordapp.com/badge-icons";

const FLAG_MAP: { bit: number; name: string; icon: string; color: string }[] = [
  { bit: 1 << 0,  name: "Discord Staff",         icon: `${CDN}/5e74e9b61934fc1f67c65515d1f7e60d.png`, color: "#5865F2" },
  { bit: 1 << 1,  name: "Partner",               icon: `${CDN}/3f9748e53446a127d697b4f7df1f7e28.png`, color: "#5865F2" },
  { bit: 1 << 2,  name: "HypeSquad Events",      icon: `${CDN}/bf01d1073931f921909045f3a39fd264.png`, color: "#f47b67" },
  { bit: 1 << 3,  name: "Bug Hunter",            icon: `${CDN}/2717692c7dca7289b35297368a940dd0.png`, color: "#f1c40f" },
  { bit: 1 << 6,  name: "HypeSquad Bravery",     icon: `${CDN}/8a88d63823d8a71cd5e390baa45aca9e.png`, color: "#9b59b6" },
  { bit: 1 << 7,  name: "HypeSquad Brilliance",  icon: `${CDN}/011940fd013082d85d96680afe7979d5.png`, color: "#e74c3c" },
  { bit: 1 << 8,  name: "HypeSquad Balance",     icon: `${CDN}/3aa19bfe999d3e5c37e72f6b069a7183.png`, color: "#2ecc71" },
  { bit: 1 << 9,  name: "Early Supporter",       icon: `${CDN}/7060786766c9c840eb3019e725d2b358.png`, color: "#f39c12" },
  { bit: 1 << 14, name: "Bug Hunter Lvl 2",      icon: `${CDN}/848f79194d4be5ff5f81505cbd0ce1e6.png`, color: "#e67e22" },
  { bit: 1 << 16, name: "Verified Bot",          icon: `${CDN}/6f9e7bf7a09ef0af736df0f9a6b1d2a9.png`, color: "#5865F2" },
  { bit: 1 << 17, name: "Early Bot Developer",   icon: `${CDN}/6df5892e0f35b051d8b61d8224723cac.png`, color: "#3498db" },
  { bit: 1 << 18, name: "Certified Moderator",   icon: `${CDN}/fee1624003e17566a30645d7d3faed13.png`, color: "#1abc9c" },
  { bit: 1 << 22, name: "Active Developer",      icon: `${CDN}/6bdc42827a38498929a4920da12695d9.png`, color: "#57F287" },
];

export function decodePublicFlags(flags: number): DiscordBadge[] {
  return FLAG_MAP.filter(f => (flags & f.bit) === f.bit).map(f => ({
    name: f.name,
    icon: f.icon,
    color: f.color,
  }));
}
