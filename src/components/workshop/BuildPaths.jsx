import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GOALS } from '@/data/systems';

export default function BuildPaths({ onSelectSystem }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] font-medium tracking-[0.2em] mb-4"
            style={{ color: 'var(--text3)' }}
          >
            EXPLORE BY GOAL
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', letterSpacing: '-0.03em' }}
          >
            What do you want to <span className="text-gradient">achieve?</span>
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          {GOALS.map((goal, i) => {
            const isExpanded = expanded === goal.id;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 + i * 0.035 }}
                className="rounded-[14px] transition-all duration-300"
                style={{
                  background: isExpanded ? `${goal.color}04` : 'rgba(255,255,255,0.015)',
                  border: `1px solid ${isExpanded ? `${goal.color}20` : 'rgba(255,255,255,0.04)'}`,
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : goal.id)}
                  className="w-full text-left p-4 md:p-5 flex items-center gap-4"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-[12px] shrink-0" style={{ background: `${goal.color}12` }}>
                    <span style={{ fontSize: 18 }}>{goal.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold tracking-tight" style={{ fontSize: 'clamp(14px, 1.1vw, 16px)' }}>
                      {goal.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{goal.description}</div>
                  </div>
                  <ChevronRight
                    size={17}
                    style={{
                      color: goal.color,
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                      opacity: 0.4,
                    }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ maxHeight: isExpanded ? 300 : 0, opacity: isExpanded ? 1 : 0 }}
                >
                  <div className="flex flex-col gap-1 pl-[60px] pr-4 pb-4 pt-1">
                    {goal.pathways.map((path) => (
                      <button
                        key={path.systemId}
                        onClick={() => onSelectSystem(path.systemId)}
                        className="flex items-center gap-3 p-2.5 rounded-[10px] transition-all text-left group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: goal.color, opacity: 0.4 }} />
                        <span className="text-sm" style={{ color: 'var(--text2)' }}>{path.label}</span>
                        <ChevronRight size={12} className="ml-auto transition-all duration-200" style={{ color: goal.color, opacity: 0, flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
