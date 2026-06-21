import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { GOALS } from '@/data/systems';

export default function BuildPaths({ onSelectSystem }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border2)' }}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
            <span className="font-mono text-[10px] font-medium tracking-[0.18em]" style={{ color: 'var(--accent)' }}>EXPLORE BY GOAL</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.06 }} className="font-display leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 3.2vw, 42px)', letterSpacing: '-0.04em', color: 'var(--text)' }}>
            What do you want to <span className="text-gradient">achieve?</span>
          </motion.h2>
        </div>

        {/* Goal cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {GOALS.map((goal, i) => {
            const isOpen = expanded === goal.id;
            return (
              <motion.div key={goal.id}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.05 + i * 0.06 }}
                className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  background: 'white',
                  border: `1.5px solid ${isOpen ? goal.color + '35' : 'rgba(0,0,0,0.07)'}`,
                  boxShadow: isOpen ? `var(--shadow-lg), 0 0 0 1px ${goal.color}15` : 'var(--shadow-sm)',
                  borderLeft: `4px solid ${goal.color}`,
                  transform: isOpen ? 'translateY(-2px)' : 'none',
                }}
                onClick={() => setExpanded(isOpen ? null : goal.id)}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${goal.color}12` }}>
                        <span style={{ fontSize: 20 }}>{goal.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-tight" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{goal.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{goal.pathways?.length || 0} paths</div>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={15} style={{ color: isOpen ? goal.color : 'var(--text3)' }} />
                    </motion.div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{goal.description}</p>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1" style={{ borderTop: `1px solid ${goal.color}15` }}>
                        <p className="font-mono text-[9px] tracking-widest mb-2.5 mt-3" style={{ color: goal.color }}>CHOOSE A PATH</p>
                        <div className="flex flex-col gap-1.5">
                          {(goal.pathways || []).map((path) => (
                            <button key={path.systemId}
                              onClick={(e) => { e.stopPropagation(); onSelectSystem(path.systemId); }}
                              className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all hover:scale-[1.01]"
                              style={{
                                background: `${goal.color}08`,
                                border: `1px solid ${goal.color}20`,
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = `${goal.color}14`}
                              onMouseLeave={e => e.currentTarget.style.background = `${goal.color}08`}
                            >
                              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: goal.color }} />
                              <span className="text-xs font-medium flex-1" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{path.label}</span>
                              <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5 shrink-0" style={{ color: goal.color }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
