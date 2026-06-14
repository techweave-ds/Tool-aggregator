import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GOALS } from '@/data/systems';

export default function BuildPaths({ onSelectSystem, selectedId }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--os-surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-4"
            style={{ color: 'var(--os-text3)', letterSpacing: '0.15em' }}
          >
            EXPLORE BY GOAL
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            What do you want to <span className="text-gradient">achieve?</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {GOALS.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <button
                onClick={() => setExpanded(expanded === goal.id ? null : goal.id)}
                className="w-full text-left p-4 md:p-5 rounded-xl transition-all duration-300"
                style={{
                  background: expanded === goal.id ? `${goal.color}08` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${expanded === goal.id ? `${goal.color}30` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                    style={{ background: `${goal.color}15` }}
                  >
                    <span style={{ fontSize: 18 }}>{goal.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold" style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', color: 'var(--os-text)' }}>
                      {goal.name}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--os-text3)' }}>{goal.description}</div>
                  </div>
                  <ChevronRight
                    size={18}
                    style={{
                      color: goal.color,
                      transform: expanded === goal.id ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                    }}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expanded === goal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 pl-14 pr-4 pb-3">
                      {goal.pathways.map((path) => (
                        <button
                          key={path.systemId}
                          onClick={() => {
                            onSelectSystem(path.systemId);
                            const el = document.getElementById('workshop-top');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg transition-all text-left group"
                          style={{
                            background: selectedId === path.systemId ? `${goal.color}10` : 'transparent',
                            border: `1px solid ${selectedId === path.systemId ? `${goal.color}25` : 'transparent'}`,
                          }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: goal.color }} />
                          <span className="text-sm" style={{ color: 'var(--os-text2)', transition: 'color 0.2s' }}>
                            {path.label}
                          </span>
                          <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: goal.color }} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
