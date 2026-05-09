import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

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
      className="fixed inset-0 z-[-1] pointer-events-none"
    />
  );
}
