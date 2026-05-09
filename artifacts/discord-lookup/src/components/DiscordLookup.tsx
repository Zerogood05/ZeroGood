import { useState } from "react";
import { Search, Hash, Calendar, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetDiscordUser, getGetDiscordUserQueryKey } from "@workspace/api-client-react";
import { decodePublicFlags } from "@/lib/discord-flags";

export function DiscordLookup() {
  const [searchInput, setSearchInput] = useState("");
  const [userId, setUserId] = useState("");

  const { data: user, isLoading, isError, error } = useGetDiscordUser(userId, {
    query: {
      enabled: !!userId,
      queryKey: getGetDiscordUserQueryKey(userId)
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUserId(searchInput.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <div className="text-center space-y-4">
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
            className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary shadow-[0_0_15px_rgba(168,85,247,0.1)] focus-visible:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all font-mono text-base"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all active:scale-95 font-medium">
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </form>

      <div className="min-h-[250px] flex flex-col">
        {isLoading && (
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden animate-pulse">
            <div className="h-24 bg-white/5" />
            <CardContent className="p-6 relative pt-0">
              <div className="absolute -top-12 left-6 p-1 bg-black/40 rounded-full">
                <Skeleton className="w-20 h-20 rounded-full bg-white/10" />
              </div>
              <div className="mt-12 space-y-4">
                <Skeleton className="h-8 w-48 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
                  <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="border-destructive/30 bg-destructive/10 backdrop-blur-xl">
            <CardContent className="p-8 text-center flex flex-col items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-destructive opacity-80" />
              <p className="text-destructive-foreground font-medium">
                {(error as any)?.error || "No se pudo encontrar al usuario. Verifica que el ID sea correcto y que el token del bot esté configurado."}
              </p>
            </CardContent>
          </Card>
        )}

        {user && !isLoading && (
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-primary/30">
            <div 
              className="h-28 w-full bg-muted relative"
              style={{
                backgroundColor: user.banner ? undefined : (user.accentColor ? `#${user.accentColor.toString(16).padStart(6, '0')}` : 'hsl(var(--muted))'),
                backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <CardContent className="p-6 relative pt-0">
              <div className="absolute -top-14 left-6 p-1.5 bg-black/80 rounded-full backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.username} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-transparent"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="mt-14 flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground flex items-center gap-2 glow-hover">
                    {user.globalName || user.username}
                    {user.bot && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs px-1.5 py-0">BOT</Badge>
                    )}
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm mt-1">
                    {user.username}{user.discriminator !== '0' ? `#${user.discriminator}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Creado el {new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  
                  {decodePublicFlags(user.publicFlags).map(flag => (
                    <Badge key={flag} variant="outline" className="border-primary/20 bg-primary/5 text-primary-foreground/80 font-medium">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}