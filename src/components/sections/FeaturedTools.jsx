import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Star, Zap } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import tools from '@/data/tools.json';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useRecentToolsContext } from '@/context/RecentToolsContext';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

const featured = tools.filter(t => t.status === 'Production').slice(0, 6);

export default function FeaturedTools() {
  const [active, setActive] = useState(featured[0]?.id);
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { trackOpen } = useRecentToolsContext();
  const navigate = useNavigate();
  const activeTool = featured.find(t => t.id === active) || featured[0];

  return (
    <section className="py-24 px-6" style={{ background: 'var(--os-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="mb-12">
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--os-accent)' }}>03 / FEATURED</p>
          <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--os-text)' }}>
            Hand-picked, <span className="text-gradient">production-ready</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left list */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {featured.map((tool, i) => {
              const Icon = getIcon(tool.icon);
              const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
              const isActive = active === tool.id;
              return (
                <motion.button key={tool.id}
                  initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }} transition={{ delay: i*0.07 }}
                  onClick={() => setActive(tool.id)}
                  className="flex items-center gap-3 p-3.5 rounded-xl text-left w-full transition-all"
                  style={{
                    background: isActive ? `${c}12` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? c+'40' : 'rgba(255,255,255,0.05)'}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: c+'18' }}>
                    <Icon size={16} style={{ color: c }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--os-text)' }}>{tool.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--os-text3)' }}>{tool.category}</p>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />}
                </motion.button>
              );
            })}
          </div>

          {/* Right detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTool && (
                <motion.div key={activeTool.id}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                  transition={{ duration: 0.25 }}
                  className="h-full rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: 'var(--os-card)', border: '1px solid rgba(255,255,255,0.07)', minHeight: 320 }}
                >
                  {/* Color header */}
                  {(() => {
                    const c = CAT_COLORS[activeTool.category] || 'var(--os-accent)';
                    const Icon = getIcon(activeTool.icon);
                    const fav = isFavorite(activeTool.id);
                    return (
                      <>
                        <div className="relative h-48 flex items-center justify-center overflow-hidden"
                          style={{ background: `radial-gradient(ellipse at 50% 0%, ${c}22 0%, transparent 70%), var(--os-card2)` }}>
                          {/* Decorative grid */}
                          <div className="absolute inset-0 grid-bg opacity-30" />
                          {/* Big icon */}
                          <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                              style={{ background: `${c}20`, border: `1px solid ${c}35`, boxShadow: `0 8px 32px ${c}25` }}>
                              <Icon size={36} style={{ color: c }} />
                            </div>
                            <div className={`text-xs font-mono px-3 py-1 rounded-full ${activeTool.status === 'Production' ? 'badge-prod' : activeTool.status === 'Beta' ? 'badge-beta' : 'badge-alpha'}`}>
                              {activeTool.status} · v{activeTool.version}
                            </div>
                          </div>
                          {/* Fav button */}
                          <button
                            onClick={() => toggleFavorite(activeTool.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: fav ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)', color: fav ? '#ef4444' : 'var(--os-text3)' }}
                          >
                            <Star size={14} fill={fav ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--os-text)' }}>{activeTool.name}</h3>
                          <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--os-text2)' }}>{activeTool.description}</p>
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {activeTool.tags.map(tag => (
                              <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-md"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--os-text3)' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { trackOpen(activeTool.id); if (activeTool.url) window.open(activeTool.url, '_blank'); else navigate(`/tool/${activeTool.id}`); }}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                              style={{ background: `linear-gradient(135deg, ${c}, ${c}bb)`, color: '#fff' }}
                            >
                              <Zap size={14} /> Launch Tool
                            </button>
                            <button onClick={() => navigate(`/tool/${activeTool.id}`)}
                              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--os-text2)' }}>
                              Details
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
