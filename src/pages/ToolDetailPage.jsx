import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Star, Pin, Tag, GitBranch } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { getAllTools } from '@/utils/tools';
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
    <div className="pt-32 flex flex-col items-center gap-4" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <p className="font-display font-bold text-2xl" style={{ color:'var(--text3)' }}>Tool not found</p>
      <button onClick={() => navigate('/tools')} className="px-5 py-2.5 rounded-xl text-sm" style={{ background:'var(--accent)', color:'#fff' }}>Back to tools</button>
    </div>
  );

  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || 'var(--accent)';
  const fav = isFavorite(tool.id);
  const pin = isPinned(tool.id);

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/tools')}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
          style={{ color:'var(--text2)' }}>
          <ArrowLeft size={15} /> Back to tools
        </button>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          {/* Color banner */}
          <div className="h-32 rounded-3xl mb-6" style={{ background: `linear-gradient(135deg, ${c}20, ${c}08, transparent)`, border: `1px solid ${c}15` }} />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Hero card */}
              <div className="rounded-2xl p-6" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background:`${c}15`, border:`1px solid ${c}25`, boxShadow:`0 8px 32px ${c}15` }}>
                      <Icon size={30} style={{ color:c }} />
                    </div>
                    <div>
                      <h1 className="font-display font-bold text-2xl" style={{ color:'var(--text)' }}>{tool.name}</h1>
                      <p className="text-sm font-mono mt-1" style={{ color:c }}>{tool.category}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed" style={{ color:'var(--text2)' }}>{tool.description}</p>

                <div className="flex items-center gap-3 mt-5 flex-wrap">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${tool.status==='Production'?'badge-prod':tool.status==='Beta'?'badge-beta':'badge-alpha'}`}>
                    {tool.status} · v{tool.version}
                  </span>
                  {(tool.tags || []).map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ background:'rgba(0,0,0,0.03)', border:'1px solid var(--border2)', color:'var(--text3)' }}>
                      <Tag size={9} />{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Changelog */}
              <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-xs font-mono tracking-widest mb-4" style={{ color:'var(--text3)' }}>CHANGELOG</p>
                <div className="space-y-4">
                  {(tool.changelog || []).length > 0 ? (tool.changelog || []).map((entry, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: i===0 ? c : 'var(--text3)' }} />
                        {i < (tool.changelog||[]).length - 1 && <div className="w-px flex-1 mt-1" style={{ background:'var(--border)' }} />}
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
                  )) : (
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>No changelog available</p>
                  )}
                </div>
              </div>

              {/* Relationships */}
              <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <ToolRelationships toolId={tool.id} />
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Actions */}
              <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-xs font-mono tracking-widest mb-4" style={{ color:'var(--text3)' }}>ACTIONS</p>
                <div className="space-y-2">
                  <button
                    onClick={() => { trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:shadow-md"
                    style={{ background:`linear-gradient(135deg, ${c}, ${c}bb)`, color:'#fff', boxShadow:`0 4px 20px ${c}30` }}>
                    <ExternalLink size={12} /> {tool.type==='internal' ? 'Launch Tool' : 'Open Tool'}
                  </button>
                  <button onClick={() => togglePin(tool.id)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ background: pin ? c+'15' : 'rgba(0,0,0,0.03)', color: pin ? c : 'var(--text2)', border:`1px solid ${pin ? c+'30' : 'var(--border)'}` }}>
                    <Pin size={12} /> {pin ? 'Pinned' : 'Pin to sidebar'}
                  </button>
                  <button onClick={() => toggleFavorite(tool.id)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                    style={{ background: fav ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.03)', color: fav ? '#ef4444' : 'var(--text2)', border:`1px solid ${fav ? '#ef444430' : 'var(--border)'}` }}>
                    <Star size={12} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved to favorites' : 'Add to favorites'}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <p className="text-xs font-mono tracking-widest mb-4" style={{ color:'var(--text3)' }}>INFO</p>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color:'var(--text3)' }}>Category</span>
                    <span className="font-medium" style={{ color:c }}>{tool.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color:'var(--text3)' }}>Status</span>
                    <span className="font-medium">{tool.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color:'var(--text3)' }}>Version</span>
                    <span className="font-medium">v{tool.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color:'var(--text3)' }}>Type</span>
                    <span className="font-medium">{tool.type}</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="rounded-2xl p-5" style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
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
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}