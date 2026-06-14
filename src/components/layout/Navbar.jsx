import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, ExternalLink, Zap, Menu } from 'lucide-react';
import { getAllTools } from '@/utils/tools';
import { useRecentToolsContext } from '@/context/RecentToolsContext';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

export default function Navbar({ transparent }) {
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [idx, setIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const glassy = scrolled || !transparent;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 transition-all duration-300"
        style={{
          background: glassy ? 'rgba(5,8,22,0.85)' : 'transparent',
          backdropFilter: glassy ? 'blur(20px)' : 'none',
          borderBottom: glassy ? '1px solid rgba(99,102,241,0.1)' : 'none',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))' }}>
            <Zap size={15} fill="white" color="white" />
          </div>
          <span className="font-display font-bold text-base tracking-tight" style={{ color: 'var(--os-text)' }}>
            Weave<span style={{ color: 'var(--os-accent)' }}>Stack</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {[['/', 'Home'], ['/tools', 'Tools']].map(([to, label]) => (
            <Link key={to} to={to}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: loc.pathname === to ? 'var(--os-accent)' : 'var(--os-text2)',
                background: loc.pathname === to ? 'rgba(99,102,241,0.08)' : 'transparent',
              }}
            >{label}</Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search pill */}
          <button
            onClick={() => { setCmdOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all mr-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--os-text3)' }}
            aria-label="Search tools"
          >
            <Search size={14} />
            <span>Search tools…</span>
            <div className="flex gap-0.5 ml-3"><kbd>⌘</kbd><kbd>K</kbd></div>
          </button>



        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(p => !p)} className="md:hidden"
          style={{ color: 'var(--os-text2)' }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 p-4 md:hidden"
            style={{ background: 'rgba(5,8,22,0.97)', borderBottom: '1px solid rgba(99,102,241,0.1)' }}
          >
            {[['/', 'Home'], ['/tools', 'Tools']].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium border-b"
                style={{ color: 'var(--os-text2)', borderColor: 'rgba(255,255,255,0.06)' }}>
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
            style={{ background: 'rgba(5,8,22,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setCmdOpen(false); setQuery(''); }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden"
              style={{ background: 'var(--os-card)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.1)' }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={18} style={{ color: 'var(--os-accent)', flexShrink: 0 }} />
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
                  style={{ color: 'var(--os-text)', caretColor: 'var(--os-accent)', border: 'none' }}
                  aria-label="Search tools"
                />
                {query && <button onClick={() => setQuery('')} style={{ color: 'var(--os-text3)' }}><X size={14} /></button>}
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((tool, i) => (
                    <div key={tool.id} onMouseDown={() => go(tool)}
                      className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{ background: i === idx ? 'rgba(99,102,241,0.08)' : 'transparent' }}
                      onMouseEnter={() => setIdx(i)}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CAT_COLORS[tool.category] || 'var(--os-accent)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--os-text)' }}>{tool.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--os-text3)' }}>{tool.category} · {tool.description?.slice(0,60) || ''}…</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${tool.status === 'Production' ? 'badge-prod' : tool.status === 'Beta' ? 'badge-beta' : 'badge-alpha'}`}>
                          {tool.status}
                        </span>
                        <ExternalLink size={12} style={{ color: 'var(--os-text3)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.length > 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--os-text3)' }}>No tools found for "{query}"</p>
                </div>
              ) : (
                <div className="px-5 py-6">
                  <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--os-text3)' }}>Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      ['View all tools', '/tools'],
                      ['Import tools', '/import'],
                      ['Admin panel', '/admin'],
                    ].map(([label, to]) => (
                      <button key={to} onMouseDown={() => { navigate(to); setCmdOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--os-text2)' }}>
                        <Command size={12} style={{ color: 'var(--os-accent)' }} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-5 py-2.5 flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>↑↓ navigate</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>↵ open</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--os-text3)' }}>esc close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
