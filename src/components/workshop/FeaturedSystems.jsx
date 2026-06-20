import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SYSTEMS from '@/data/systems';
import { getAllTools } from '@/utils/tools';

const DOMAIN_COLORS = { AI: '#8b5cf6', Trading: '#f59e0b', Automations: '#06b6d4', Restaurant: '#f97316', Development: '#3b82f6' };

function SystemCard({ sys, onSelectSystem, isActive }) {
  const color = DOMAIN_COLORS[sys.domain] || sys.color;
  const allTools = getAllTools();
  const tools = sys.stack
    .map(s => ({ ...s, tool: allTools.find(t => t.id === s.toolId) }))
    .filter(s => s.tool);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl flex-shrink-0 transition-all duration-300 ${isActive ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}`}
      style={{
        width: 300,
        background: 'var(--card)',
        border: `1px solid ${isActive ? `${color}40` : 'var(--border)'}`,
        boxShadow: isActive ? `var(--shadow-lg), 0 0 40px ${color}10` : 'var(--shadow-md)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Gradient header */}
      <div className="h-24 rounded-t-2xl flex items-end p-5" style={{
        background: `linear-gradient(135deg, ${color}20, ${color}08)`,
      }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <span style={{ fontSize: 22 }}>{sys.icon}</span>
          </div>
          <div>
            <div className="font-semibold tracking-tight" style={{ fontSize: 15 }}>{sys.name}</div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: color }}>{sys.domain} · {sys.setup}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>
          {sys.shortDesc || sys.description?.slice(0, 100)}
        </p>

        {/* Workflow chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sys.workflow.slice(0, 3).map((w, wi) => (
            <div key={wi} className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: `${color}06`, border: `1px solid ${color}12` }}>
              <span style={{ fontSize: 10 }}>{w.icon}</span>
              <span className="text-[10px]" style={{ color: 'var(--text2)' }}>{w.stage}</span>
            </div>
          ))}
          {sys.workflow.length > 3 && (
            <span className="text-[9px] font-mono px-1.5 py-1 rounded-lg" style={{ background: `${color}06`, color: 'var(--text3)' }}>
              +{sys.workflow.length - 3}
            </span>
          )}
        </div>

        {/* Tool icons */}
        <div className="flex items-center gap-1.5 mb-4">
          {tools.slice(0, 4).map((item) => (
            <div key={item.toolId} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}08`, border: `1px solid ${color}12`, fontSize: 12 }}>
              {item.tool?.icon || '🔧'}
            </div>
          ))}
          {tools.length > 4 && (
            <span className="text-[9px] font-mono" style={{ color: 'var(--text3)' }}>+{tools.length - 4}</span>
          )}
        </div>

        <button
          onClick={() => onSelectSystem(sys.id)}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] w-full justify-center"
          style={{ background: color, color: '#fff' }}
        >
          Build this system
          <ArrowRight size={11} />
        </button>
      </div>
    </motion.div>
  );
}

export default function FeaturedSystems({ onSelectSystem }) {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / 316);
    setActiveIdx(idx);
  };

  return (
    <section className="relative py-28 md:py-36 overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.2] pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-16 px-6">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] font-medium tracking-[0.2em] mb-4"
            style={{ color: 'var(--text3)' }}
          >
            FEATURED SYSTEMS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', letterSpacing: '-0.03em' }}
          >
            Complete systems, <span className="text-gradient">ready to build</span>
          </motion.h2>
        </div>

        {/* Horizontal scroll rail */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-6 px-6 no-scrollbar"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {SYSTEMS.map((sys, i) => (
            <SystemCard key={sys.id} sys={sys} onSelectSystem={onSelectSystem} isActive={activeIdx === i} />
          ))}
        </div>

        {/* Scroll dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {SYSTEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => { scrollRef.current?.scrollTo({ left: i * 316, behavior: 'smooth' }); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: activeIdx === i ? 20 : 6,
                height: 6,
                background: activeIdx === i ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}