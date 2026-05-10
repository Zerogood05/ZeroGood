export interface DiscordBadge {
  name: string;
  icon: string;
}

const FLAG_MAP: { bit: number; name: string; icon: string }[] = [
  { bit: 1 << 0,  name: "Discord Staff",          icon: "/badges/discord-staff.png" },
  { bit: 1 << 1,  name: "Partner",                icon: "/badges/partner.svg" },
  { bit: 1 << 2,  name: "HypeSquad Events",       icon: "/badges/hypesquad-events.png" },
  { bit: 1 << 3,  name: "Bug Hunter",             icon: "/badges/bug-hunter.png" },
  { bit: 1 << 6,  name: "HypeSquad Bravery",      icon: "/badges/hypesquad-bravery.png" },
  { bit: 1 << 7,  name: "HypeSquad Brilliance",   icon: "/badges/hypesquad-brilliance.png" },
  { bit: 1 << 8,  name: "HypeSquad Balance",      icon: "/badges/hypesquad-balance.png" },
  { bit: 1 << 9,  name: "Early Supporter",        icon: "/badges/early-supporter.png" },
  { bit: 1 << 14, name: "Bug Hunter Nivel 2",     icon: "/badges/bug-hunter-2.png" },
  { bit: 1 << 16, name: "Bot Verificado",         icon: "/badges/verified-bot.svg" },
  { bit: 1 << 17, name: "Desarrollador Bot",      icon: "/badges/early-bot-dev.svg" },
  { bit: 1 << 18, name: "Moderador Certificado",  icon: "/badges/certified-moderator.svg" },
  { bit: 1 << 22, name: "Desarrollador Activo",   icon: "/badges/active-developer.png" },
];

export function decodePublicFlags(flags: number): DiscordBadge[] {
  return FLAG_MAP.filter(f => (flags & f.bit) === f.bit).map(f => ({
    name: f.name,
    icon: f.icon,
  }));
}

/** Returns a Nitro badge if the user has an active Nitro subscription */
export function getNitroBadge(premiumType: number): DiscordBadge | null {
  if (premiumType === 0) return null;
  const names: Record<number, string> = {
    1: "Nitro Classic",
    2: "Nitro",
    3: "Nitro Básico",
  };
  return {
    name: names[premiumType] ?? "Nitro",
    icon: premiumType === 3 ? "/badges/nitro-basic.svg" : "/badges/nitro.png",
  };
}
