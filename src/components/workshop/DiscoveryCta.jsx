import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'I want a crypto alert bot',
  'I need restaurant ordering',
  'I need lead generation',
  'Build me an AI support chatbot',
  'I want to automate data pipelines',
  'Create a content studio',
];

export default function DiscoveryCta() {
  const [query, setQuery] = useState('');
  const [suggIdx, setSuggIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setSuggIdx(i => (i + 1) % SUGGESTIONS.length), 3000);
    return () => clearInterval(t);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/tools?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative py-36 md:py-48 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.2] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[11px] font-medium tracking-[0.2em] mb-6"
          style={{ color: 'var(--text3)' }}
        >
          START BUILDING
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-display leading-[1.05] mb-10"
          style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', letterSpacing: '-0.035em' }}
        >
          Tell us what<br />
          <span className="text-gradient">you want to build.</span>
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto flex items-center gap-0 rounded-[14px] overflow-hidden"
          style={{
            maxWidth: 540,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={SUGGESTIONS[suggIdx]}
            className="flex-1 py-4 px-5 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)', border: 'none', fontFamily: 'Satoshi, sans-serif' }}
          />
          <button type="submit"
            className="flex items-center gap-2 px-5 py-4 text-sm font-semibold shrink-0 transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff' }}
          >
            Start
            <ArrowRight size={14} />
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-xs mt-6 flex items-center justify-center gap-1.5"
          style={{ color: 'var(--text3)' }}
        >
          <Sparkles size={11} />
          Describe your project in natural language. We'll recommend the right tools.
        </motion.p>
      </div>
    </section>
  );
}