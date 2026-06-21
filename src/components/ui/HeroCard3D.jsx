import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TOOL_PREVIEWS = [
  { name: 'ORB Scanner', cat: 'Trading', color: '#f59e0b', icon: '📈', status: 'Production', desc: 'Real-time breakout detection' },
  { name: 'AI Support Bot', cat: 'AI', color: '#8b5cf6', icon: '🤖', status: 'Production', desc: 'Intelligent ticket resolution' },
  { name: 'Data Pipeline', cat: 'Automation', color: '#06b6d4', icon: '⚡', status: 'Beta', desc: 'Scheduled workflow engine' },
];

function MiniCard({ tool, zOffset, rotX, rotY, scale = 1, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        width: 220,
        transform: `translateZ(${zOffset}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${tool.color}30`,
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: `0 ${8 + Math.abs(zOffset) / 4}px ${24 + Math.abs(zOffset) / 2}px rgba(15,23,42,${0.08 + Math.abs(zOffset) / 600}), 0 2px 6px rgba(15,23,42,0.04), 0 0 0 1px ${tool.color}15`,
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: `${tool.color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
        }}>{tool.icon}</div>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.2 }}>{tool.name}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: tool.color, marginTop: 2 }}>{tool.cat}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8, padding: '2px 6px', borderRadius: 5,
            background: tool.status === 'Production' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
            color: tool.status === 'Production' ? '#16a34a' : '#d97706',
            border: `1px solid ${tool.status === 'Production' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}>{tool.status}</span>
        </div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${tool.color}25, transparent)`, marginBottom: 8 }} />
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{tool.desc}</div>
      {/* colored bottom accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${tool.color}, ${tool.color}60)`,
        borderRadius: '0 0 16px 16px',
      }} />
    </motion.div>
  );
}

export default function HeroCard3D() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        setTilt({ x: -dy * 8, y: dx * 8 });
      });
    };
    const reset = () => setTilt({ x: 0, y: 0 });
    window.addEventListener('mousemove', handler, { passive: true });
    el.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('mousemove', handler);
      el.removeEventListener('mouseleave', reset);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="perspective-1500"
      style={{ width: 280, height: 280, position: 'relative' }}
    >
      <motion.div
        className="preserve-3d"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* Back card */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <MiniCard tool={TOOL_PREVIEWS[2]} zOffset={-40} rotX={2} rotY={-4} scale={0.88} delay={0.3} />
        </div>
        {/* Mid card */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <MiniCard tool={TOOL_PREVIEWS[1]} zOffset={0} rotX={0} rotY={0} scale={0.94} delay={0.15} />
        </div>
        {/* Front card */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <MiniCard tool={TOOL_PREVIEWS[0]} zOffset={40} rotX={-2} rotY={4} scale={1} delay={0} />
        </div>
      </motion.div>
    </div>
  );
}
