export function decodePublicFlags(flags: number): string[] {
  const flagNames: string[] = [];

  const FLAGS = {
    DISCORD_EMPLOYEE: 1 << 0,
    PARTNERED_SERVER_OWNER: 1 << 1,
    HYPE_SQUAD_EVENTS: 1 << 2,
    BUG_HUNTER_LEVEL_1: 1 << 3,
    HOUSE_BRAVERY: 1 << 6,
    HOUSE_BRILLIANCE: 1 << 7,
    HOUSE_BALANCE: 1 << 8,
    EARLY_SUPPORTER: 1 << 9,
    TEAM_USER: 1 << 10,
    BUG_HUNTER_LEVEL_2: 1 << 14,
    VERIFIED_BOT: 1 << 16,
    EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
    DISCORD_CERTIFIED_MODERATOR: 1 << 18,
    BOT_HTTP_INTERACTIONS: 1 << 19,
    ACTIVE_DEVELOPER: 1 << 22,
  };

  if ((flags & FLAGS.DISCORD_EMPLOYEE) === FLAGS.DISCORD_EMPLOYEE) flagNames.push("Discord Staff");
  if ((flags & FLAGS.PARTNERED_SERVER_OWNER) === FLAGS.PARTNERED_SERVER_OWNER) flagNames.push("Partner");
  if ((flags & FLAGS.HYPE_SQUAD_EVENTS) === FLAGS.HYPE_SQUAD_EVENTS) flagNames.push("HypeSquad Events");
  if ((flags & FLAGS.BUG_HUNTER_LEVEL_1) === FLAGS.BUG_HUNTER_LEVEL_1) flagNames.push("Bug Hunter");
  if ((flags & FLAGS.HOUSE_BRAVERY) === FLAGS.HOUSE_BRAVERY) flagNames.push("HypeSquad Bravery");
  if ((flags & FLAGS.HOUSE_BRILLIANCE) === FLAGS.HOUSE_BRILLIANCE) flagNames.push("HypeSquad Brilliance");
  if ((flags & FLAGS.HOUSE_BALANCE) === FLAGS.HOUSE_BALANCE) flagNames.push("HypeSquad Balance");
  if ((flags & FLAGS.EARLY_SUPPORTER) === FLAGS.EARLY_SUPPORTER) flagNames.push("Early Supporter");
  if ((flags & FLAGS.TEAM_USER) === FLAGS.TEAM_USER) flagNames.push("Team User");
  if ((flags & FLAGS.BUG_HUNTER_LEVEL_2) === FLAGS.BUG_HUNTER_LEVEL_2) flagNames.push("Bug Hunter Lvl 2");
  if ((flags & FLAGS.VERIFIED_BOT) === FLAGS.VERIFIED_BOT) flagNames.push("Verified Bot");
  if ((flags & FLAGS.EARLY_VERIFIED_BOT_DEVELOPER) === FLAGS.EARLY_VERIFIED_BOT_DEVELOPER) flagNames.push("Early Bot Dev");
  if ((flags & FLAGS.DISCORD_CERTIFIED_MODERATOR) === FLAGS.DISCORD_CERTIFIED_MODERATOR) flagNames.push("Certified Mod");
  if ((flags & FLAGS.BOT_HTTP_INTERACTIONS) === FLAGS.BOT_HTTP_INTERACTIONS) flagNames.push("HTTP Interactions");
  if ((flags & FLAGS.ACTIVE_DEVELOPER) === FLAGS.ACTIVE_DEVELOPER) flagNames.push("Active Developer");

  return flagNames;
}
