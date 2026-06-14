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
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${system.color}03 0%, transparent 70%)`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] font-medium tracking-[0.2em] mb-4"
            style={{ color: system.color }}
          >
            THE STACK
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display leading-[1.1]"
            style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', letterSpacing: '-0.03em' }}
          >
            Tools that power{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-0 px-2">
          {tools.map((item, i) => {
            const tool = item.tool;
            const catColor = tool ? getCatColor(tool.category) : system.color;
            return (
              <div key={i} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="relative w-full md:w-60 p-5 rounded-[16px] transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `${catColor}04`,
                    border: `1px solid ${catColor}14`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-[12px] shrink-0" style={{ background: `${catColor}12` }}>
                      <span style={{ fontSize: 16 }}>{tool.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{tool.name}</div>
                    </div>
                  </div>
                  <div className="mb-1">
                    <div className="text-xs font-medium mb-0.5" style={{ color: catColor }}>{item.purpose}</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>{item.capability}</div>
                  </div>
                  <div
                    className="absolute -top-px -right-px w-2.5 h-2.5 rounded-full"
                    style={{ background: catColor, boxShadow: `0 0 6px ${catColor}30` }}
                  />
                </motion.div>
                {i < tools.length - 1 && (
                  <div className="flex items-center justify-center py-1.5 md:px-1 md:py-0" style={{ color: `${catColor}30` }}>
                    <ArrowRight size={15} className="hidden md:block" />
                    <svg className="md:hidden" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'rotate(90deg)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mx-auto mt-12 p-4 rounded-[12px] flex flex-wrap items-center justify-center gap-6"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: 440 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text3)' }}>Setup</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{system.setup}</span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text3)' }}>Best for</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{system.ideal}</span>
          </div>
          <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--text3)' }}>Tools</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{tools.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
