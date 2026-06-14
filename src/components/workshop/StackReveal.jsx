import { motion } from 'framer-motion';
import { getAllTools } from '@/utils/tools';
import { ArrowRight } from 'lucide-react';

const CAT_COLORS = { Trading: '#f59e0b', AI: '#8b5cf6', Development: '#3b82f6', Utilities: '#22c55e', Restaurant: '#f97316', Automations: '#06b6d4', Archive: '#6b7280' };
function getCatColor(cat) { return CAT_COLORS[cat] || '#6366f1'; }

export default function StackReveal({ system }) {
  if (!system) return null;

  const allTools = getAllTools();
  const tools = system.stack
    .map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) }))
    .filter(s => s.tool);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: 'var(--os-bg)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-3"
            style={{ color: system.color, letterSpacing: '0.15em' }}
          >
            THE STACK
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(22px, 3vw, 36px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            Tools that power{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
        </div>

        {/* Stack modules */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {tools.map((item, i) => {
            const tool = item.tool;
            const catColor = tool ? getCatColor(tool.category) : system.color;
            return (
              <div key={i} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + i * 0.1 }}
                  className="relative w-full md:w-56 p-5 rounded-[14px] transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `${catColor}06`,
                    border: `1px solid ${catColor}18`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0" style={{ background: `${catColor}16` }}>
                      <span style={{ fontSize: 15 }}>{tool.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--os-text)' }}>{tool.name}</div>
                    </div>
                  </div>
                  <div className="mb-1.5">
                    <div className="text-xs font-medium mb-0.5" style={{ color: catColor }}>{item.purpose}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--os-text3)' }}>{item.capability}</div>
                  </div>
                  <div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: catColor, boxShadow: `0 0 6px ${catColor}35` }}
                  />
                </motion.div>
                {i < tools.length - 1 && (
                  <div className="flex items-center justify-center py-1 md:px-1.5 md:py-0" style={{ color: `${catColor}40` }}>
                    <ArrowRight size={16} className="hidden md:block" />
                    <svg className="md:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(90deg)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-10 p-4 rounded-[12px] flex flex-wrap items-center justify-center gap-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', maxWidth: 420 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>Setup</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{system.setup}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>Best for</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{system.ideal}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>Tools</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{tools.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
