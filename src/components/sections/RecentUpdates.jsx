import { motion } from 'framer-motion';
import tools from '@/data/tools.json';
import { getIcon } from '@/utils/icons';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

const recent = [...tools]
  .sort((a,b) => (b.changelog?.[0]?.date||'').localeCompare(a.changelog?.[0]?.date||''))
  .slice(0,6);

export default function RecentUpdates() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--os-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--os-accent)' }}>05 / UPDATES</p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--os-text)' }}>
              Recent <span className="text-gradient">releases</span>
            </h2>
          </div>
          <Link to="/tools" className="hidden md:flex items-center gap-1.5 text-sm" style={{ color: 'var(--os-accent)' }}>
            All tools <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.map((tool, i) => {
            const Icon = getIcon(tool.icon);
            const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
            const change = tool.changelog?.[0];
            return (
              <motion.div key={tool.id}
                initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.06 }}
              >
                <Link to={`/tool/${tool.id}`}
                  className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 block"
                  style={{ background: 'var(--os-card)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c+'40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c+'18' }}>
                    <Icon size={17} style={{ color: c }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text)' }}>{tool.name}</p>
                      <span className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded"
                        style={{ background: c+'15', color: c }}>
                        v{change?.version || tool.version}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--os-text3)' }}>
                      {change?.changes?.[0] || tool.description}
                    </p>
                    {change?.date && (
                      <p className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>
                        Updated {change.date}
                      </p>
                    )}
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
