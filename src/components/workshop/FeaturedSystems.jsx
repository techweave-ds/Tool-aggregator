import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import SYSTEMS from '@/data/systems';
import { getAllTools } from '@/utils/tools';

const DOMAIN_COLORS = { AI: '#8b5cf6', Trading: '#f59e0b', Automations: '#06b6d4', Restaurant: '#f97316', Development: '#3b82f6' };

export default function FeaturedSystems({ onSelectSystem }) {
  const [expanded, setExpanded] = useState(null);
  const allTools = getAllTools();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--os-bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-4"
            style={{ color: 'var(--os-text3)', letterSpacing: '0.15em' }}
          >
            FEATURED SYSTEMS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            Complete systems, <span className="text-gradient">ready to build</span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {SYSTEMS.map((sys, i) => {
            const color = DOMAIN_COLORS[sys.domain] || sys.color;
            const isOpen = expanded === sys.id;
            const tools = sys.stack
              .map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) }))
              .filter(s => s.tool);

            return (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + i * 0.04 }}
              >
                <div
                  className="rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: isOpen ? `${color}06` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isOpen ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {/* Header (always visible) */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : sys.id)}
                    className="w-full text-left p-4 md:p-5 flex items-center gap-4"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                      style={{ background: `${color}15` }}
                    >
                      <span style={{ fontSize: 18 }}>{sys.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold" style={{ fontSize: 'clamp(14px, 1.1vw, 15px)', color: 'var(--os-text)' }}>
                        {sys.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--os-text3)' }}>{sys.shortDesc}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 mr-2">
                      <span className="text-xs font-mono" style={{ color: 'var(--os-text3)' }}>{tools.length} tools</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full`} style={{ background: `${color}12`, color: color }}>
                        {sys.setup}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      style={{
                        color,
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-5 pb-5 pt-0 border-t border-transparent" style={{ borderTopColor: `${color}10` }}>
                          <p className="text-sm leading-relaxed mb-4 mt-4" style={{ color: 'var(--os-text2)' }}>
                            {sys.description}
                          </p>

                          {/* Workflow preview */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {sys.workflow.map((w, wi) => (
                              <div key={wi} className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
                                  <span style={{ fontSize: 12 }}>{w.icon}</span>
                                  <span className="text-xs" style={{ color: 'var(--os-text2)' }}>{w.stage}</span>
                                </div>
                                {wi < sys.workflow.length - 1 && (
                                  <ArrowRight size={12} style={{ color: `${color}30` }} />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Stack preview */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {tools.map((item) => (
                              <div key={item.toolId} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ fontSize: 12 }}>{item.tool?.icon}</span>
                                <span className="text-xs font-medium" style={{ color: 'var(--os-text)' }}>{item.tool?.name}</span>
                                <span className="text-xs" style={{ color: 'var(--os-text3)' }}>— {item.purpose}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                onSelectSystem(sys.id);
                                const el = document.getElementById('workshop-top');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-[1.02]"
                              style={{ background: color, color: '#fff' }}
                            >
                              Build this system
                              <ArrowRight size={12} />
                            </button>
                            <span className="text-xs" style={{ color: 'var(--os-text3)' }}>
                              Ideal for: {sys.ideal}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
