import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SYSTEMS from '@/data/systems';
import HeroOrbs from '@/components/ui/HeroOrbs';
import HeroCard3D from '@/components/ui/HeroCard3D';

export default function WorkshopHero({ onSelect, selectedId }) {
  const [hoveredTab, setHoveredTab] = useState(null);

  const selected = selectedId ? SYSTEMS.find(s => s.id === selectedId) : null;

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 select-none"
      style={{ background: 'var(--bg)' }}>
      {/* Background orbs */}
      <HeroOrbs count={3} />

      {/* Dot grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.35] pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-5xl mx-auto px-6">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] font-medium tracking-[0.2em]"
          style={{ color: 'var(--text3)' }}
        >
          WEAVESTACK
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center leading-[1.05]"
          style={{ fontSize: 'clamp(30px, 3.4vw, 42px)', letterSpacing: '-0.035em', color: 'var(--text)' }}
        >
          What are you<br />
          <span className="text-gradient">trying to build?</span>
        </motion.h1>

        {/* 3D Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroCard3D system={selected} />
        </motion.div>

        {/* Tab row — system selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {SYSTEMS.map((sys) => {
            const isSel = selectedId === sys.id;
            const isHov = hoveredTab === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => onSelect(isSel ? null : sys.id)}
                onMouseEnter={() => setHoveredTab(sys.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isSel ? `${sys.color}12` : isHov ? 'rgba(0,0,0,0.03)' : 'transparent',
                  border: `1px solid ${isSel ? `${sys.color}35` : isHov ? 'var(--border)' : 'transparent'}`,
                  color: isSel ? sys.color : isHov ? 'var(--text)' : 'var(--text2)',
                  boxShadow: isSel ? `0 0 20px ${sys.color}10` : 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>{sys.icon}</span>
                <span className="whitespace-nowrap">{sys.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-center"
          style={{ color: 'var(--text3)', maxWidth: 400 }}
        >
          {selected
            ? `Explore the ${selected.name} workflow and tool stack`
            : 'Select a system above to see its workflow and recommended tools'}
        </motion.p>

        {/* Scroll hint */}
        {!selectedId && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="flex flex-col items-center gap-2 mt-4"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="var(--text3)" strokeWidth="1.5" opacity="0.35">
              <path d="M7 2v18M7 20l-5-5M7 20l5-5" />
            </svg>
            <span className="text-[10px] font-mono tracking-[0.15em]" style={{ color: 'var(--text3)', opacity: 0.4 }}>SCROLL TO EXPLORE</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}