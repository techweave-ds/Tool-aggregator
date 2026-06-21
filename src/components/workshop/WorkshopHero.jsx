import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import SYSTEMS from '@/data/systems';
import HeroOrbs from '@/components/ui/HeroOrbs';
import HeroCard3D from '@/components/ui/HeroCard3D';

const FLOATING_BADGES = [
  { label: 'Trading', icon: '📈', color: '#f59e0b', delay: 0, x: -320, y: -80 },
  { label: 'AI Tools', icon: '🤖', color: '#8b5cf6', delay: 0.4, x: 320, y: -60 },
  { label: 'Automation', icon: '⚡', color: '#06b6d4', delay: 0.8, x: -280, y: 100 },
  { label: 'Analytics', icon: '📊', color: '#3b82f6', delay: 1.2, x: 310, y: 110 },
  { label: 'Utilities', icon: '🔧', color: '#22c55e', delay: 0.2, x: -340, y: 20 },
  { label: 'Restaurant', icon: '🍽️', color: '#f97316', delay: 0.6, x: 340, y: 30 },
];

function FloatingBadge({ label, icon, color, delay, x, y }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="absolute hidden lg:flex items-center gap-1.5 select-none"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}30`,
        borderRadius: 20,
        padding: '6px 12px',
        boxShadow: `0 4px 12px rgba(15,23,42,0.08), 0 0 0 1px ${color}15`,
        animation: `float ${3.5 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        zIndex: 5,
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: 11, color: '#0f172a' }}>{label}</span>
    </motion.div>
  );
}

export default function WorkshopHero({ onSelect, selectedId }) {
  const [activeSystem, setActiveSystem] = useState(null);

  function handleSelect(sys) {
    setActiveSystem(sys.id === activeSystem ? null : sys.id);
    onSelect(sys.id === activeSystem ? null : sys.id);
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-8">
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <HeroOrbs />

      {/* Floating category badges */}
      {FLOATING_BADGES.map(b => <FloatingBadge key={b.label} {...b} />)}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 max-w-6xl mx-auto px-6 w-full">

        {/* Left: Text */}
        <div className="text-center lg:text-left flex-1 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <Zap size={11} style={{ color: 'var(--accent)' }} />
            <span className="font-mono text-[10px] font-medium tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
              WEAVESTACK PLATFORM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mb-5"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.045em',
              lineHeight: 1.05,
              color: 'var(--text)',
            }}
          >
            What are you<br />
            <span className="text-gradient">trying to build?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-base leading-relaxed mb-8"
            style={{ color: 'var(--text2)', maxWidth: 420 }}
          >
            Choose an outcome. We'll map the workflow and surface the exact tools you need.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-6 justify-center lg:justify-start"
          >
            {[['31', 'Tools'], ['8', 'Systems'], ['7', 'Categories']].map(([n, l]) => (
              <div key={l} className="text-center lg:text-left">
                <div className="font-display text-xl" style={{ color: 'var(--accent)', letterSpacing: '-0.03em' }}>{n}</div>
                <div className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex-shrink-0"
        >
          <HeroCard3D />
        </motion.div>
      </div>

      {/* System selector pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-12 max-w-5xl mx-auto px-6 w-full"
      >
        <p className="text-center font-mono text-[10px] tracking-[0.2em] mb-5" style={{ color: 'var(--text3)' }}>
          SELECT A SYSTEM TO EXPLORE
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {SYSTEMS.map((sys) => {
            const isSel = selectedId === sys.id;
            return (
              <motion.button
                key={sys.id}
                onClick={() => handleSelect(sys)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: isSel ? `${sys.color}15` : 'rgba(255,255,255,0.8)',
                  border: `1.5px solid ${isSel ? sys.color + '50' : 'rgba(0,0,0,0.08)'}`,
                  color: isSel ? sys.color : 'var(--text2)',
                  boxShadow: isSel ? `0 4px 16px ${sys.color}25, var(--shadow-sm)` : 'var(--shadow-xs)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <span style={{ fontSize: 15 }}>{sys.icon}</span>
                <span style={{ fontSize: 12 }}>{sys.name}</span>
                {isSel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: sys.color }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Scroll hint */}
      {!selectedId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ArrowRight size={14} style={{ color: 'var(--text3)', transform: 'rotate(90deg)' }} />
          </motion.div>
          <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: 'var(--text3)' }}>SCROLL TO EXPLORE</span>
        </motion.div>
      )}
    </section>
  );
}
