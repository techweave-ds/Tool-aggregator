import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SYSTEMS from '@/data/systems';
import { getAllTools } from '@/utils/tools';

const DOMAIN_COLORS = { AI:'#8b5cf6', Trading:'#f59e0b', Automations:'#06b6d4', Restaurant:'#f97316', Development:'#3b82f6' };

export default function FeaturedSystems({ onSelectSystem }) {
  const [activeId, setActiveId] = useState(null);
  const allTools = getAllTools();
  const railRef = useRef(null);

  function scroll(dir) {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border2)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 65%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span className="font-mono text-[10px] font-medium tracking-[0.18em]" style={{ color: 'var(--accent)' }}>FEATURED SYSTEMS</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.06 }} className="font-display leading-[1.1]"
              style={{ fontSize: 'clamp(24px, 3vw, 38px)', letterSpacing: '-0.04em', color: 'var(--text)' }}>
              Complete systems,{' '}
              <span className="text-gradient">ready to build</span>
            </motion.h2>
          </div>
          {/* Scroll arrows */}
          <div className="hidden md:flex items-center gap-2 mb-1">
            <button onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-md"
              style={{ background: 'white', border: '1px solid var(--border2)', boxShadow: 'var(--shadow-sm)', color: 'var(--text2)' }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll(1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:shadow-md"
              style={{ background: 'white', border: '1px solid var(--border2)', boxShadow: 'var(--shadow-sm)', color: 'var(--text2)' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll rail */}
        {SYSTEMS.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-medium" style={{ color: 'var(--text2)' }}>No featured systems yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>Systems will be available once added to the catalog</p>
          </div>
        ) : (
        <div ref={railRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4" style={{ scrollSnapType: 'x mandatory' }}>
          {SYSTEMS.map((sys, i) => {
            const color = DOMAIN_COLORS[sys.domain] || sys.color;
            const isActive = activeId === sys.id;
            const tools = sys.stack.map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) })).filter(s => s.tool);

            return (
              <motion.div key={sys.id}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.05 + i * 0.07 }}
                className="shrink-0 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  width: 280,
                  scrollSnapAlign: 'start',
                  background: 'white',
                  border: `1.5px solid ${isActive ? color + '40' : 'rgba(0,0,0,0.07)'}`,
                  boxShadow: isActive ? `var(--shadow-xl), 0 0 0 1px ${color}15` : 'var(--shadow-sm)',
                  transform: isActive ? 'translateY(-4px)' : 'none',
                }}
                onClick={() => setActiveId(isActive ? null : sys.id)}
              >
                {/* Color header band */}
                <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />

                <div className="p-5">
                  {/* System header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}12` }}>
                      <span style={{ fontSize: 18 }}>{sys.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{sys.name}</div>
                      <div className="font-mono text-[9px] mt-0.5" style={{ color }}>
                        {sys.domain} · {tools.length} tools
                      </div>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--text2)' }}>{sys.shortDesc || sys.description}</p>

                  {/* Workflow mini-steps */}
                  <div className="flex items-center gap-1 flex-wrap mb-4">
                    {sys.workflow.slice(0, 4).map((w, wi) => (
                      <div key={wi} className="flex items-center gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                          style={{ background: `${color}10`, color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {w.icon} {w.stage}
                        </span>
                        {wi < Math.min(sys.workflow.length - 1, 3) && (
                          <ArrowRight size={8} style={{ color: `${color}60` }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tool chips */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tools.slice(0, 4).map(item => (
                      <span key={item.toolId} className="text-[10px] px-2 py-0.5 rounded-lg"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--text2)' }}>
                        {item.tool?.icon} {item.tool?.name}
                      </span>
                    ))}
                    {tools.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg" style={{ color: 'var(--text3)' }}>+{tools.length - 4}</span>
                    )}
                  </div>

                  {/* Setup badge + CTA */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] px-2 py-1 rounded-lg"
                      style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>
                      {sys.setup}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectSystem(sys.id); }}
                      className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                      style={{ background: color, color: '#fff', boxShadow: `0 4px 12px ${color}30`, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      Build
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${color}15` }}>
                        <p className="text-xs leading-relaxed mt-3" style={{ color: 'var(--text2)' }}>{sys.description}</p>
                        <p className="text-[10px] mt-2" style={{ color: 'var(--text3)' }}>Ideal for: {sys.ideal}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        )}

        {/* Scroll dots indicator */}
        <div className="flex justify-center gap-1.5 mt-5">
          {SYSTEMS.map((sys, i) => (
            <div key={i} className="h-1 rounded-full transition-all duration-300"
              style={{
                width: activeId === sys.id ? 20 : 6,
                background: activeId === sys.id ? 'var(--accent)' : 'var(--border2)',
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}
