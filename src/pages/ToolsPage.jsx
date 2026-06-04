import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, LayoutGrid, List, SlidersHorizontal, Plus } from 'lucide-react';
import { getIcon } from '@/utils/icons';
import tools from '@/data/tools.json';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { usePinnedContext } from '@/context/PinnedContext';
import { useRecentToolsContext } from '@/context/RecentToolsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AddToolModal from '@/components/ui/AddToolModal';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };
const CATS = ['All','Trading','AI','Development','Utilities','Restaurant','Automations','Archive'];
const STATUSES = ['All','Production','Beta','Alpha','Archived'];

function ToolCard({ tool, index }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { isPinned, togglePin } = usePinnedContext();
  const { trackOpen } = useRecentToolsContext();
  const Icon = getIcon(tool.icon);
  const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
  const fav = isFavorite(tool.id);
  const pin = isPinned(tool.id);
  const isNew = tool.changelog?.[0]?.date && (Date.now() - new Date(tool.changelog[0].date).getTime() < 30*24*60*60*1000);

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ delay: index*0.03, duration:0.35 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative flex flex-col rounded-2xl cursor-pointer overflow-hidden transition-all duration-300"
      style={{ background:'var(--os-card)', border:`1px solid ${pin ? c+'50' : 'rgba(255,255,255,0.06)'}` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c+'40'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${c}15`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = pin ? c+'50' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top accent line */}
      <div className="h-px transition-all duration-300 group-hover:h-[2px]"
        style={{ background: `linear-gradient(90deg, ${c}80, ${c}20, transparent)` }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background:`${c}18` }}>
              <Icon size={17} style={{ color:c }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight" style={{ color:'var(--os-text)' }}>{tool.name}</h3>
                {isNew && <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background:`${c}25`, color:c }}>NEW</span>}
              </div>
              <p className="text-[10px] font-mono mt-0.5" style={{ color:c+'99' }}>{tool.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all text-xs"
              style={{ background: pin ? c+'25' : 'rgba(255,255,255,0.06)', color: pin ? c : 'var(--os-text3)', fontSize: 11 }}>
              📌
            </button>
            <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all text-xs"
              style={{ background: fav ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', color: fav ? '#ef4444' : 'var(--os-text3)', fontSize: 11 }}>
              ♥
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed line-clamp-2 mb-3 flex-1" style={{ color:'var(--os-text2)' }}>
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {tool.tags.slice(0,3).map(tag => (
            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--os-text3)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${tool.status==='Production'?'dot-prod':tool.status==='Beta'?'dot-beta':'dot-alpha'}`} />
            <span className="text-[10px] font-mono" style={{ color:'var(--os-text3)' }}>
              {tool.status === 'Production' ? `v${tool.version}` : tool.status}
            </span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }}
            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
            style={{ background:`${c}18`, color:c, border:`1px solid ${c}30` }}
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
  const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
  const fav = isFavorite(tool.id);

  return (
    <motion.div
      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.02 }}
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all"
      style={{ background:'var(--os-card)', border:'1px solid rgba(255,255,255,0.05)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = c+'35'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${c}18` }}>
        <Icon size={15} style={{ color:c }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color:'var(--os-text)' }}>{tool.name}</p>
        <p className="text-xs truncate" style={{ color:'var(--os-text3)' }}>{tool.description}</p>
      </div>
      <div className="hidden md:flex items-center gap-1">
        {tool.tags.slice(0,2).map(t => (
          <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ background:'rgba(255,255,255,0.05)', color:'var(--os-text3)' }}>{t}</span>
        ))}
      </div>
      <span className="hidden sm:block text-[9px] font-mono px-2 py-0.5 rounded shrink-0"
        style={{ background:c+'15', color:c }}>{tool.category}</span>
      <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); togglePin(tool.id); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          style={{ background:'rgba(255,255,255,0.06)', color:'var(--os-text3)' }}>📌</button>
        <button onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          style={{ background: fav ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', color: fav ? '#ef4444' : 'var(--os-text3)' }}>♥</button>
        <button onClick={e => { e.stopPropagation(); trackOpen(tool.id); if(tool.url) window.open(tool.url,'_blank'); else navigate(`/tool/${tool.id}`); }}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          style={{ background:'var(--os-accent)', color:'#fff' }}>↗</button>
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

  const allTools = [...tools, ...customTools];

  const filtered = useMemo(() => allTools.filter(t => {
    const catOk    = cat === 'All' || t.category === cat;
    const statusOk = status === 'All' || t.status === status;
    const qOk      = !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()));
    return catOk && statusOk && qOk;
  }), [cat, status, q, customTools]);

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl" style={{ color:'var(--os-text)' }}>All Tools</h1>
            <p className="text-sm mt-1 font-mono" style={{ color:'var(--os-text3)' }}>
              {filtered.length} of {allTools.length} tools
            </p>
          </div>
          <button onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
            style={{ background:'var(--os-accent)', color:'#fff' }}>
            <Plus size={14} /> Add Tool
          </button>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scroll pb-1">
          {CATS.map(c => {
            const active = c === cat;
            const color = CAT_COLORS[c] || 'var(--os-accent)';
            const count = c === 'All' ? allTools.length : allTools.filter(t => t.category === c).length;
            return (
              <button key={c} onClick={() => setCat(c)}
                className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all"
                style={{
                  background: active ? (c === 'All' ? 'var(--os-accent)' : color) : 'rgba(255,255,255,0.04)',
                  color: active ? '#fff' : 'var(--os-text2)',
                  border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {c} <span className="text-xs opacity-70 ml-1">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-sm"
            style={{ background:'var(--os-card)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <Search size={13} style={{ color:'var(--os-text3)', flexShrink:0 }} />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Filter by name or tag…" className="flex-1 bg-transparent text-xs outline-none"
              style={{ color:'var(--os-text)', border:'none' }} />
            {q && <button onClick={() => setQ('')} style={{ color:'var(--os-text3)' }}><X size={11} /></button>}
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scroll">
            {STATUSES.map(s => {
              const a = s === status;
              const sc = { Production:'#22c55e', Beta:'#f59e0b', Alpha:'#6366f1', Archived:'#6b7280' }[s] || 'var(--os-accent)';
              return (
                <button key={s} onClick={() => setStatus(s)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium whitespace-nowrap shrink-0 transition-all"
                  style={{ background: a ? sc+'20' : 'rgba(255,255,255,0.04)', color: a ? sc : 'var(--os-text3)', border:`1px solid ${a ? sc+'50' : 'rgba(255,255,255,0.07)'}` }}>
                  {s}
                </button>
              );
            })}
          </div>

          <div className="flex rounded-xl overflow-hidden ml-auto shrink-0"
            style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
            {[['grid', LayoutGrid], ['list', List]].map(([id, Icon]) => (
              <button key={id} onClick={() => setView(id)}
                className="px-3 py-2 transition-colors"
                style={{ background: view===id ? 'rgba(99,102,241,0.12)' : 'transparent', color: view===id ? 'var(--os-accent)' : 'var(--os-text3)' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <p className="font-display font-bold text-2xl" style={{ color:'var(--os-text3)' }}>No tools found</p>
            <p className="text-sm" style={{ color:'var(--os-text3)' }}>Try a different filter</p>
            <button onClick={() => { setCat('All'); setStatus('All'); setQ(''); }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background:'var(--os-accent)', color:'#fff' }}>
              Clear all filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t,i) => <ToolCard key={t.id} tool={t} index={i} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((t,i) => <ToolRow key={t.id} tool={t} index={i} />)}
          </div>
        )}
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
