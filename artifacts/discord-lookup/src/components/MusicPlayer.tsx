import { useState, useRef, useCallback } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

type AudioRefs = {
  ctx: AudioContext;
  master: GainNode;
  schedulerId: number | null;
  nextNoteTime: number;
};

const PAD_NOTES = [220, 246.9, 261.6, 293.7, 329.6, 369.9, 392, 440, 493.9, 523.3];
const DRONE_FREQS = [55, 82.4, 110, 164.8];

function buildAudio(): AudioRefs {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const delay = ctx.createDelay(3);
  delay.delayTime.value = 1.8;
  const delayFb = ctx.createGain();
  delayFb.gain.value = 0.35;
  delay.connect(delayFb);
  delayFb.connect(delay);
  delay.connect(master);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  filter.connect(master);

  DRONE_FREQS.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.012;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4 + i * 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.07 - i * 0.01;

    osc.connect(droneGain);
    droneGain.connect(filter);
    osc.start();
    lfo.start();
  });

  return { ctx, master, schedulerId: null, nextNoteTime: ctx.currentTime + 2 };
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(40);
  const [showVol, setShowVol] = useState(false);
  const refs = useRef<AudioRefs | null>(null);

  const scheduleNote = useCallback(() => {
    const r = refs.current;
    if (!r) return;
    const { ctx } = r;

    if (ctx.currentTime >= r.nextNoteTime - 0.05) {
      const freq = PAD_NOTES[Math.floor(Math.random() * PAD_NOTES.length)];
      const duration = 5 + Math.random() * 6;

      const osc = ctx.createOscillator();
      osc.type = Math.random() > 0.5 ? "sine" : "triangle";
      osc.frequency.value = freq;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.5);
      env.gain.linearRampToValueAtTime(0.015, ctx.currentTime + duration - 1.5);
      env.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600 + Math.random() * 800;

      osc.connect(filter);
      filter.connect(env);
      env.connect(r.master);

      const delay2 = ctx.createDelay(2);
      delay2.delayTime.value = 1.2;
      const delayGain = ctx.createGain();
      delayGain.gain.value = 0.25;
      env.connect(delay2);
      delay2.connect(delayGain);
      delayGain.connect(r.master);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.1);

      r.nextNoteTime = ctx.currentTime + 4 + Math.random() * 6;
    }

    r.schedulerId = requestAnimationFrame(scheduleNote);
  }, []);

  const play = useCallback(() => {
    if (!refs.current) {
      refs.current = buildAudio();
    }
    const r = refs.current;
    r.ctx.resume();
    const now = r.ctx.currentTime;
    r.master.gain.cancelScheduledValues(now);
    r.master.gain.setValueAtTime(r.master.gain.value, now);
    r.master.gain.linearRampToValueAtTime(volume / 100, now + 0.8);
    r.nextNoteTime = now + 0.5;
    r.schedulerId = requestAnimationFrame(scheduleNote);
    setPlaying(true);
  }, [volume, scheduleNote]);

  const pause = useCallback(() => {
    if (!refs.current) return;
    const r = refs.current;
    if (r.schedulerId !== null) {
      cancelAnimationFrame(r.schedulerId);
      r.schedulerId = null;
    }
    const now = r.ctx.currentTime;
    r.master.gain.cancelScheduledValues(now);
    r.master.gain.setValueAtTime(r.master.gain.value, now);
    r.master.gain.linearRampToValueAtTime(0, now + 1.2);
    setPlaying(false);
  }, []);

  const handleVolume = (v: number) => {
    setVolume(v);
    if (refs.current) {
      const now = refs.current.ctx.currentTime;
      refs.current.master.gain.setValueAtTime(refs.current.master.gain.value, now);
      refs.current.master.gain.linearRampToValueAtTime(v / 100, now + 0.2);
    }
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
        onClick={playing ? pause : play}
        title={playing ? "Pausar música" : "Reproducir música ambiental"}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl hover:border-primary/40 hover:bg-black/80 transition-all duration-200 group"
      >
        {/* Waveform animation */}
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 7, 5, 3].map((h, i) => (
            <div
              key={i}
              className="w-0.5 rounded-full bg-primary/70 group-hover:bg-primary"
              style={{
                height: playing ? `${h}px` : "2px",
                transition: `height 0.3s ease ${i * 0.05}s`,
                animation: playing ? `musicBar${i} ${0.6 + i * 0.1}s ease-in-out infinite alternate` : "none",
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
