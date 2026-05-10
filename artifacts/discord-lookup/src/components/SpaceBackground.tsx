import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
}

interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Props {
  parallaxX?: number;
  parallaxY?: number;
}

export function SpaceBackground({ parallaxX = 0, parallaxY = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth + 60;
      canvas.height = window.innerHeight + 60;
    };
    window.addEventListener("resize", resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const NUM_PARTICLES = 130;
    const REVEAL_RADIUS = 200;
    const CONNECT_DIST = 130;

    const particles: Particle[] = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const meteors: Meteor[] = [];
    let meteorTimer = 0;
    const METEOR_INTERVAL = 180 + Math.random() * 300; // frames between meteors

    const spawnMeteor = () => {
      const side = Math.random();
      let x: number, y: number;
      if (side < 0.6) {
        x = Math.random() * canvas.width * 0.6;
        y = -20;
      } else {
        x = -20;
        y = Math.random() * canvas.height * 0.5;
      }
      const speed = 4 + Math.random() * 5;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
      meteors.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 50 + Math.random() * 80,
        opacity: 0.6 + Math.random() * 0.4,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      // ── Particles ──
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const distToMouse = Math.sqrt(dxm * dxm + dym * dym);
        const fadeP = Math.max(0, 1 - distToMouse / REVEAL_RADIUS);
        if (fadeP <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 170, 255, ${fadeP})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= CONNECT_DIST) continue;

          const dxm2 = q.x - mouse.x;
          const dym2 = q.y - mouse.y;
          const distToMouse2 = Math.sqrt(dxm2 * dxm2 + dym2 * dym2);
          const fadeQ = Math.max(0, 1 - distToMouse2 / REVEAL_RADIUS);

          const lineFade = Math.min(fadeP, fadeQ) * (1 - dist / CONNECT_DIST);
          if (lineFade <= 0) continue;

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(150, 100, 255, ${lineFade * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(180, 120, 255, ${fadeP * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      if (mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(210, 160, 255, 0.85)";
        ctx.fill();

        const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REVEAL_RADIUS);
        grd.addColorStop(0, "rgba(120, 60, 200, 0.06)");
        grd.addColorStop(1, "rgba(120, 60, 200, 0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, REVEAL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── Meteors ──
      meteorTimer++;
      if (meteorTimer >= METEOR_INTERVAL) {
        spawnMeteor();
        meteorTimer = 0;
        // randomize next interval
        (METEOR_INTERVAL as unknown as number);
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;

        const progress = m.life / m.maxLife;
        const alpha = m.opacity * (1 - progress);

        if (alpha <= 0.01 || m.x > canvas.width + 100 || m.y > canvas.height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - m.vx / Math.hypot(m.vx, m.vy) * m.length;
        const tailY = m.y - m.vy / Math.hypot(m.vx, m.vy) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.7, `rgba(200,180,255,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-[-1] pointer-events-none"
      style={{
        top: "-30px",
        left: "-30px",
        transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        transition: "transform 0.1s ease-out",
        willChange: "transform",
      }}
    />
  );
}
