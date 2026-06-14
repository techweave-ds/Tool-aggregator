import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
    }, 2400);
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
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden" style={{ background: 'var(--surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 40% 30% at 50% 0%, ${system.color}04 0%, transparent 70%)`,
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] font-medium tracking-[0.2em] mb-4"
            style={{ color: system.color }}
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display leading-[1.1]"
            style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', letterSpacing: '-0.03em' }}
          >
            <span style={{ color: system.color }}>{system.icon}</span>{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm mt-4 mx-auto leading-relaxed"
            style={{ color: 'var(--text2)', maxWidth: 500, fontSize: 13 }}
          >
            {system.description}
          </motion.p>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="relative" style={{ padding: '0 4%' }}>
            {/* Track */}
            <div className="absolute top-[28px] left-[calc(6%+24px)] right-[calc(6%+24px)] h-[2px] rounded-full overflow-hidden" style={{ background: `${system.color}0a` }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(activeStage / (stages.length - 1 || 1)) * 100}%`,
                  background: `linear-gradient(90deg, ${system.color}cc, ${system.color}60)`,
                }}
              />
            </div>

            <div className="flex justify-between">
              {stages.map((stage, i) => {
                const isActive = i <= activeStage;
                const isCurrent = i === activeStage;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                    className="flex flex-col items-center text-center cursor-pointer"
                    style={{ width: `${100 / stages.length}%`, maxWidth: 200, minWidth: 80 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-500 mb-3.5"
                      style={{
                        width: isCurrent ? 56 : 46,
                        height: isCurrent ? 56 : 46,
                        background: isActive ? `${system.color}14` : 'rgba(255,255,255,0.025)',
                        border: `2px solid ${isActive ? `${system.color}60` : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: isCurrent ? `0 0 30px ${system.color}18` : 'none',
                      }}
                    >
                      <span style={{ fontSize: isCurrent ? 22 : 16, transition: 'font-size 0.35s' }}>{stage.icon}</span>
                    </div>
                    <p className="font-semibold transition-all duration-300 px-1 tracking-tight" style={{ fontSize: isCurrent ? 13 : 11, color: isActive ? 'var(--text)' : 'var(--text3)' }}>
                      {stage.stage}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-12 p-5 rounded-[14px] text-center"
            style={{
              background: `${system.color}04`,
              border: `1px solid ${system.color}10`,
              maxWidth: 520,
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text2)', fontSize: 13 }}>
              {stages[activeStage].detail}
            </p>
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {stages.map((stage, i) => {
            const isActive = i <= activeStage;
            const isCurrent = i === activeStage;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                className="flex gap-3 w-full text-left mb-3 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 transition-all duration-500"
                    style={{
                      width: isCurrent ? 40 : 34,
                      height: isCurrent ? 40 : 34,
                      background: isActive ? `${system.color}14` : 'rgba(255,255,255,0.025)',
                      border: `2px solid ${isActive ? `${system.color}60` : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <span style={{ fontSize: isCurrent ? 16 : 12 }}>{stage.icon}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-[2px] flex-1 my-1 rounded-full" style={{ background: isActive ? system.color : 'rgba(255,255,255,0.04)', opacity: isActive ? 0.3 : 0.1 }} />
                  )}
                </div>
                <div className="flex-1" style={{ paddingTop: isCurrent ? 3 : 7 }}>
                  <p className="font-semibold text-sm tracking-tight" style={{ color: isActive ? 'var(--text)' : 'var(--text3)' }}>{stage.stage}</p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1.5 leading-relaxed"
                      style={{ color: 'var(--text2)' }}
                    >
                      {stage.detail}
                    </motion.p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: activeStage >= stages.length - 1 ? 1 : 0, y: activeStage >= stages.length - 1 ? 0 : 8 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-12"
          style={{ pointerEvents: activeStage >= stages.length - 1 ? 'auto' : 'none' }}
        >
          <button
            onClick={onRevealStack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: '#fff',
              boxShadow: `0 4px 20px rgba(99,102,241,0.25)`,
            }}
          >
            See the tools behind this workflow
            <ChevronDown size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
