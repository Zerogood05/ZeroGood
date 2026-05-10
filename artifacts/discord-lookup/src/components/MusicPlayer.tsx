import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(40);
  const [showVol, setShowVol] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.volume = volume / 100;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
      onMouseEnter={() => setShowVol(true)}
      onMouseLeave={() => setShowVol(false)}
    >
      {/* Volume slider */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300 ${
          showVol ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <Volume2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => handleVolume(Number(e.target.value))}
          className="w-20 h-1 accent-primary cursor-pointer"
        />
      </div>

      {/* Play/pause button */}
      <button
        onClick={toggle}
        title={playing ? "Pausar música" : "Reproducir música ambiental"}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-primary/40 hover:bg-black/80 transition-all duration-200 group"
      >
        {/* Waveform bars */}
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 7, 5, 3].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-primary/70 group-hover:bg-primary"
              style={{
                height: playing ? `${h}px` : "2px",
                transition: `height 0.3s ease ${i * 0.05}s`,
                animation: playing
                  ? `musicBar${i} ${0.6 + i * 0.1}s ease-in-out infinite alternate`
                  : "none",
              }}
            />
          ))}
        </div>

        {playing ? (
          <Pause className="w-3.5 h-3.5 text-primary" />
        ) : (
          <Play className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}

        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-mono">
          {playing ? "Space Ambient" : "Música"}
        </span>
      </button>

      <style>{`
        @keyframes musicBar0 { from { height: 3px } to { height: 10px } }
        @keyframes musicBar1 { from { height: 5px } to { height: 14px } }
        @keyframes musicBar2 { from { height: 7px } to { height: 16px } }
        @keyframes musicBar3 { from { height: 5px } to { height: 12px } }
        @keyframes musicBar4 { from { height: 3px } to { height: 8px } }
      `}</style>
    </div>
  );
}
