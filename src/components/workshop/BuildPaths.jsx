import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GOALS } from '@/data/systems';

const DOMAIN_COLORS = { AI: '#8b5cf6', Trading: '#f59e0b', Automations: '#06b6d4', Restaurant: '#f97316', Development: '#3b82f6', Marketing: '#ec4899' };

export default function BuildPaths({ onSelectSystem }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.25] pointer-events-none" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {GOALS.map((goal, i) => {
            const isExpanded = expanded === goal.id;
            const color = DOMAIN_COLORS[goal.domain] || goal.color || 'var(--accent)';
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 + i * 0.04 }}
                className="rounded-2xl transition-all duration-300 flex flex-col"
                style={{
                  background: 'var(--card)',
                  border: `1px solid ${isExpanded ? `${color}30` : 'var(--border)'}`,
                  boxShadow: isExpanded ? `var(--shadow-md), 0 0 30px ${color}08` : 'var(--shadow-sm)',
                  borderLeft: `4px solid ${color}`,
                }}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : goal.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0" style={{ background: `${color}10` }}>
                    <span style={{ fontSize: 22 }}>{goal.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold tracking-tight" style={{ fontSize: 'clamp(14px, 1.1vw, 16px)' }}>
                      {goal.name}
                    </div>
                    <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text2)' }}>{goal.description}</div>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{
                      color: color,
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                      opacity: 0.5,
                    }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ maxHeight: isExpanded ? 300 : 0, opacity: isExpanded ? 1 : 0 }}
                >
                  <div className="flex flex-col gap-1.5 px-5 pb-5 pt-0">
                    {goal.pathways.map((path) => (
                      <button
                        key={path.systemId}
                        onClick={() => onSelectSystem(path.systemId)}
                        className="flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group hover:bg-opacity-50"
                        style={{ background: isExpanded ? `${color}04` : 'transparent' }}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, opacity: 0.4 }} />
                        <span className="text-sm flex-1" style={{ color: 'var(--text2)' }}>{path.label}</span>
                        <ChevronRight size={12} className="transition-all duration-200 group-hover:translate-x-0.5" style={{ color: color, opacity: 0.3, flexShrink: 0 }} />
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