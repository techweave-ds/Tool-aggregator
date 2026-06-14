import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SYSTEMS from '@/data/systems';

export default function WorkshopHero({ onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [dims, setDims] = useState({ w: 1200, h: 700 });
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const h = (e) => {
      const r = el.getBoundingClientRect();
      setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener('mousemove', h);
    return () => { ro.disconnect(); el.removeEventListener('mousemove', h); };
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const radius = Math.min(dims.w, dims.h) * 0.32;

  const getModulePos = (i, total) => {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    let x = cx + Math.cos(angle) * radius;
    let y = cy + Math.sin(angle) * radius;
    if (hovered !== null && hovered !== i) {
      const ha = (hovered / total) * Math.PI * 2 - Math.PI / 2;
      const hx = cx + Math.cos(ha) * radius;
      const hy = cy + Math.sin(ha) * radius;
      const dx = x - hx;
      const dy = y - hy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const push = (130 - dist) / 130 * 40;
        x += (dx / dist) * push;
        y += (dy / dist) * push;
      }
    }
    return { x, y, angle };
  };

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 select-none">
      <div className="absolute inset-0 grid-bg opacity-[0.12] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(99,102,241,0.06) 0%, transparent 70%)`,
        transition: 'background 0.6s ease-out',
      }} />

      {/* Center question */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6" style={{ maxWidth: 480 }}>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs font-medium mb-5"
          style={{ color: 'var(--os-text3)', letterSpacing: '0.15em' }}
        >
          WEAVESTACK WORKSHOP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
        >
          What are you<br />
          <span className="text-gradient">trying to build?</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--os-text3)', maxWidth: 340 }}
        >
          Select an outcome below. We'll show you the workflow and the tools that make it possible.
        </motion.p>
      </div>

      {/* Desktop: modules positioned in a ring */}
      <div className="hidden md:block absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        {SYSTEMS.map((sys, i) => {
          const pos = getModulePos(i, SYSTEMS.length);
          const isHov = hovered === i;
          const isSel = selectedId === sys.id;
          return (
            <motion.button
              key={sys.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: hovered === null ? 0.85 : isHov ? 1 : 0.55, scale: isHov || isSel ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.5, delay: 0.3 + i * 0.06 }}
              onClick={(e) => { e.stopPropagation(); onSelect(isSel ? null : sys.id); }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="absolute pointer-events-auto flex flex-col items-center gap-2 cursor-pointer"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', zIndex: isHov || isSel ? 20 : 10, transition: 'left 0.4s cubic-bezier(0.16,1,0.3,1), top 0.4s cubic-bezier(0.16,1,0.3,1)' }}
            >
              <div
                className="flex items-center justify-center rounded-[14px] transition-all duration-300"
                style={{
                  width: isHov || isSel ? 60 : 50,
                  height: isHov || isSel ? 60 : 50,
                  background: `${sys.color}${isHov || isSel ? '22' : '12'}`,
                  border: `1.5px solid ${sys.color}${isHov || isSel ? '50' : '22'}`,
                  fontSize: isHov || isSel ? 26 : 20,
                  boxShadow: isHov || isSel ? `0 0 30px ${sys.color}25` : 'none',
                }}
              >
                {sys.icon}
              </div>
              <span
                className="font-medium whitespace-nowrap text-center transition-all duration-300"
                style={{
                  fontSize: isHov || isSel ? 12 : 10,
                  color: isHov || isSel ? sys.color : 'var(--os-text2)',
                  letterSpacing: '-0.01em',
                }}
              >
                {sys.name}
              </span>
              {/* Connection line toward center */}
              {isHov && (
                <svg className="absolute pointer-events-none" style={{ top: '50%', left: '50%', width: 1, height: 1, overflow: 'visible' }}>
                  <line
                    x1={0} y1={0}
                    x2={-Math.cos(pos.angle) * (isHov ? 80 : 0)}
                    y2={-Math.sin(pos.angle) * (isHov ? 80 : 0)}
                    stroke={sys.color}
                    strokeWidth={0.5}
                    strokeDasharray="3 4"
                    opacity={0.25}
                  />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: scrollable vertical list */}
      <div className="md:hidden absolute bottom-0 inset-x-0 z-10 overflow-y-auto no-scrollbar pointer-events-none" style={{ maxHeight: '55%' }}>
        <div className="flex flex-col gap-2 px-5 pb-6 pointer-events-auto">
          {SYSTEMS.map((sys) => {
            const isSel = selectedId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => onSelect(isSel ? null : sys.id)}
                className="flex items-center gap-3 w-full p-3.5 rounded-xl transition-all text-left"
                style={{
                  background: isSel ? `${sys.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSel ? `${sys.color}40` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0" style={{ background: `${sys.color}18` }}>
                  <span style={{ fontSize: 18 }}>{sys.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--os-text)' }}>{sys.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--os-text3)' }}>{sys.shortDesc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sys.color} strokeWidth="2" style={{ opacity: isSel ? 1 : 0.3, flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      {!selectedId && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="var(--os-text3)" strokeWidth="1.5" opacity="0.4">
              <path d="M7 2v18M7 20l-5-5M7 20l5-5" />
            </svg>
            <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)', letterSpacing: '0.12em', opacity: 0.5 }}>SELECT A PATH</span>
          </motion.div>
        </div>
      )}
    </section>
  );
}
