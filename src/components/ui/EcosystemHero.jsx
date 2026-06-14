import { useEffect, useRef } from 'react';

const CATEGORIES = [
  { name: 'AI', color: '#8b5cf6', x: 0.3, y: 0.25 },
  { name: 'Trading', color: '#f59e0b', x: 0.7, y: 0.2 },
  { name: 'Development', color: '#3b82f6', x: 0.2, y: 0.55 },
  { name: 'Utilities', color: '#22c55e', x: 0.8, y: 0.5 },
  { name: 'Automations', color: '#06b6d4', x: 0.5, y: 0.35 },
  { name: 'Restaurant', color: '#f97316', x: 0.65, y: 0.7 },
  { name: 'Archive', color: '#6b7280', x: 0.35, y: 0.75 },
];

export default function EcosystemHero({ mousePos }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const nodes = CATEGORIES.map(cat => ({
      ...cat,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    function resize() {
      w = canvas.width = canvas.offsetWidth * 2;
      h = canvas.height = canvas.offsetHeight * 2;
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      ctx.strokeStyle = 'rgba(99,102,241,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = Math.abs(nodes[i].x - nodes[j].x) * w;
          const dy = Math.abs(nodes[i].y - nodes[j].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < w * 0.35) {
            ctx.globalAlpha = 1 - dist / (w * 0.35);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw nodes
      nodes.forEach((node, i) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const pulseRadius = 4 + Math.sin(time * 0.001 + node.pulse) * 1.5;

        // Glow
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 50);
        grad.addColorStop(0, node.color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, 50, 0, Math.PI * 2);
        ctx.fill();

        // Main dot
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(nx, ny, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, nx, ny + 18);

        // Subtle animation
        node.x += node.vx * 0.002;
        node.y += node.vy * 0.002;
        if (node.x < 0.1 || node.x > 0.9) node.vx *= -1;
        if (node.y < 0.1 || node.y > 0.9) node.vy *= -1;
      });

      // Mouse interaction
      if (mousePos?.current) {
        const mx = mousePos.current.x * w;
        const my = mousePos.current.y * h;
        nodes.forEach(node => {
          const dx = mx - node.x * w;
          const dy = my - node.y * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150 * 0.03;
            node.x -= dx / dist * force;
            node.y -= dy / dist * force;
          }
        });
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', opacity: 0.7 }}
    />
  );
}
