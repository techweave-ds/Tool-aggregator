import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Search, Layers, Wand2 } from 'lucide-react';
import { getAllTools } from '@/utils/tools';
import EcosystemHero from '@/components/ui/EcosystemHero';
import StackBuilder from '@/components/ui/StackBuilder';

// Ticker of tool names
function ToolTicker() {
  const names = getAllTools().map(t => t.name);
  return (
    <div className="ticker-wrap w-full overflow-hidden py-2">
      <div className="flex gap-6 animate-scroll-x whitespace-nowrap" style={{ animation: 'none' }}>
        <div className="flex gap-6" style={{ animation: 'moveScroll 30s linear infinite' }}>
          {[...names, ...names].map((n, i) => (
            <span key={i} className="text-xs font-mono shrink-0 px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--os-text3)' }}>
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const [stackOpen, setStackOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions] = useState(['Generate QR code', 'Analyze architecture', 'Email automation', 'Trading signals', 'AI workflows']);
  const [suggIdx, setSuggIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { const p = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }; setMousePos(p); mouseRef.current = p; };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  // Cycle suggestions
  useEffect(() => {
    const t = setInterval(() => setSuggIdx(i => (i + 1) % suggestions.length), 2500);
    return () => clearInterval(t);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/tools?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

      {/* Interactive ecosystem background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <EcosystemHero mousePos={mouseRef} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <Sparkles size={13} style={{ color: 'var(--os-accent)' }} />
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--os-accent)' }}>Discovery-First Tool Ecosystem · v3.0</span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: 'var(--os-green)' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold leading-none mb-6"
          style={{ fontSize: 'clamp(44px, 7vw, 88px)', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: 'var(--os-text)' }}>Build Faster.</span>
          <br />
          <span className="text-gradient">Automate Smarter.</span>
          <br />
          <span style={{ color: 'var(--os-text)' }}>Create </span>
          <span className="text-gradient-cyan">Anything.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg mb-10 mx-auto max-w-2xl leading-relaxed"
          style={{ color: 'var(--os-text2)' }}
        >
          Discover, combine, and build with intelligent tools. WeaveStack helps you find the right tools, understand how they work together, and build complete workflows.
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center gap-0 mx-auto mb-8 max-w-xl"
          style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, backdropFilter: 'blur(20px)', overflow: 'hidden' }}
        >
          <div className="flex items-center gap-3 px-4 flex-1">
            <Search size={16} style={{ color: 'var(--os-accent)', flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={suggestions[suggIdx]}
              className="flex-1 py-4 bg-transparent text-sm outline-none"
              style={{ color: 'var(--os-text)', caretColor: 'var(--os-accent)', border: 'none', minWidth: 0 }}
            />
          </div>
          <button type="submit"
            className="px-5 py-4 text-sm font-semibold transition-all shrink-0 flex items-center gap-2"
            style={{ background: 'var(--os-accent)', color: '#fff', margin: 3, borderRadius: 10 }}>
            Search
            <ArrowRight size={14} />
          </button>
        </motion.form>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-16"
        >
          <button onClick={() => setStackOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))', color: '#fff', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
            <Wand2 size={15} />
            Build a Stack
          </button>
          <Link to="/tools"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--os-text2)' }}>
            <Zap size={15} />
            Explore Tools
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="flex items-center justify-center gap-8 flex-wrap"
        >
          {[
            [getAllTools().length + '+', 'Tools'],
            [new Set(getAllTools().map(t => t.category)).size + '', 'Categories'],
            [getAllTools().filter(t => t.status === 'Production').length + '', 'Production'],
            ['99.9%', 'Uptime'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-2xl" style={{ color: 'var(--os-text)' }}>{val}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--os-text3)' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tool ticker strip */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 pb-8"
        style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}
      >
        <style>{`@keyframes moveScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
        <ToolTicker />
      </motion.div>
      <StackBuilder open={stackOpen} onClose={() => setStackOpen(false)} />
    </section>
  );
}
