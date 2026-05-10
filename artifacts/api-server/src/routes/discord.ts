import { Router } from "express";

const router = Router();

function snowflakeToDate(snowflake: string): string {
  const DISCORD_EPOCH = 1420070400000n;
  const ms = (BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
  return new Date(Number(ms)).toISOString();
}

function isValidSnowflake(id: string): boolean {
  return /^\d{17,20}$/.test(id);
}

router.get("/discord/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!isValidSnowflake(userId)) {
    res.status(400).json({ error: "Invalid Discord user ID. Must be a numeric Snowflake ID." });
    return;
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    res.status(503).json({ error: "Discord bot token not configured. Set the DISCORD_BOT_TOKEN environment variable." });
    return;
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      res.status(404).json({ error: "Discord user not found." });
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      req.log.warn({ status: response.status, body }, "Discord API error");
      res.status(502).json({ error: "Discord API returned an error. Please try again." });
      return;
    }

    const user = await response.json() as {
      id: string;
      username: string;
      discriminator: string;
      global_name?: string | null;
      avatar?: string | null;
      banner?: string | null;
      accent_color?: number | null;
      bot?: boolean;
      public_flags?: number;
      premium_type?: number;
      clan?: {
        tag?: string | null;
        badge?: string | null;
        identity_guild_id?: string | null;
        identity_enabled?: boolean;
      } | null;
    };

    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(user.id) >> 22n) % 6n}.png`;

    const banner = user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=480`
      : null;

    res.json({
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      globalName: user.global_name ?? null,
      avatar: user.avatar ?? null,
      avatarUrl: avatar,
      banner: user.banner ?? null,
      bannerUrl: banner,
      accentColor: user.accent_color ?? null,
      bot: user.bot ?? false,
      publicFlags: user.public_flags ?? 0,
      createdAt: snowflakeToDate(user.id),
      clanTag: user.clan?.tag ?? null,
      clanBadgeHash: user.clan?.badge ?? null,
      clanGuildId: user.clan?.identity_guild_id ?? null,
      premiumType: user.premium_type ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch Discord user");
    res.status(500).json({ error: "Internal server error." });
  }
});

async function proxyImage(url: string, res: import("express").Response, log: import("pino").Logger) {
  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "DiscordBot (https://github.com, 1.0)" },
    });
    if (!upstream.ok) { res.status(upstream.status).end(); return; }
    const buf = await upstream.arrayBuffer();
    res.set("Content-Type", "image/png");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(buf));
  } catch (err) {
    log.error({ err }, "Failed to proxy image");
    res.status(502).end();
  }
}

// Proxy standard badge icons
router.get("/discord/badge/:hash", async (req, res) => {
  const { hash } = req.params;
  if (!/^[a-f0-9]{32}$/.test(hash)) { res.status(400).json({ error: "Invalid badge hash." }); return; }
  await proxyImage(`https://cdn.discordapp.com/badge-icons/${hash}.png`, res, req.log);
});

// Proxy clan/guild badge icons
router.get("/discord/clan-badge/:guildId/:hash", async (req, res) => {
  const { guildId, hash } = req.params;
  if (!/^\d{17,20}$/.test(guildId) || !/^[a-f0-9]{32}$/.test(hash)) {
    res.status(400).json({ error: "Invalid clan badge parameters." }); return;
  }
  await proxyImage(`https://cdn.discordapp.com/clan-badges/${guildId}/${hash}.png`, res, req.log);
});

export default router;
