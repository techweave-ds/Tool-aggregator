import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { val: 250000, suffix: '+', label: 'Tasks Processed', color: '#6366f1' },
  { val: 45, suffix: '+',    label: 'Tools Available',  color: '#8b5cf6' },
  { val: 99.9, suffix: '%',  label: 'Uptime SLA',       color: '#06b6d4' },
  { val: 1200000, suffix: '+', label: 'Executions',     color: '#22c55e' },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(t);
  }, [active, target]);

  function fmt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n % 1 !== 0 ? n.toFixed(1) : n.toString();
  }

  return <span>{fmt(count)}{suffix}</span>;
}

export default function StatsSection() {
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(99,102,241,0.1)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.1)' }}>
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
              style={{ background: 'var(--os-card)' }}
            >
              <div className="font-display font-bold mb-2 leading-none"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: s.color }}>
                <CountUp target={s.val} suffix={s.suffix} active={active} />
              </div>
              <div className="text-sm font-mono" style={{ color: 'var(--os-text3)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
