import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function WorkflowStory({ system, onRevealStack }) {
  const [activeStage, setActiveStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.25, once: false });
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
    <section ref={ref} className="relative py-24 md:py-28 overflow-hidden" style={{ background: 'var(--os-surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-3"
            style={{ color: system.color, letterSpacing: '0.15em' }}
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            {system.icon} <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm mt-3 mx-auto leading-relaxed"
            style={{ color: 'var(--os-text2)', maxWidth: 500 }}
          >
            {system.description}
          </motion.p>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="relative px-4">
            {/* Connecting track line */}
            <div className="absolute top-[26px] left-[calc(8%+20px)] right-[calc(8%+20px)] h-[2px] rounded-full overflow-hidden" style={{ background: `${system.color}12` }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(activeStage / (stages.length - 1 || 1)) * 100}%`,
                  background: system.color,
                  boxShadow: `0 0 8px ${system.color}40`,
                }}
              />
            </div>

            {/* Stage nodes */}
            <div className="flex justify-between">
              {stages.map((stage, i) => {
                const isActive = i <= activeStage;
                const isCurrent = i === activeStage;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                    className="flex flex-col items-center text-center cursor-pointer"
                    style={{ width: `${100 / stages.length}%`, maxWidth: 200, minWidth: 80 }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-500 mb-3"
                      style={{
                        width: isCurrent ? 52 : 44,
                        height: isCurrent ? 52 : 44,
                        background: isActive ? `${system.color}18` : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${isActive ? system.color : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: isCurrent ? `0 0 24px ${system.color}20` : 'none',
                      }}
                    >
                      <span style={{ fontSize: isCurrent ? 20 : 16, transition: 'font-size 0.3s' }}>{stage.icon}</span>
                    </div>
                    <p
                      className="font-semibold transition-all duration-300 px-1"
                      style={{
                        fontSize: isCurrent ? 13 : 11,
                        color: isActive ? 'var(--os-text)' : 'var(--os-text3)',
                      }}
                    >
                      {stage.stage}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Current stage detail */}
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-10 p-5 rounded-xl text-center"
            style={{
              background: `${system.color}06`,
              border: `1px solid ${system.color}12`,
              maxWidth: 500,
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--os-text2)' }}>
              {stages[activeStage].detail}
            </p>
          </motion.div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          {stages.map((stage, i) => {
            const isActive = i <= activeStage;
            const isCurrent = i === activeStage;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                className="flex gap-3 w-full text-left mb-3 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 transition-all duration-500"
                    style={{
                      width: isCurrent ? 40 : 34,
                      height: isCurrent ? 40 : 34,
                      background: isActive ? `${system.color}18` : 'rgba(255,255,255,0.03)',
                      border: `2px solid ${isActive ? system.color : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span style={{ fontSize: isCurrent ? 16 : 13 }}>{stage.icon}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-0.5 flex-1 my-1 rounded-full" style={{ background: isActive ? system.color : 'rgba(255,255,255,0.06)', opacity: isActive ? 0.35 : 0.15 }} />
                  )}
                </div>
                <div className="flex-1" style={{ paddingTop: isCurrent ? 4 : 8 }}>
                  <p className="font-semibold text-sm" style={{ color: isActive ? 'var(--os-text)' : 'var(--os-text3)' }}>{stage.stage}</p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-1.5 leading-relaxed"
                      style={{ color: 'var(--os-text2)' }}
                    >
                      {stage.detail}
                    </motion.p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Reveal stack CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: activeStage >= stages.length - 1 ? 1 : 0, y: activeStage >= stages.length - 1 ? 0 : 8 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-10"
          style={{ pointerEvents: activeStage >= stages.length - 1 ? 'auto' : 'none' }}
        >
          <button
            onClick={onRevealStack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))',
              color: '#fff',
              boxShadow: `0 4px 20px ${system.color}25`,
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
