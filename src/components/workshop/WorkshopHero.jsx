import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SYSTEMS from '@/data/systems';

const COLORS = { AI: '#8b5cf6', Trading: '#f59e0b', Automations: '#06b6d4', Restaurant: '#f97316', Development: '#3b82f6' };

export default function WorkshopHero({ onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = (e) => {
      const r = el.getBoundingClientRect();
      setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener('mousemove', h);
    return () => el.removeEventListener('mousemove', h);
  }, []);

  const getModuleStyle = useCallback((i, total) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const baseR = 42;
    const r = baseR + (hovered === i ? 0 : 0);
    const pushDist = hovered === i ? 0 : 0;
    let x = 50 + Math.cos(angle) * (r + pushDist);
    let y = 50 + Math.sin(angle) * (r + pushDist);
    if (hovered !== null && hovered !== i) {
      const ha = (hovered / total) * Math.PI * 2 - Math.PI / 2;
      const hx = 50 + Math.cos(ha) * baseR;
      const hy = 50 + Math.sin(ha) * baseR;
      const dx = x - hx;
      const dy = y - hy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) {
        const push = (20 - dist) / 20 * 8;
        x += (dx / dist) * push;
        y += (dy / dist) * push;
      }
    }
    return { x, y, angle: angle + Math.PI / 2 };
  }, [hovered]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 select-none">
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(99,102,241,0.06) 0%, transparent 70%)`,
        transition: 'background 0.4s ease-out',
      }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="relative" style={{ height: 'clamp(400px, 70vh, 640px)' }}>
          {/* Center question */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center" style={{ maxWidth: 520 }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-xs font-medium mb-4" style={{ color: 'var(--os-text3)', letterSpacing: '0.15em' }}>WEAVESTACK WORKSHOP</p>
                <h1 className="font-display font-bold leading-[1.05] mb-3" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--os-text)', letterSpacing: '-0.03em' }}>
                  What are you<br />
                  <span className="text-gradient">trying to build?</span>
                </h1>
                <p className="text-sm" style={{ color: 'var(--os-text3)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
                  Select an outcome below. We'll show you the workflow and tools.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Desktop: floating outcome modules */}
          <div className="hidden md:block absolute inset-0">
            {SYSTEMS.map((sys, i) => {
              const pos = getModuleStyle(i, SYSTEMS.length);
              return (
                <motion.button
                  key={sys.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hovered === i ? 1 : 0.7,
                    scale: hovered === i ? 1.05 : 1,
                    x: `${pos.x}%`,
                    y: `${pos.y}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.6 }}
                  onClick={() => onSelect(selectedId === sys.id ? null : sys.id)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
                  style={{ left: 0, top: 0, zIndex: hovered === i ? 20 : 10 }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      width: hovered === i ? 56 : 48,
                      height: hovered === i ? 56 : 48,
                      background: `${sys.color}${hovered === i ? '20' : '12'}`,
                      border: `1px solid ${sys.color}${hovered === i ? '50' : '25'}`,
                      fontSize: hovered === i ? 24 : 20,
                      boxShadow: hovered === i ? `0 0 30px ${sys.color}25` : 'none',
                    }}
                  >
                    {sys.icon}
                  </div>
                  <span
                    className="font-medium whitespace-nowrap transition-all duration-300 text-center"
                    style={{
                      fontSize: hovered === i ? 12 : 10,
                      color: hovered === i ? sys.color : 'var(--os-text2)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {sys.name}
                  </span>
                  {/* Connecting line toward center on hover */}
                  {hovered === i && (
                    <svg className="absolute pointer-events-none" style={{ top: '50%', left: '50%', width: 1, height: 1, overflow: 'visible', zIndex: -1 }}>
                      <line
                        x1={0} y1={0}
                        x2={pos.x > 50 ? -100 : 100} y2={pos.y > 50 ? -100 : 100}
                        stroke={sys.color}
                        strokeWidth={0.5}
                        strokeDasharray="4 4"
                        opacity={0.3}
                      />
                    </svg>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Mobile: vertical list */}
          <div className="md:hidden absolute inset-x-0 bottom-0 overflow-y-auto no-scroll" style={{ maxHeight: '60%' }}>
            <div className="flex flex-col gap-2 px-4 pb-4">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => onSelect(selectedId === sys.id ? null : sys.id)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left"
                  style={{
                    background: selectedId === sys.id ? `${sys.color}15` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedId === sys.id ? `${sys.color}40` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ background: `${sys.color}18` }}>
                    <span style={{ fontSize: 18 }}>{sys.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--os-text)' }}>{sys.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--os-text3)' }}>{sys.shortDesc}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sys.color} strokeWidth="2" style={{ opacity: selectedId === sys.id ? 1 : 0.3 }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!selectedId && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="var(--os-text3)" strokeWidth="1.5">
              <path d="M8 4v16M8 20l-6-6M8 20l6-6" opacity="0.5" />
            </svg>
            <span className="text-xs font-mono" style={{ color: 'var(--os-text3)', letterSpacing: '0.1em' }}>SELECT A PATH</span>
          </motion.div>
        </div>
      )}
    </section>
  );
}
