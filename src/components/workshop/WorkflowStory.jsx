import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export default function WorkflowStory({ system, onRevealStack }) {
  const [activeStage, setActiveStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: false });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!inView || !autoPlay || !system) return;
    timerRef.current = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= system.workflow.length - 1) { clearInterval(timerRef.current); return prev; }
        return prev + 1;
      });
    }, 2200);
    return () => clearInterval(timerRef.current);
  }, [inView, autoPlay, system]);

  useEffect(() => {
    if (!system) return;
    setActiveStage(0);
    setAutoPlay(true);
  }, [system?.id]);

  if (!system) return null;
  const stages = system.workflow;

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)' }}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* Subtle color wash */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 45% at 50% 0%, ${system.color}08 0%, transparent 65%)`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
            style={{ background: `${system.color}12`, border: `1px solid ${system.color}30` }}
          >
            <span style={{ fontSize: 14 }}>{system.icon}</span>
            <span className="font-mono text-[10px] font-medium tracking-[0.15em]" style={{ color: system.color }}>
              HOW IT WORKS
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(24px, 3vw, 38px)', letterSpacing: '-0.035em', color: 'var(--text)' }}
          >
            {system.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm leading-relaxed mx-auto"
            style={{ color: 'var(--text2)', maxWidth: 500, fontSize: 14 }}
          >
            {system.description}
          </motion.p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:block">
          <div className="relative px-[5%]">
            {/* Track background */}
            <div className="absolute top-[28px] left-[8%] right-[8%] h-[3px] rounded-full" style={{ background: 'var(--bg2)' }}>
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(activeStage / (stages.length - 1 || 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, ${system.color}, ${system.color}80)`,
                  boxShadow: `0 0 12px ${system.color}50`,
                }}
              />
            </div>

            <div className="flex justify-between">
              {stages.map((stage, i) => {
                const done = i < activeStage;
                const current = i === activeStage;
                const future = i > activeStage;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                    className="flex flex-col items-center text-center cursor-pointer group"
                    style={{ width: `${100 / stages.length}%`, maxWidth: 200, minWidth: 80 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-400 mb-4 relative"
                      style={{
                        width: current ? 58 : 46,
                        height: current ? 58 : 46,
                        background: done ? system.color : current ? 'white' : 'var(--surface)',
                        border: `2.5px solid ${done ? system.color : current ? system.color : 'var(--border2)'}`,
                        boxShadow: current ? `0 0 0 5px ${system.color}15, var(--shadow-lg)` : done ? `var(--shadow-sm)` : 'none',
                        zIndex: 1,
                      }}
                    >
                      {done
                        ? <CheckCircle2 size={18} style={{ color: 'white' }} />
                        : <span style={{ fontSize: current ? 22 : 16, transition: 'font-size 0.3s' }}>{stage.icon}</span>
                      }
                    </div>
                    <p className="font-semibold transition-all duration-300 px-1 leading-tight"
                      style={{ fontSize: current ? 12.5 : 11, color: future ? 'var(--text3)' : 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {stage.stage}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Stage detail card */}
          <AnimatedDetail stage={stages[activeStage]} color={system.color} />
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col gap-0">
          {stages.map((stage, i) => {
            const done = i < activeStage;
            const current = i === activeStage;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                className="flex gap-4 w-full text-left"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center rounded-full shrink-0 transition-all duration-400"
                    style={{
                      width: 38, height: 38,
                      background: done ? system.color : current ? 'white' : 'var(--bg)',
                      border: `2px solid ${done || current ? system.color : 'var(--border2)'}`,
                      boxShadow: current ? `0 0 0 4px ${system.color}15, var(--shadow-sm)` : 'none',
                    }}>
                    {done ? <CheckCircle2 size={15} style={{ color: 'white' }} />
                      : <span style={{ fontSize: current ? 15 : 12 }}>{stage.icon}</span>}
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-[2px] flex-1 my-1.5 min-h-[20px]"
                      style={{ background: done ? system.color : 'var(--border2)', opacity: done ? 0.5 : 1 }} />
                  )}
                </div>
                <div className="flex-1 pb-4" style={{ paddingTop: current ? 4 : 8 }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: current || done ? 'var(--text)' : 'var(--text3)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stage.stage}</p>
                  {current && (
                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs leading-relaxed p-3 rounded-xl"
                      style={{ color: 'var(--text2)', background: `${system.color}06`, border: `1px solid ${system.color}15` }}>
                      {stage.detail}
                    </motion.p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          animate={{ opacity: activeStage >= stages.length - 1 ? 1 : 0, y: activeStage >= stages.length - 1 ? 0 : 10 }}
          transition={{ duration: 0.45 }}
          className="flex justify-center mt-12"
          style={{ pointerEvents: activeStage >= stages.length - 1 ? 'auto' : 'none' }}
        >
          <button onClick={onRevealStack}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--violet))',
              color: '#fff',
              boxShadow: 'var(--glow-indigo)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            See the tools behind this
            <ChevronDown size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedDetail({ stage, color }) {
  return (
    <motion.div
      key={stage.stage}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-10 p-6 rounded-2xl text-center"
      style={{
        background: 'white',
        border: `1px solid ${color}20`,
        maxWidth: 540,
        boxShadow: `var(--shadow-md), 0 0 0 1px ${color}10`,
      }}
    >
      <div className="text-2xl mb-3">{stage.icon}</div>
      <p className="font-semibold mb-2 text-sm" style={{ color: 'var(--text)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{stage.stage}</p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{stage.detail}</p>
    </motion.div>
  );
}
