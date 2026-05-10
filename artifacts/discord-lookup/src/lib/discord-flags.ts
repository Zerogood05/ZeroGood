export interface DiscordBadge {
  name: string;
  icon: string;
}

const FLAG_MAP: { bit: number; name: string; icon: string }[] = [
  { bit: 1 << 0,  name: "Discord Staff",        icon: "/badges/discord-staff.svg" },
  { bit: 1 << 1,  name: "Partner",              icon: "/badges/partner.svg" },
  { bit: 1 << 2,  name: "HypeSquad Events",     icon: "/badges/hypesquad-events-real.png" },
  { bit: 1 << 3,  name: "Bug Hunter",           icon: "/badges/bug-hunter.svg" },
  { bit: 1 << 6,  name: "HypeSquad Bravery",    icon: "/badges/hypesquad-bravery.png" },
  { bit: 1 << 7,  name: "HypeSquad Brilliance", icon: "/badges/hypesquad-brilliance.png" },
  { bit: 1 << 8,  name: "HypeSquad Balance",    icon: "/badges/hypesquad-balance.png" },
  { bit: 1 << 9,  name: "Early Supporter",      icon: "/badges/early-supporter.svg" },
  { bit: 1 << 14, name: "Bug Hunter Lvl 2",     icon: "/badges/bug-hunter-2.svg" },
  { bit: 1 << 16, name: "Verified Bot",         icon: "/badges/verified-bot.svg" },
  { bit: 1 << 17, name: "Early Bot Developer",  icon: "/badges/early-bot-dev.svg" },
  { bit: 1 << 18, name: "Certified Moderator",  icon: "/badges/certified-moderator.svg" },
  { bit: 1 << 22, name: "Active Developer",     icon: "/badges/active-developer.svg" },
];

export function decodePublicFlags(flags: number): DiscordBadge[] {
  return FLAG_MAP.filter(f => (flags & f.bit) === f.bit).map(f => ({
    name: f.name,
    icon: f.icon,
  }));
}
