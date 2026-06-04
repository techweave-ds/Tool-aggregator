import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Code2, Wrench, UtensilsCrossed, Bot, Archive, ArrowRight } from 'lucide-react';
import tools from '@/data/tools.json';

const CATS = [
  { key: 'AI',          label: 'AI / LLM',    icon: Brain,          color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',  desc: 'Language models, prompts, and intelligent automation', span: 'col-span-2' },
  { key: 'Trading',     label: 'Trading',      icon: TrendingUp,     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  desc: 'Signals, scanners, and market analysis tools' },
  { key: 'Development', label: 'Development',  icon: Code2,          color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  desc: 'Debugging, code tools and dev utilities' },
  { key: 'Automations', label: 'Automations',  icon: Bot,            color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   desc: 'Workflows, bots, and scheduled pipelines', span: 'col-span-2' },
  { key: 'Utilities',   label: 'Utilities',    icon: Wrench,         color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   desc: 'Everyday productivity and conversion tools' },
  { key: 'Restaurant',  label: 'Restaurant',   icon: UtensilsCrossed, color: '#f97316', bg: 'rgba(249,115,22,0.08)', desc: 'Menu, orders, and kitchen management' },
  { key: 'Archive',     label: 'Archive',      icon: Archive,        color: '#6b7280', bg: 'rgba(107,114,128,0.08)', desc: 'Legacy and reference tools' },
];

export default function CategoryGrid() {
  const counts = tools.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {});

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--os-accent)' }}>02 / CATEGORIES</p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--os-text)' }}>
              Everything you need,<br />
              <span className="text-gradient">organised by purpose</span>
            </h2>
          </div>
          <Link to="/tools" className="hidden md:flex items-center gap-2 text-sm font-medium"
            style={{ color: 'var(--os-accent)' }}>
            All tools <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATS.map((cat, i) => {
            const Icon = cat.icon;
            const count = counts[cat.key] || 0;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className={cat.span || ''}
              >
                <Link to={`/tools?cat=${cat.key}`}
                  className="group flex flex-col h-full min-h-[160px] p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: cat.bg,
                    border: `1px solid ${cat.color}22`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + '55'; e.currentTarget.style.boxShadow = `0 16px 48px ${cat.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = cat.color + '22'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex items-start justify-between mb-auto">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: cat.color + '18' }}>
                      <Icon size={18} style={{ color: cat.color }} />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: cat.color + '15', color: cat.color }}>
                      {count}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base mb-1" style={{ color: 'var(--os-text)' }}>{cat.label}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text3)' }}>{cat.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: cat.color }}>
                    Explore <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
