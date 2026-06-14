import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function WorkflowStory({ system, onRevealStack }) {
  const [activeStage, setActiveStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const timerRef = useRef(null);

  useEffect(() => {
    if (!inView || !autoPlay || !system) return;
    timerRef.current = setInterval(() => {
      setActiveStage((prev) => {
        if (prev >= system.workflow.length - 1) {
          clearInterval(timerRef.current);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [inView, autoPlay, system]);

  useEffect(() => {
    if (!system) return;
    setActiveStage(0);
    setAutoPlay(true);
  }, [system]);

  if (!system) return null;

  const stages = system.workflow;

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'var(--os-surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-medium mb-4"
            style={{ color: `${system.color}`, letterSpacing: '0.15em' }}
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', letterSpacing: '-0.03em', color: 'var(--os-text)' }}
          >
            <span>{system.icon}</span>{' '}
            <span style={{ color: system.color }}>{system.name}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm mt-4 mx-auto leading-relaxed"
            style={{ color: 'var(--os-text2)', maxWidth: 520 }}
          >
            {system.description}
          </motion.p>
        </div>

        {/* Workflow pipeline - Desktop horizontal */}
        <div className="hidden md:block">
          <div className="relative flex items-start justify-between gap-0">
            {/* Connecting track */}
            <svg className="absolute top-8 left-0 w-full h-0.5 pointer-events-none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id={`track-${system.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${(activeStage / (stages.length - 1 || 1)) * 100}%`} stopColor={system.color} stopOpacity="0.8" />
                  <stop offset={`${(activeStage / (stages.length - 1 || 1)) * 100}%`} stopColor={system.color} stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <line x1="0" y1="0" x2="100%" y2="0" stroke={`url(#track-${system.id})`} strokeWidth="2" strokeLinecap="round" />
            </svg>

            {stages.map((stage, i) => {
              const isActive = i <= activeStage;
              const isCurrent = i === activeStage;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12 }}
                  onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                  className="flex flex-col items-center text-center cursor-pointer group relative"
                  style={{ width: `${100 / stages.length}%`, maxWidth: 180 }}
                >
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-500 mb-4"
                    style={{
                      width: isCurrent ? 56 : 48,
                      height: isCurrent ? 56 : 48,
                      background: isActive ? `${system.color}20` : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${isActive ? system.color : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isCurrent ? `0 0 30px ${system.color}20` : 'none',
                    }}
                  >
                    <span style={{ fontSize: isCurrent ? 22 : 18, transition: 'font-size 0.3s' }}>{stage.icon}</span>
                  </div>
                  <div className="relative">
                    <p
                      className="font-semibold mb-1 transition-all duration-300"
                      style={{
                        fontSize: isCurrent ? 13 : 12,
                        color: isActive ? 'var(--os-text)' : 'var(--os-text3)',
                      }}
                    >
                      {stage.stage}
                    </p>
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs leading-relaxed"
                          style={{ color: 'var(--os-text2)', maxWidth: 160 }}
                        >
                          {stage.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="absolute top-6" style={{ right: '-8px', opacity: isActive ? 0.4 : 0.1 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={system.color} strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Current stage detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mx-auto mt-16 p-6 rounded-xl text-center"
              style={{
                background: `${system.color}06`,
                border: `1px solid ${system.color}15`,
                maxWidth: 480,
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--os-text2)' }}>
                {stages[activeStage].detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          {stages.map((stage, i) => {
            const isActive = i <= activeStage;
            const isCurrent = i === activeStage;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { setActiveStage(i); setAutoPlay(false); }}
                className="flex gap-4 w-full text-left mb-4 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 transition-all duration-500"
                    style={{
                      width: isCurrent ? 44 : 36,
                      height: isCurrent ? 44 : 36,
                      background: isActive ? `${system.color}20` : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${isActive ? system.color : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span style={{ fontSize: isCurrent ? 18 : 14 }}>{stage.icon}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: isActive ? system.color : 'rgba(255,255,255,0.06)', opacity: isActive ? 0.4 : 0.2 }} />
                  )}
                </div>
                <div className="flex-1 pb-6" style={{ paddingTop: isCurrent ? 6 : 10 }}>
                  <p className="font-semibold text-sm" style={{ color: isActive ? 'var(--os-text)' : 'var(--os-text3)' }}>
                    {stage.stage}
                  </p>
                  {isCurrent && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--os-text2)' }}>
                      {stage.detail}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue to stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeStage >= stages.length - 1 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mt-12"
          style={{ pointerEvents: activeStage >= stages.length - 1 ? 'auto' : 'none' }}
        >
          <button
            onClick={onRevealStack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, var(--os-accent), var(--os-violet))',
              color: '#fff',
              boxShadow: `0 4px 24px ${system.color}30`,
            }}
          >
            See the tools behind this workflow
            <ChevronDown size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
