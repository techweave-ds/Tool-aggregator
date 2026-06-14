import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SYSTEMS from '@/data/systems';

const RADIUS_FACTOR = 0.30;
const MIN_RADIUS = 180;

function useContainerDims(ref) {
  const [dims, setDims] = useState({ w: 1200, h: 700 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return dims;
}

function useMousePos(ref) {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener('mousemove', h);
    return () => el.removeEventListener('mousemove', h);
  }, [ref]);
  return pos;
}

function getModulePosition(index, total, cx, cy, radius, hovered, totalHovered) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  let x = cx + Math.cos(angle) * radius;
  let y = cy + Math.sin(angle) * radius;

  if (hovered !== null && hovered !== index) {
    const ha = (hovered / total) * Math.PI * 2 - Math.PI / 2;
    const hx = cx + Math.cos(ha) * radius;
    const hy = cy + Math.sin(ha) * radius;
    const dx = x - hx;
    const dy = y - hy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 140) {
      const push = (140 - dist) / 140 * 44;
      x += (dx / dist) * push;
      y += (dy / dist) * push;
    }
  }
  return { x, y, angle };
}

export default function WorkshopHero({ onSelect, selectedId }) {
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const dims = useContainerDims(ref);
  const mousePos = useMousePos(ref);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const radius = Math.max(Math.min(dims.w, dims.h) * RADIUS_FACTOR, MIN_RADIUS);

  return (
    <section ref={ref} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 select-none">
      <div className="absolute inset-0 grid-bg opacity-[0.08] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 65% 55% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(99,102,241,0.06) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at ${100 - mousePos.x * 100}% ${100 - mousePos.y * 100}%, rgba(139,92,246,0.03) 0%, transparent 60%)`,
        transition: 'background 0.8s ease-out',
      }} />

      {/* Center */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6" style={{ maxWidth: 420 }}>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] font-medium tracking-[0.2em] mb-5"
          style={{ color: 'var(--text3)' }}
        >
          WEAVESTACK
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', letterSpacing: '-0.035em', color: 'var(--text)' }}
        >
          What are you<br />
          <span className="text-gradient">trying to build?</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text3)', maxWidth: 320, fontSize: 13 }}
        >
          Select an outcome. We'll show you the workflow and the tools.
        </motion.p>
      </div>

      {/* Desktop: ring */}
      <div className="hidden md:block absolute inset-0" style={{ zIndex: 10 }}>
        {SYSTEMS.map((sys, i) => {
          const isHov = hovered === i;
          const isSel = selectedId === sys.id;
          const pos = getModulePosition(i, SYSTEMS.length, cx, cy, radius, hovered);

          return (
            <motion.button
              key={sys.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: hovered === null ? 0.8 : isHov ? 1 : 0.4, scale: isHov || isSel ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.4, delay: 0.25 + i * 0.05 }}
              onClick={() => onSelect(isSel ? null : sys.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="absolute flex flex-col items-center gap-2.5 cursor-pointer pointer-events-auto"
              style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)', zIndex: isHov || isSel ? 20 : 10, transition: 'left 0.45s cubic-bezier(0.16,1,0.3,1), top 0.45s cubic-bezier(0.16,1,0.3,1)' }}
            >
              <div
                className="flex items-center justify-center rounded-[16px] transition-all duration-350"
                style={{
                  width: isHov || isSel ? 64 : 52,
                  height: isHov || isSel ? 64 : 52,
                  background: `${sys.color}${isHov || isSel ? '18' : '0a'}`,
                  border: `1.5px solid ${sys.color}${isHov || isSel ? '45' : '18'}`,
                  fontSize: isHov || isSel ? 28 : 22,
                  boxShadow: isHov || isSel ? `0 0 40px ${sys.color}20, 0 4px 20px rgba(0,0,0,0.2)` : '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {sys.icon}
              </div>
              <span
                className="font-medium whitespace-nowrap text-center transition-all duration-300"
                style={{
                  fontSize: isHov || isSel ? 12 : 10,
                  color: isHov || isSel ? sys.color : 'var(--text2)',
                  letterSpacing: '-0.01em',
                  opacity: hovered === null || isHov || isSel ? 1 : 0.5,
                }}
              >
                {sys.name}
              </span>
              {isHov && (
                <svg className="absolute pointer-events-none" style={{ top: '50%', left: '50%', width: 1, height: 1, overflow: 'visible' }}>
                  <line
                    x1={0} y1={0}
                    x2={-Math.cos(pos.angle) * 90}
                    y2={-Math.sin(pos.angle) * 90}
                    stroke={sys.color}
                    strokeWidth={0.5}
                    strokeDasharray="3 5"
                    opacity={0.2}
                  />
                </svg>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden absolute bottom-0 inset-x-0 z-10 overflow-y-auto no-scrollbar pointer-events-none" style={{ maxHeight: '55%' }}>
        <div className="flex flex-col gap-2 px-5 pb-6 pointer-events-auto">
          {SYSTEMS.map((sys) => {
            const isSel = selectedId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => onSelect(isSel ? null : sys.id)}
                className="flex items-center gap-3 w-full p-3.5 rounded-[14px] transition-all duration-200 text-left"
                style={{
                  background: isSel ? `${sys.color}12` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isSel ? `${sys.color}35` : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-[10px] shrink-0" style={{ background: `${sys.color}14` }}>
                  <span style={{ fontSize: 18 }}>{sys.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{sys.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{sys.shortDesc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sys.color} strokeWidth="1.5" style={{ opacity: isSel ? 0.8 : 0.2, flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {!selectedId && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex flex-col items-center gap-2"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="var(--text3)" strokeWidth="1.5" opacity="0.35">
              <path d="M7 2v18M7 20l-5-5M7 20l5-5" />
            </svg>
            <span className="text-[10px] font-mono tracking-[0.15em]" style={{ color: 'var(--text3)', opacity: 0.4 }}>SELECT A PATH</span>
          </motion.div>
        </div>
      )}
    </section>
  );
}
