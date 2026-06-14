import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, TrendingUp, Brain, Code2, Wrench, UtensilsCrossed, Bot, Archive } from 'lucide-react';
import { searchTools, initSearch } from '@/utils/smartSearch';
import { getAllTools } from '@/utils/tools';
import { getIcon } from '@/utils/icons';

const CAT_ICONS = { Trading: TrendingUp, AI: Brain, Development: Code2, Utilities: Wrench, Restaurant: UtensilsCrossed, Automations: Bot, Archive };

export default function SmartSearch({ variant = 'full', onResult }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allTools = getAllTools();

  useEffect(() => {
    initSearch(allTools);
  }, []);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    if (q.trim().length > 0) {
      const { results: searchResults } = searchTools(q, allTools);
      setResults(searchResults.slice(0, 8));
      setSelectedIdx(-1);
    } else {
      setResults([]);
    }
  }, [allTools]);

  const handleSelect = useCallback((tool) => {
    setQuery('');
    setResults([]);
    setFocused(false);
    if (onResult) onResult(tool);
    navigate(`/tool/${tool.id}`);
  }, [navigate, onResult]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      handleSelect(results[selectedIdx]);
    } else if (e.key === 'Enter' && query.trim()) {
      navigate(`/tools?q=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
      setFocused(false);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

  return (
    <div className="relative" style={{ width: variant === 'compact' ? 'auto' : '100%' }}>
      <div
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 transition-all"
        style={{
          background: focused ? 'var(--os-card)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none'
        }}
      >
        <Search size={14} style={{ color: focused ? 'var(--os-accent)' : 'var(--os-text3)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools, categories, or describe what you need..."
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: 'var(--os-text)', border: 'none' }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} style={{ color: 'var(--os-text3)' }}>
            <X size={12} />
          </button>
        )}
        {!query && (
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px]">
            <Sparkles size={10} style={{ color: 'var(--os-accent)' }} /> AI
          </kbd>
        )}
      </div>

      <AnimatePresence>
        {focused && (results.length > 0 || query.trim()) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
            style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}
          >
            {results.length > 0 ? (
              <div className="py-1">
                {results.map((tool, i) => {
                  const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
                  const Icon = getIcon(tool.icon);
                  const CatIcon = CAT_ICONS[tool.category];
                  return (
                    <button
                      key={tool.id}
                      onMouseEnter={() => setSelectedIdx(i)}
                      onClick={() => handleSelect(tool)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{ background: selectedIdx === i ? 'rgba(99,102,241,0.08)' : 'transparent' }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: c + '18' }}>
                        <Icon size={13} style={{ color: c }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--os-text)' }}>{tool.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ background: c + '15', color: c }}>
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--os-text3)' }}>{tool.description}</p>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${tool.status === 'Production' ? 'badge-prod' : tool.status === 'Beta' ? 'badge-beta' : 'badge-alpha'}`}>
                        {tool.status}
                      </span>
                    </button>
                  );
                })}
                <div className="px-4 py-2 border-t text-[10px] font-mono" style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--os-text3)' }}>
                  {results.length} result{results.length !== 1 ? 's' : ''} — Press Enter to view all
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm" style={{ color: 'var(--os-text3)' }}>No tools found for "{query}"</p>
                <p className="text-xs mt-1" style={{ color: 'var(--os-text3)' }}>Try a different search or browse categories</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
