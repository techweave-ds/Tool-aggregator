import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'I want a crypto alert bot',
  'I need restaurant ordering automation',
  'Build me an AI support chatbot',
  'I want to automate data pipelines',
  'Create a lead generation system',
  'I need inventory management tools',
];

export default function DiscoveryCta() {
  const [query, setQuery] = useState('');
  const [suggIdx, setSuggIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (focused) return;
    const t = setInterval(() => setSuggIdx(i => (i + 1) % SUGGESTIONS.length), 2800);
    return () => clearInterval(t);
  }, [focused]);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/tools?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative py-28 md:py-40 overflow-hidden" style={{ background: 'var(--bg2)' }}>
      {/* Grid bg */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb" style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-2xl"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)' }}>
          <Sparkles size={12} style={{ color: 'var(--accent)' }} />
          <span className="font-mono text-[10px] font-medium tracking-[0.18em]" style={{ color: 'var(--accent)' }}>START BUILDING</span>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08 }} className="font-display leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', letterSpacing: '-0.04em', color: 'var(--text)' }}>
          Tell us what you<br />
          <span className="text-gradient">want to build.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.14 }} className="text-sm leading-relaxed mb-10"
          style={{ color: 'var(--text2)' }}>
          Describe your project in plain language. We'll surface the exact tools and workflow.
        </motion.p>

        {/* Big search input */}
        <motion.form onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.18 }}
          className="relative mx-auto"
          style={{ maxWidth: 520 }}
        >
          <div className="flex items-center rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: 'white',
              border: `1.5px solid ${focused ? 'rgba(99,102,241,0.45)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: focused ? 'var(--shadow-xl), var(--glow-indigo)' : 'var(--shadow-md)',
            }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={SUGGESTIONS[suggIdx]}
              className="flex-1 py-4 px-5 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text)', border: 'none', boxShadow: 'none', background: 'transparent', fontFamily: 'Inter, sans-serif' }}
            />
            <button type="submit"
              className="flex items-center gap-2 px-5 py-3.5 m-1 text-sm font-bold rounded-xl shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                color: '#fff',
                boxShadow: 'var(--glow-indigo)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>
              Go
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.form>

        {/* Suggestion chips */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 justify-center mt-6">
          {SUGGESTIONS.slice(0, 3).map((s, i) => (
            <button key={i} onClick={() => navigate(`/tools?q=${encodeURIComponent(s)}`)}
              className="text-xs px-3 py-1.5 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                background: 'white',
                border: '1px solid var(--border2)',
                color: 'var(--text2)',
                boxShadow: 'var(--shadow-xs)',
                fontFamily: 'Inter, sans-serif',
              }}>
              {s}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
