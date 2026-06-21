import { motion } from 'framer-motion';
import { getAllTools } from '@/utils/tools';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };
function cc(cat) { return CAT_COLORS[cat] || '#6366f1'; }

export default function StackReveal({ system }) {
  const navigate = useNavigate();
  if (!system) return null;
  const allTools = getAllTools();
  const tools = system.stack
    .map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) }))
    .filter(s => s.tool);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border2)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${system.color}05 0%, transparent 70%)`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
            style={{ background: `${system.color}10`, border: `1px solid ${system.color}25` }}
          >
            <span className="font-mono text-[10px] font-medium tracking-[0.15em]" style={{ color: system.color }}>THE STACK</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display"
            style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', letterSpacing: '-0.03em', color: 'var(--text)' }}
          >
            Tools that power{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
        </div>

        {/* Horizontal pipeline */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-3 md:gap-0">
          {tools.map((item, i) => {
            const tool = item.tool;
            const catColor = cc(tool.category);
            const isLast = i === tools.length - 1;
            return (
              <div key={i} className="flex flex-col md:flex-row items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + i * 0.1 }}
                  onClick={() => navigate(`/tool/${tool.id}`)}
                  className="group relative w-full md:w-auto flex-1 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'white',
                    border: `1px solid rgba(0,0,0,0.07)`,
                    boxShadow: 'var(--shadow-sm)',
                    borderTop: `3px solid ${catColor}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 0 1px ${catColor}20`;
                    e.currentTarget.style.borderColor = `${catColor}40`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)';
                  }}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: catColor, boxShadow: `0 2px 8px ${catColor}40` }}>
                    <span className="font-mono text-[9px] font-bold text-white">{i + 1}</span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                      style={{ background: `${catColor}12` }}>
                      <span style={{ fontSize: 17 }}>{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm leading-tight" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{tool.name}</div>
                      <div className="font-mono text-[9px] mt-0.5" style={{ color: catColor }}>{tool.category}</div>
                    </div>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" style={{ color: 'var(--text3)' }} />
                  </div>

                  <div className="text-xs font-semibold mb-1" style={{ color: catColor, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.purpose}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{item.capability}</div>
                </motion.div>

                {/* Arrow connector */}
                {!isLast && (
                  <div className="flex items-center justify-center mx-3 my-2 md:my-0 shrink-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                    >
                      <ArrowRight size={16} style={{ color: 'var(--text3)', transform: 'md:none rotate(90deg)' }} className="md:rotate-0 rotate-90" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View all tools CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate('/tools')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              color: 'var(--accent)',
              boxShadow: 'var(--shadow-sm)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Explore all {allTools.length} tools
            <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
