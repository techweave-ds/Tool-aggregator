import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Star, Pin, Tag, GitBranch } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { getAllTools, getToolHealth, getHealthColor, getHealthLabel } from '@/utils/tools';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { usePinnedContext } from '@/context/PinnedContext';
import { useRecentToolsContext } from '@/context/RecentToolsContext';
import useDiscoveryStore from '@/stores/discoveryStore';
import ToolRelationships from '@/components/ui/ToolRelationships';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tool = getAllTools().find(t => t.id === id);
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isPinned, togglePin } = usePinnedContext();
  const { trackOpen } = useRecentToolsContext();
  const { trackView } = useDiscoveryStore();

  useEffect(() => { if (tool) trackView(tool.id); }, [tool?.id]);

  if (!tool) return (
    <div className="pt-32 flex flex-col items-center gap-4">
      <p className="font-display font-bold text-2xl" style={{ color:'var(--text3)' }}>Tool not found</p>
      <button onClick={() => navigate('/tools')} className="px-5 py-2.5 rounded-xl text-sm" style={{ background:'var(--accent)', color:'#fff' }}>Back to tools</button>
    </div>
  );

  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || 'var(--accent)';
  const fav = isFavorite(tool.id);
  const pin = isPinned(tool.id);
  const health = getToolHealth(tool);
  const healthCol = getHealthColor(health);
  const healthLabel = getHealthLabel(health);

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/tools')}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color:'var(--text2)' }}>
          <ArrowLeft size={15} /> Back to tools
        </button>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          {/* Hero */}
          <div className="rounded-3xl overflow-hidden mb-6"
            style={{ background:`radial-gradient(ellipse at 50% 0%, ${c}15 0%, transparent 60%), var(--card)`, border:'1px solid rgba(0,0,0,0.06)' }}>
            <div className="p-8 pb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background:`${c}20`, border:`1px solid ${c}30`, boxShadow:`0 8px 32px ${c}20` }}>
                    <Icon size={30} style={{ color:c }} />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-2xl" style={{ color:'var(--text)' }}>{tool.name}</h1>
                    <p className="text-sm font-mono mt-1" style={{ color:c }}>{tool.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePin(tool.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{ background: pin ? c+'20' : 'rgba(0,0,0,0.05)', color: pin ? c : 'var(--text2)', border:`1px solid ${pin ? c+'40' : 'rgba(0,0,0,0.07)'}` }}>
                    <Pin size={12} /> {pin ? 'Pinned' : 'Pin'}
                  </button>
                  <button onClick={() => toggleFavorite(tool.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{ background: fav ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.05)', color: fav ? '#ef4444' : 'var(--text2)', border:`1px solid ${fav ? '#ef444440' : 'rgba(0,0,0,0.07)'}` }}>
                    <Star size={12} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => { trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background:`linear-gradient(135deg, ${c}, ${c}bb)`, color:'#fff', boxShadow:`0 4px 20px ${c}35` }}>
                    <ExternalLink size={12} /> {tool.type==='internal' ? 'Launch' : 'Open Tool'}
                  </button>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed max-w-2xl" style={{ color:'var(--text2)' }}>{tool.description}</p>

              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${tool.status==='Production'?'badge-prod':tool.status==='Beta'?'badge-beta':'badge-alpha'}`}>
                  {tool.status} · v{tool.version}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full"
                  style={{ background: `${healthCol}15`, color: healthCol, border: `1px solid ${healthCol}30` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: healthCol }} />
                  {healthLabel}
                </span>
                {(tool.tags || []).map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                    style={{ background:'var(--bg)', border:'1px solid rgba(0,0,0,0.07)', color:'var(--text3)' }}>
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Relationships */}
          <div className="mb-6 p-5 rounded-2xl" style={{ background:'var(--card)', border:'1px solid rgba(0,0,0,0.05)' }}>
            <ToolRelationships toolId={tool.id} />
          </div>

          {/* Links + Changelog */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Links */}
            <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid rgba(0,0,0,0.05)' }}>
              <p className="text-xs font-mono tracking-widest mb-4" style={{ color:'var(--text3)' }}>LINKS</p>
              <div className="space-y-2">
                {[['GitHub', tool.github, Github], ['Docs', tool.docs, ExternalLink], ['Demo', tool.demo, ExternalLink]].filter(([,v]) => v).map(([label, url, Icon]) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm py-2 transition-opacity hover:opacity-80"
                    style={{ color:'var(--text2)' }}>
                    <Icon size={13} style={{ color:c }} />
                    {label}
                    <ExternalLink size={10} style={{ color:'var(--text3)', marginLeft:'auto' }} />
                  </a>
                ))}
                {!tool.github && !tool.docs && !tool.demo && (
                  <p className="text-xs" style={{ color:'var(--text3)' }}>No links available</p>
                )}
              </div>
            </div>

            {/* Changelog */}
            <div className="md:col-span-2 rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid rgba(0,0,0,0.05)' }}>
              <p className="text-xs font-mono tracking-widest mb-4" style={{ color:'var(--text3)' }}>CHANGELOG</p>
              <div className="space-y-4">
                {(tool.changelog || []).map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: i===0 ? c : 'var(--text3)' }} />
                      {i < (tool.changelog||[]).length - 1 && <div className="w-px flex-1 mt-1" style={{ background:'rgba(0,0,0,0.07)' }} />}
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold" style={{ color: i===0 ? c : 'var(--text2)' }}>v{entry.version}</span>
                        <span className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>{entry.date}</span>
                      </div>
                      <ul className="space-y-0.5">
                        {entry.changes.map((ch, j) => (
                          <li key={j} className="text-xs" style={{ color:'var(--text2)' }}>· {ch}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
