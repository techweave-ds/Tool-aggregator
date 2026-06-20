import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, LayoutGrid, List, Pin, Heart, Plus, Orbit, Layers } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import { getAllTools } from '@/utils/tools';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { usePinnedContext } from '@/context/PinnedContext';
import { useRecentToolsContext } from '@/context/RecentToolsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AddToolModal from '@/components/ui/AddToolModal';
import ToolConstellation from '@/components/ui/ToolConstellation';
import SmartSearch from '@/components/ui/SmartSearch';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };
const CATS = ['All','Trading','AI','Development','Utilities','Restaurant','Automations','Archive'];
const STATUSES = ['All','Production','Beta','Alpha','Archived'];

function ToolCard({ tool, index }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isPinned, togglePin } = usePinnedContext();
  const { trackOpen } = useRecentToolsContext();
  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || 'var(--accent)';
  const fav = isFavorite(tool.id);
  const pin = isPinned(tool.id);
  const isNew = tool.changelog?.[0]?.date && (Date.now() - new Date(tool.changelog[0].date).getTime() < 30*24*60*60*1000);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: index*0.03, duration:0.35 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative flex flex-col rounded-2xl cursor-pointer overflow-hidden transition-all duration-300"
      style={{ background:'var(--card)', border:`1px solid ${pin ? c+'50' : 'var(--border)'}`, boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c+'40'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 30px ${c}12`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = pin ? c+'50' : 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* Colored top border */}
      <div className="h-[3px] transition-all duration-300" style={{ background: `linear-gradient(90deg, ${c}, ${c}40, transparent)` }} />

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:`${c}12` }}>
              <Icon size={17} style={{ color:c }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight" style={{ color:'var(--text)' }}>{tool.name}</h3>
                {isNew && <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background:`${c}20`, color:c }}>NEW</span>}
              </div>
              <p className="text-[10px] font-mono mt-0.5" style={{ color:c+'99' }}>{tool.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
              style={{ background: pin ? c+'20' : 'rgba(0,0,0,0.04)', color: pin ? c : 'var(--text3)' }}
              aria-label={pin ? 'Unpin tool' : 'Pin tool'}>
              <Pin size={11} fill={pin ? 'currentColor' : 'none'} />
            </button>
            <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
              style={{ background: fav ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.04)', color: fav ? '#ef4444' : 'var(--text3)' }}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
              <Heart size={11} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color:'var(--text2)' }}>
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(tool.tags || []).slice(0,3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
              style={{ background:'rgba(0,0,0,0.03)', border:'1px solid var(--border2)', color:'var(--text3)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${tool.status==='Production'?'dot-prod':tool.status==='Beta'?'dot-beta':tool.status==='Archived'?'bg-[#6b7280]':'dot-alpha'}`} />
            <span className="text-[10px] font-mono" style={{ color:'var(--text3)' }}>
              {tool.status === 'Production' ? `v${tool.version}` : tool.status}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }}
            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all hover:shadow-sm"
            style={{ background:`${c}12`, color:c, border:`1px solid ${c}25` }}
          >
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
  const c = CAT_COLORS[tool.category] || 'var(--accent)';
  const fav = isFavorite(tool.id);

  return (
    <motion.div
      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.02 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all hover:shadow-md"
      style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c+'35'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${c}12` }}>
        <Icon size={15} style={{ color:c }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color:'var(--text)' }}>{tool.name}</p>
        <p className="text-xs truncate" style={{ color:'var(--text3)' }}>{tool.description}</p>
      </div>
      <div className="hidden md:flex items-center gap-1">
          {(tool.tags || []).slice(0,2).map(t => (
          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ background:'rgba(0,0,0,0.03)', border:'1px solid var(--border2)', color:'var(--text3)' }}>{t}</span>
        ))}
      </div>
      <span className="hidden sm:block text-[9px] font-mono px-2 py-0.5 rounded shrink-0"
        style={{ background:c+'12', color:c }}>{tool.category}</span>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background:'rgba(0,0,0,0.04)', color:'var(--text3)' }}
          aria-label={isPinned(tool.id) ? 'Unpin tool' : 'Pin tool'}>
          <Pin size={11} fill={isPinned(tool.id) ? 'currentColor' : 'none'} />
        </button>
        <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: fav ? 'rgba(239,68,68,0.12)' : 'rgba(0,0,0,0.04)', color: fav ? '#ef4444' : 'var(--text3)' }}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}>
          <Heart size={11} fill={fav ? 'currentColor' : 'none'} />
        </button>
        <button onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          style={{ background:'var(--accent)', color:'#fff' }}>↗</button>
      </div>
    </motion.div>
  );
}

export default function ToolsPage() {
  const [params] = useSearchParams();
  const [cat, setCat] = useState(params.get('cat') || 'All');
  const [status, setStatus] = useState('All');
  const [q, setQ] = useState(params.get('q') || '');
  const [view, setView] = useLocalStorage('os-view', 'grid');
  const [addOpen, setAddOpen] = useState(false);
  const [customTools, setCustomTools] = useState(() => { try { return JSON.parse(localStorage.getItem('custom-tools') || '[]'); } catch { return []; } });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allTools = getAllTools();

  const filtered = useMemo(() => allTools.filter(t => {
    const catOk    = cat === 'All' || t.category === cat;
    const statusOk = status === 'All' || t.status === status;
    const qOk      = !q || t.name.toLowerCase().includes(q.toLowerCase()) || (t.tags || []).some(tag => tag.toLowerCase().includes(q.toLowerCase()));
    return catOk && statusOk && qOk;
  }), [cat, status, q, allTools]);

  const counts = useMemo(() => {
    const c = {};
    CATS.forEach(cat => {
      c[cat] = cat === 'All' ? allTools.length : allTools.filter(t => t.category === cat).length;
    });
    return c;
  }, [allTools]);

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-0'} transition-all duration-300 shrink-0 hidden lg:block`}>
          <div className="fixed top-16 bottom-0 w-56 pt-8 pb-6 overflow-y-auto no-scrollbar border-r" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5">
              <p className="text-[10px] font-mono tracking-widest mb-4" style={{ color: 'var(--text3)' }}>CATEGORIES</p>
              <div className="space-y-0.5">
                {CATS.map(c => {
                  const active = c === cat;
                  const color = CAT_COLORS[c] || 'var(--accent)';
                  return (
                    <button key={c} onClick={() => setCat(c)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: active ? `${color}10` : 'transparent',
                        color: active ? color : 'var(--text2)',
                        fontWeight: active ? 600 : 400,
                      }}>
                      {c !== 'All' && <div className="w-2 h-2 rounded-full" style={{ background: color, opacity: active ? 1 : 0.3 }} />}
                      <span className="flex-1 text-left">{c}</span>
                      <span className="text-[10px] font-mono" style={{ opacity: 0.5 }}>{counts[c]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] font-mono tracking-widest my-4" style={{ color: 'var(--text3)' }}>STATUS</p>
              <div className="space-y-0.5">
                {STATUSES.map(s => {
                  const a = s === status;
                  const sc = { Production:'#22c55e', Beta:'#f59e0b', Alpha:'#6366f1', Archived:'#6b7280' }[s] || 'var(--accent)';
                  return (
                    <button key={s} onClick={() => setStatus(s)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: a ? `${sc}10` : 'transparent',
                        color: a ? sc : 'var(--text2)',
                        fontWeight: a ? 600 : 400,
                      }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 px-6 space-y-6 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl" style={{ color:'var(--text)' }}>All Tools</h1>
              <p className="text-sm mt-1 font-mono" style={{ color:'var(--text3)' }}>
                {filtered.length} of {allTools.length} tools
              </p>
            </div>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0 hover:shadow-md transition-all"
              style={{ background:'var(--accent)', color:'#fff', boxShadow: 'var(--shadow-glow-indigo)' }}>
              <Plus size={14} /> Add Tool
            </button>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile category pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scroll lg:hidden">
              {CATS.slice(0, 5).map(c => {
                const active = c === cat;
                const color = CAT_COLORS[c] || 'var(--accent)';
                return (
                  <button key={c} onClick={() => setCat(c)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all"
                    style={{
                      background: active ? color : 'var(--card)',
                      color: active ? '#fff' : 'var(--text2)',
                      border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                    }}>
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-sm"
              style={{ background:'var(--card)', border:'1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <Search size={13} style={{ color:'var(--text3)', flexShrink:0 }} />
              <input value={q} onChange={e => setQ(e.target.value)}
                placeholder="Filter by name or tag…" className="flex-1 bg-transparent text-xs outline-none"
                style={{ color:'var(--text)', border:'none' }} />
              {q && <button onClick={() => setQ('')} style={{ color:'var(--text3)' }}><X size={11} /></button>}
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scroll">
              {STATUSES.slice(1).map(s => {
                const a = s === status;
                const sc = { Production:'#22c55e', Beta:'#f59e0b', Alpha:'#6366f1', Archived:'#6b7280' }[s] || 'var(--accent)';
                return (
                  <button key={s} onClick={() => setStatus(status === s ? 'All' : s)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium whitespace-nowrap shrink-0 transition-all"
                    style={{ background: a ? sc+'15' : 'var(--card)', color: a ? sc : 'var(--text3)', border:`1px solid ${a ? sc+'40' : 'var(--border)'}` }}>
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="flex rounded-xl overflow-hidden shrink-0"
              style={{ border:'1px solid var(--border)' }}>
              {[['grid', LayoutGrid], ['list', List], ['constellation', Orbit]].map(([id, Icon]) => (
                <button key={id} onClick={() => setView(id)}
                  className="px-3 py-2 transition-colors"
                  style={{ background: view===id ? 'rgba(99,102,241,0.1)' : 'transparent', color: view===id ? 'var(--accent)' : 'var(--text3)' }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-4">
              <p className="font-display font-bold text-2xl" style={{ color:'var(--text3)' }}>No tools found</p>
              <p className="text-sm" style={{ color:'var(--text3)' }}>Try a different filter</p>
              <button onClick={() => { setCat('All'); setStatus('All'); setQ(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background:'var(--accent)', color:'#fff' }}>
                Clear all filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((t,i) => <ToolCard key={t.id} tool={t} index={i} />)}
            </div>
          ) : view === 'constellation' ? (
            <div>
              <p className="text-xs font-mono mb-4" style={{ color: 'var(--text3)' }}>
                Explore the tool ecosystem — drag nodes, zoom, and click to discover relationships
              </p>
              <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                <ToolConstellation onClose={undefined} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t,i) => <ToolRow key={t.id} tool={t} index={i} />)}
            </div>
          )}
        </div>
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