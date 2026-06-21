import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, ExternalLink, Zap, Menu, Sparkles, ChevronDown } from 'lucide-react';
import { getAllTools } from '@/utils/tools';
import { useRecentToolsContext } from '@/context/RecentToolsContext';
import StackBuilder from '@/components/ui/StackBuilder';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

const NAV_LINKS = [
  ['/', 'Platform'],
  ['/tools', 'Tools'],
];

export default function Navbar({ transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);
  const inputRef = useRef(null);
  const loc = useLocation();
  const navigate = useNavigate();
  const { trackOpen } = useRecentToolsContext();

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }
      if (e.key === 'Escape') { setCmdOpen(false); setQuery(''); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const allTools = getAllTools();
  const results = query.length > 1 ? allTools.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    (t.tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 8) : [];

  useEffect(() => { setIdx(0); }, [results.length]);

  function go(tool) {
    trackOpen(tool.id); setCmdOpen(false); setQuery('');
    if (tool.type === 'external' && tool.url) window.open(tool.url, '_blank');
    else navigate(`/tool/${tool.id}`);
  }

  return (
    <>
      {/* Platform top accent line */}
      <div className="platform-top-line" />

      <nav
        className="fixed top-[2px] left-0 right-0 z-50 h-14 flex items-center px-5 transition-all duration-300"
        style={{
          background: scrolled || !transparent
            ? 'rgba(255,255,255,0.85)'
            : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          borderBottom: `1px solid ${scrolled ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)'}`,
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--violet))', boxShadow: 'var(--glow-indigo)' }}>
            <Zap size={13} fill="white" color="white" />
          </div>
          <span className="font-display text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>
            Weave<span style={{ color: 'var(--accent)' }}>Stack</span>
          </span>
          <span className="hidden md:inline font-mono text-[9px] px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}>
            v3.0
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(([to, label]) => {
            const isActive = loc.pathname === to;
            return (
              <Link key={to} to={to}
                className="relative px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text2)',
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Build Stack */}
        <button
          onClick={() => setStackOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all mr-2 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--violet))',
            color: '#fff',
            boxShadow: 'var(--glow-indigo)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          <Sparkles size={11} />
          Build Stack
        </button>

        {/* Search pill */}
        <button
          onClick={() => { setCmdOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs transition-all hover:shadow-md"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border2)',
            color: 'var(--text3)',
            boxShadow: 'var(--shadow-xs)',
            fontFamily: 'Inter, sans-serif',
          }}
          aria-label="Search tools"
        >
          <Search size={13} style={{ color: 'var(--text3)' }} />
          <span>Search tools…</span>
          <div className="flex gap-0.5 ml-2">
            <kbd className="font-mono text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>⌘</kbd>
            <kbd className="font-mono text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>K</kbd>
          </div>
        </button>

        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(p => !p)} className="md:hidden ml-2 p-2 rounded-lg"
          style={{ color: 'var(--text2)', background: 'var(--surface)', border: '1px solid var(--border2)' }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-[56px] left-0 right-0 z-40 p-4 md:hidden"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border2)', boxShadow: 'var(--shadow-md)' }}
          >
            {NAV_LINKS.map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium border-b"
                style={{ color: loc.pathname === to ? 'var(--accent)' : 'var(--text2)', borderColor: 'var(--border2)' }}>
                {label}
              </Link>
            ))}
            <button onClick={() => { setMobileOpen(false); setStackOpen(true); }}
              className="block py-3 text-sm font-semibold w-full text-left"
              style={{ color: 'var(--accent)' }}>
              <span className="flex items-center gap-2"><Sparkles size={13} /> Build Stack</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setCmdOpen(false); setQuery(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 18,
                boxShadow: 'var(--shadow-2xl), var(--glow-indigo)',
              }}
            >
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border2)' }}>
                <Search size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i+1, results.length-1)); }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
                    if (e.key === 'Enter' && results[idx]) go(results[idx]);
                  }}
                  placeholder="Search tools, categories, tags…"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text)', caretColor: 'var(--accent)', border: 'none', boxShadow: 'none' }}
                />
                {query && <button onClick={() => setQuery('')} style={{ color: 'var(--text3)' }}><X size={14} /></button>}
              </div>

              {results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((tool, i) => (
                    <div key={tool.id} onMouseDown={() => go(tool)}
                      className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{ background: i === idx ? 'rgba(99,102,241,0.06)' : 'transparent' }}
                      onMouseEnter={() => setIdx(i)}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CAT_COLORS[tool.category] || 'var(--accent)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{tool.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text3)' }}>{tool.category} · {tool.description?.slice(0,60) || ''}…</p>
                      </div>
                      <span className={`text-[9px] font-mono ${tool.status === 'Production' ? 'badge-prod' : tool.status === 'Beta' ? 'badge-beta' : 'badge-alpha'}`}>
                        {tool.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text3)' }}>No tools found for "{query}"</p>
                </div>
              ) : (
                <div className="px-5 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[['View all tools', '/tools'], ['Import tools', '/import'], ['Admin panel', '/admin']].map(([label, to]) => (
                      <button key={to} onMouseDown={() => { navigate(to); setCmdOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all hover:bg-[rgba(99,102,241,0.05)]"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border2)', color: 'var(--text2)' }}>
                        <Command size={11} style={{ color: 'var(--accent)' }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-5 py-2.5 flex items-center gap-4" style={{ borderTop: '1px solid var(--border2)' }}>
                {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1">
                    <kbd className="font-mono text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--bg2)', color: 'var(--text3)' }}>{k}</kbd>
                    <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{v}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StackBuilder open={stackOpen} onClose={() => setStackOpen(false)} />
    </>
  );
}
