import { motion } from 'framer-motion';
import { getAllTools } from '@/utils/tools';
import { ArrowRight } from 'lucide-react';

export default function StackReveal({ system }) {
  if (!system) return null;

  const allTools = getAllTools();
  const tools = system.stack
    .map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) }))
    .filter(s => s.tool);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--os-bg)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-4"
            style={{ color: `${system.color}`, letterSpacing: '0.15em' }}
          >
            THE STACK
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            Tools that power{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
        </div>

        {/* Connected stack modules */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-0">
          {tools.map((item, i) => {
            const tool = item.tool;
            const catColor = tool ? getCatColor(tool.category) : system.color;
            return (
              <div key={i} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="relative w-full md:w-56 p-5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `${catColor}08`,
                    border: `1px solid ${catColor}20`,
                    zIndex: tools.length - i,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                      style={{ background: `${catColor}18` }}
                    >
                      <span style={{ fontSize: 16 }}>{tool.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--os-text)' }}>{tool.name}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs font-medium mb-1" style={{ color: catColor }}>{item.purpose}</div>
                    <div className="text-xs" style={{ color: 'var(--os-text3)' }}>{item.capability}</div>
                  </div>
                  {item.role && (
                    <div className="text-xs mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--os-text3)' }}>
                      Role: {item.role}
                    </div>
                  )}
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ background: catColor, boxShadow: `0 0 8px ${catColor}40` }}
                  />
                </motion.div>
                {i < tools.length - 1 && (
                  <div className="flex items-center justify-center py-2 md:px-2 md:py-0">
                    <ArrowRight size={18} className="hidden md:block" style={{ color: `${catColor}50` }} />
                    <svg className="md:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={`${catColor}50`} strokeWidth="2" style={{ transform: 'rotate(90deg)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* System summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-12 p-5 rounded-xl flex flex-wrap items-center justify-center gap-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', maxWidth: 480 }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: 'var(--os-text3)' }}>Setup</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{system.setup}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: 'var(--os-text3)' }}>Best for</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{system.ideal}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs" style={{ color: 'var(--os-text3)' }}>Tools</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--os-text)' }}>{tools.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const CAT_COLORS = { Trading: '#f59e0b', AI: '#8b5cf6', Development: '#3b82f6', Utilities: '#22c55e', Restaurant: '#f97316', Automations: '#06b6d4', Archive: '#6b7280' };
function getCatColor(cat) { return CAT_COLORS[cat] || '#6366f1'; }
