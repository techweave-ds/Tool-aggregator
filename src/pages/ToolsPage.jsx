import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, LayoutGrid, List, Pin, Heart, Plus, Orbit, SlidersHorizontal } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { getAllTools, getToolHealth, getHealthColor, getHealthLabel } from '@/utils/tools';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { usePinnedContext } from '@/context/PinnedContext';
import { useRecentToolsContext } from '@/context/RecentToolsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AddToolModal from '@/components/ui/AddToolModal';
import ToolConstellation from '@/components/ui/ToolConstellation';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };
const CATS = ['All','Trading','AI','Development','Utilities','Restaurant','Automations','Archive'];
const STATUSES = ['All','Production','Beta','Alpha','Archived'];

function ToolCard({ tool, index }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isPinned, togglePin } = usePinnedContext();
  const { trackOpen } = useRecentToolsContext();
  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || '#6366f1';
  const fav = isFavorite(tool.id);
  const pin = isPinned(tool.id);
  const isNew = tool.changelog?.[0]?.date && (Date.now() - new Date(tool.changelog[0].date).getTime() < 30*24*60*60*1000);

  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: index*0.025, duration:0.35 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-250"
      style={{
        background: 'white',
        border: `1.5px solid ${pin ? c+'40' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: pin ? `var(--shadow-md), 0 0 0 1px ${c}15` : 'var(--shadow-sm)',
        borderTop: `3px solid ${c}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 0 1px ${c}15`;
        e.currentTarget.style.borderColor = `${c}35`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = pin ? `var(--shadow-md)` : 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = pin ? `${c}40` : 'rgba(0,0,0,0.07)';
      }}
    >
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${c}12` }}>
              <Icon size={16} style={{ color:c }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight" style={{ color:'var(--text)', fontFamily:'Plus Jakarta Sans, sans-serif' }}>{tool.name}</h3>
                {isNew && <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md" style={{ background:`${c}20`, color:c }}>NEW</span>}
              </div>
              <p className="text-[10px] font-mono mt-0.5" style={{ color:c+'bb' }}>{tool.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
              style={{ background: pin ? `${c}20` : 'var(--bg)', border: '1px solid var(--border2)', color: pin ? c : 'var(--text3)' }}
              aria-label={pin ? 'Unpin' : 'Pin'}>
              <Pin size={10} fill={pin ? 'currentColor' : 'none'} />
            </button>
            <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
              style={{ background: fav ? 'rgba(239,68,68,0.1)' : 'var(--bg)', border: '1px solid var(--border2)', color: fav ? '#ef4444' : 'var(--text3)' }}
              aria-label={fav ? 'Unfavorite' : 'Favorite'}>
              <Heart size={10} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color:'var(--text2)' }}>{tool.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(tool.tags || []).slice(0,3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md"
              style={{ background:'var(--bg)', border:'1px solid var(--border2)', color:'var(--text3)' }}>{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${tool.status==='Production'?'dot-prod':tool.status==='Beta'?'dot-beta':tool.status==='Archived'?'bg-gray-400':'dot-alpha'}`} />
            <span className="font-mono text-[10px]" style={{ color:'var(--text3)' }}>
              {tool.status === 'Production' ? `v${tool.version}` : tool.status}
            </span>
            <div className="w-1 h-1 rounded-full" style={{ background: getHealthColor(getToolHealth(tool)), opacity: 0.7 }} />
          </div>
          <button
            onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }}
            className="text-xs font-bold px-2.5 py-1 rounded-xl transition-all hover:scale-[1.03]"
            style={{ background:`${c}12`, color:c, border:`1px solid ${c}25`, fontFamily:'Plus Jakarta Sans, sans-serif' }}>
            {tool.type==='internal' ? 'Launch' : 'Open'} ↗
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ToolRow({ tool, index }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isPinned, togglePin } = usePinnedContext();
  const { trackOpen } = useRecentToolsContext();
  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || '#6366f1';
  const fav = isFavorite(tool.id);

  return (
    <motion.div
      initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.018 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
      style={{ background:'white', border:'1px solid var(--border2)', boxShadow:'var(--shadow-xs)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${c}35`; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${c}12` }}>
        <Icon size={14} style={{ color:c }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color:'var(--text)', fontFamily:'Plus Jakarta Sans, sans-serif' }}>{tool.name}</p>
        <p className="text-xs truncate" style={{ color:'var(--text3)' }}>{tool.description}</p>
      </div>
      <div className="hidden md:flex items-center gap-1">
        {(tool.tags || []).slice(0,2).map(t => (
          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md" style={{ background:'var(--bg)', border:'1px solid var(--border2)', color:'var(--text3)' }}>{t}</span>
        ))}
      </div>
      <span className="hidden sm:block text-[9px] font-mono px-2 py-0.5 rounded-lg shrink-0" style={{ background:`${c}12`, color:c, border:`1px solid ${c}20` }}>{tool.category}</span>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'var(--bg)', border:'1px solid var(--border2)', color:'var(--text3)' }} aria-label="Pin"><Pin size={10} fill={isPinned(tool.id)?'currentColor':'none'} /></button>
        <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: fav?'rgba(239,68,68,0.1)':'var(--bg)', border:'1px solid var(--border2)', color: fav?'#ef4444':'var(--text3)' }} aria-label="Favorite"><Heart size={10} fill={fav?'currentColor':'none'} /></button>
        <button onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }} className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background:'var(--accent)', color:'#fff' }}>↗</button>
      </div>
    </motion.div>
  );
}

export default function ToolsPage() {
  const [params] = useSearchParams();
  const [cat, setCat] = useState(params.get('cat') || 'All');
  const [status, setStatus] = useState('All');
  const [q, setQ] = useState(params.get('q') || '');
  const [view, setView] = useLocalStorage('tools-view', 'grid');
  const [addOpen, setAddOpen] = useState(false);
  const [customTools, setCustomTools] = useState(() => { try { return JSON.parse(localStorage.getItem('custom-tools') || '[]'); } catch { return []; } });

  const allTools = getAllTools();

  const filtered = useMemo(() => allTools.filter(t => {
    const catOk    = cat === 'All' || t.category === cat;
    const statusOk = status === 'All' || t.status === status;
    const qOk      = !q || t.name.toLowerCase().includes(q.toLowerCase()) || (t.tags || []).some(tag => tag.toLowerCase().includes(q.toLowerCase()));
    return catOk && statusOk && qOk;
  }), [cat, status, q, allTools]);

  const catCounts = useMemo(() => {
    const m = {};
    allTools.forEach(t => { m[t.category] = (m[t.category] || 0) + 1; });
    return m;
  }, [allTools]);

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto flex gap-0">

        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r py-6 px-4"
          style={{ background: 'white', borderColor: 'var(--border2)' }}>
          <p className="font-mono text-[9px] tracking-widest mb-3 px-2" style={{ color: 'var(--text3)' }}>CATEGORIES</p>
          <div className="flex flex-col gap-0.5 mb-6">
            {CATS.map(c => {
              const color = CAT_COLORS[c] || 'var(--accent)';
              const active = cat === c;
              const count = c === 'All' ? allTools.length : (catCounts[c] || 0);
              return (
                <button key={c} onClick={() => setCat(c)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all"
                  style={{
                    background: active ? `${c === 'All' ? '#6366f1' : color}10` : 'transparent',
                    color: active ? (c === 'All' ? '#6366f1' : color) : 'var(--text2)',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                  {c !== 'All' && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />}
                  {c === 'All' && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />}
                  <span className="flex-1">{c}</span>
                  <span className="font-mono text-[9px]" style={{ color: 'var(--text3)' }}>{count}</span>
                </button>
              );
            })}
          </div>

          <p className="font-mono text-[9px] tracking-widest mb-3 px-2" style={{ color: 'var(--text3)' }}>STATUS</p>
          <div className="flex flex-col gap-0.5">
            {STATUSES.map(s => {
              const sc = { Production:'#22c55e', Beta:'#f59e0b', Alpha:'#6366f1', Archived:'#6b7280' }[s] || 'var(--accent)';
              const active = s === status;
              return (
                <button key={s} onClick={() => setStatus(s)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all"
                  style={{ background: active ? `${sc}10` : 'transparent', color: active ? sc : 'var(--text2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s === 'All' ? 'var(--text3)' : sc }} />
                  {s}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-6 py-6">
          {/* Top bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 flex-1 min-w-[200px] max-w-sm transition-all"
              style={{ background:'white', border:'1.5px solid var(--border2)', boxShadow:'var(--shadow-xs)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
              <Search size={13} style={{ color:'var(--text3)', flexShrink:0 }} />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search tools, tags…" className="flex-1 bg-transparent text-sm outline-none"
                style={{ color:'var(--text)', border:'none', boxShadow:'none' }} />
              {q && <button onClick={() => setQ('')} style={{ color:'var(--text3)' }}><X size={11} /></button>}
            </div>

            {/* Mobile category — visible only sm */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar lg:hidden">
              {CATS.slice(0,5).map(c => {
                const color = CAT_COLORS[c] || 'var(--accent)';
                const active = cat === c;
                return (
                  <button key={c} onClick={() => setCat(c)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all"
                    style={{ background: active ? (c==='All'?'var(--accent)':color) : 'white', color: active?'#fff':'var(--text2)', border:`1px solid ${active?'transparent':'var(--border2)'}`, boxShadow:'var(--shadow-xs)' }}>
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Result count + view toggle */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <span className="font-mono text-[10px]" style={{ color:'var(--text3)' }}>
                {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid var(--border2)', background:'white', boxShadow:'var(--shadow-xs)' }}>
                {[['grid', LayoutGrid], ['list', List], ['constellation', Orbit]].map(([id, Icon]) => (
                  <button key={id} onClick={() => setView(id)}
                    className="px-2.5 py-2 transition-colors"
                    style={{ background: view===id ? 'rgba(99,102,241,0.1)' : 'transparent', color: view===id ? 'var(--accent)' : 'var(--text3)' }}>
                    <Icon size={13} />
                  </button>
                ))}
              </div>
              <button onClick={() => setAddOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all hover:scale-[1.02]"
                style={{ background:'linear-gradient(135deg, var(--accent), var(--violet))', color:'#fff', boxShadow:'var(--glow-indigo)', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          {/* Active filters */}
          {(cat !== 'All' || status !== 'All' || q) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs" style={{ color:'var(--text3)' }}>Filters:</span>
              {cat !== 'All' && (
                <button onClick={() => setCat('All')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                  style={{ background:`${CAT_COLORS[cat]}12`, color:CAT_COLORS[cat], border:`1px solid ${CAT_COLORS[cat]}25` }}>
                  {cat} <X size={10} />
                </button>
              )}
              {status !== 'All' && (
                <button onClick={() => setStatus('All')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                  style={{ background:'var(--bg)', border:'1px solid var(--border2)', color:'var(--text2)' }}>
                  {status} <X size={10} />
                </button>
              )}
              {q && (
                <button onClick={() => setQ('')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                  style={{ background:'var(--bg)', border:'1px solid var(--border2)', color:'var(--text2)' }}>
                  "{q}" <X size={10} />
                </button>
              )}
              <button onClick={() => { setCat('All'); setStatus('All'); setQ(''); }}
                className="text-xs" style={{ color:'var(--text3)' }}>Clear all</button>
            </div>
          )}

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <div className="text-5xl mb-2">🔍</div>
              <p className="font-display font-bold text-xl" style={{ color:'var(--text)' }}>No tools found</p>
              <p className="text-sm" style={{ color:'var(--text2)' }}>Try adjusting your filters</p>
              <button onClick={() => { setCat('All'); setStatus('All'); setQ(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ background:'var(--accent)', color:'#fff', fontFamily:'Plus Jakarta Sans, sans-serif' }}>
                Clear filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((t,i) => <ToolCard key={t.id} tool={t} index={i} />)}
            </div>
          ) : view === 'constellation' ? (
            <div>
              <p className="text-xs font-mono mb-4" style={{ color:'var(--text3)' }}>
                Drag nodes · zoom · click to navigate tool relationships
              </p>
              <ToolConstellation onClose={undefined} />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filtered.map((t,i) => <ToolRow key={t.id} tool={t} index={i} />)}
            </div>
          )}
        </main>
      </div>

      <AddToolModal open={addOpen} onClose={() => setAddOpen(false)}
        onAdd={t => {
          const updated = [...customTools, t];
          setCustomTools(updated);
          localStorage.setItem('custom-tools', JSON.stringify(updated));
        }} />
    </div>
  );
}
