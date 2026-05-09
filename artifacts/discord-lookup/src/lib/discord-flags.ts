export interface DiscordBadge {
  name: string;
  hash: string;
}

const FLAG_MAP: { bit: number; name: string; hash: string }[] = [
  { bit: 1 << 0,  name: "Discord Staff",        hash: "5e74e9b61934fc1f67c65515d1f7e60d" },
  { bit: 1 << 1,  name: "Partner",              hash: "3f9748e53446a127d697b4f7df1f7e28" },
  { bit: 1 << 2,  name: "HypeSquad Events",     hash: "bf01d1073931f921909045f3a39fd264" },
  { bit: 1 << 3,  name: "Bug Hunter",           hash: "2717692c7dca7289b35297368a940dd0" },
  { bit: 1 << 6,  name: "HypeSquad Bravery",    hash: "8a88d63823d8a71cd5e390baa45aca9e" },
  { bit: 1 << 7,  name: "HypeSquad Brilliance", hash: "011940fd013082d85d96680afe7979d5" },
  { bit: 1 << 8,  name: "HypeSquad Balance",    hash: "3aa19bfe999d3e5c37e72f6b069a7183" },
  { bit: 1 << 9,  name: "Early Supporter",      hash: "7060786766c9c840eb3019e725d2b358" },
  { bit: 1 << 14, name: "Bug Hunter Lvl 2",     hash: "848f79194d4be5ff5f81505cbd0ce1e6" },
  { bit: 1 << 16, name: "Verified Bot",         hash: "6f9e7bf7a09ef0af736df0f9a6b1d2a9" },
  { bit: 1 << 17, name: "Early Bot Developer",  hash: "6df5892e0f35b051d8b61d8224723cac" },
  { bit: 1 << 18, name: "Certified Moderator",  hash: "fee1624003e17566a30645d7d3faed13" },
  { bit: 1 << 22, name: "Active Developer",     hash: "6bdc42827a38498929a4920da12695d9" },
];

export function decodePublicFlags(flags: number): DiscordBadge[] {
  return FLAG_MAP.filter(f => (flags & f.bit) === f.bit).map(f => ({
    name: f.name,
    hash: f.hash,
  }));
}
