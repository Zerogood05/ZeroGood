import { useState } from "react";
import { Search, Hash, Calendar, ShieldCheck, User as UserIcon, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDiscordUser, getGetDiscordUserQueryKey } from "@workspace/api-client-react";
import { decodePublicFlags } from "@/lib/discord-flags";

export function DiscordLookup() {
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");

  const { data: user, isLoading, isError, error } = useGetDiscordUser(userId, {
    query: {
      enabled: !!userId,
      queryKey: getGetDiscordUserQueryKey(userId),
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) setUserId(searchInput.trim());
  };

  const badges = user ? decodePublicFlags(user.publicFlags) : [];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold glow-hover tracking-tight">Buscar en Discord</h2>
        <p className="text-muted-foreground">Escanea la red para encontrar un usuario por su ID de Snowflake.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 group">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. 123456789012345678"
            data-testid="input-discord-id"
            className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary shadow-[0_0_15px_rgba(168,85,247,0.1)] focus-visible:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all font-mono text-base"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          data-testid="button-search"
          className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all active:scale-95 font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </form>

      <div className="min-h-[220px] flex flex-col">

        {isLoading && (
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
            <div className="h-24 bg-white/5 animate-pulse" />
            <CardContent className="p-5 flex gap-4">
              <Skeleton className="w-16 h-16 rounded-full bg-white/10 shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                <Skeleton className="h-5 w-40 bg-white/10" />
                <Skeleton className="h-4 w-28 bg-white/10" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-7 w-7 bg-white/10 rounded" />
                  <Skeleton className="h-7 w-7 bg-white/10 rounded" />
                  <Skeleton className="h-7 w-7 bg-white/10 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="border-destructive/30 bg-destructive/10 backdrop-blur-xl">
            <CardContent className="p-8 text-center flex flex-col items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-destructive opacity-80" />
              <p className="text-destructive-foreground font-medium text-sm">
                {(error as { error?: string })?.error ||
                  "No se pudo encontrar al usuario. Verifica que el ID sea correcto y que el token del bot esté configurado."}
              </p>
            </CardContent>
          </Card>
        )}

        {user && !isLoading && (
          <Card
            data-testid="card-user-result"
            className="border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-primary/30 transition-colors duration-500"
          >
            {/* Banner */}
            <div
              className="h-24 w-full"
              style={{
                backgroundColor: user.accentColor
                  ? `#${user.accentColor.toString(16).padStart(6, "0")}`
                  : "hsl(var(--muted))",
                backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <CardContent className="p-5">
              {/* Avatar + name + badges */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="shrink-0 -mt-10 p-1 rounded-full bg-black/80 border border-white/10 shadow-lg">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      data-testid="img-avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <UserIcon className="w-7 h-7 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Name block */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      data-testid="text-username"
                      className="text-xl font-display font-bold text-foreground glow-hover"
                    >
                      {user.globalName || user.username}
                    </h3>

                    {/* Clan tag */}
                    {user.clanTag && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/10 text-foreground/80 border border-white/15 rounded px-2 py-0.5 tracking-widest font-mono">
                        {user.clanBadgeHash && user.clanGuildId && (
                          <img
                            src={`/api/discord/clan-badge/${user.clanGuildId}/${user.clanBadgeHash}`}
                            alt=""
                            className="w-3.5 h-3.5 object-contain"
                          />
                        )}
                        {user.clanTag}
                      </span>
                    )}

                    {user.bot && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30 rounded px-1.5 py-0.5">
                        <Bot className="w-3 h-3" /> BOT
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground font-mono text-sm mt-0.5">
                    @{user.username}
                    {user.discriminator !== "0" ? `#${user.discriminator}` : ""}
                  </p>

                  {/* Badges inline — right under handle */}
                  {badges.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {badges.map((badge) => (
                        <div key={badge.name} className="relative group/badge cursor-default">
                          <img
                            src={badge.icon}
                            alt={badge.name}
                            data-testid={`badge-${badge.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="w-6 h-6 object-contain hover:scale-125 transition-transform duration-200 drop-shadow-sm"
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-black/90 border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-lg">
                            {badge.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-white/8 my-4" />

              {/* Info row */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Creado el {new Date(user.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5 font-mono">
                  ID: {user.id}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
