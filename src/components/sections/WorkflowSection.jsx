import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Zap, Brain, Bot, CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { id: 'input',      icon: Zap,          label: 'User Query',       desc: 'Input enters the system',                   color: '#6366f1' },
  { id: 'ai',         icon: Brain,        label: 'AI Processing',    desc: 'LLM classifies and routes intelligently',    color: '#8b5cf6' },
  { id: 'automation', icon: Bot,          label: 'Automation',       desc: 'Workflows trigger and execute in parallel',  color: '#06b6d4' },
  { id: 'output',     icon: CheckCircle2, label: 'Output Delivered', desc: 'Result returned with full audit trail',      color: '#22c55e' },
];

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActiveStep(s => (s + 1) % STEPS.length), 1800);
    return () => clearInterval(t);
  }, [running]);

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-16">
          <p className="text-xs font-mono tracking-widest mb-3" style={{ color: 'var(--accent)' }}>04 / WORKFLOW</p>
          <h2 className="font-display font-bold leading-tight mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)' }}>
            Tools that work <span className="text-gradient">together</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text2)' }}>
            Every tool in WeaveStack is designed to compose with others — building end-to-end pipelines without writing a single line of glue code.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            const isPast = activeStep > i;
            return (
              <div key={step.id} className="flex flex-col md:flex-row items-center">
                {/* Step card */}
                <motion.div
                  onClick={() => { setActiveStep(i); setRunning(false); }}
                  whileHover={{ scale: 1.04 }}
                  className="relative flex flex-col items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 w-44"
                  style={{
                    background: isActive ? `${step.color}12` : 'var(--bg)',
                    border: `1px solid ${isActive ? step.color + '50' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: isActive ? `0 0 40px ${step.color}20` : 'none',
                  }}
                >
                  {/* Pulsing ring when active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl" style={{
                      border: `1px solid ${step.color}`,
                      animation: 'borderPulse 2s ease-in-out infinite',
                    }} />
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 relative"
                    style={{ background: `${step.color}18` }}>
                    {isActive
                      ? <Loader2 size={20} style={{ color: step.color, animation: 'spin-slow 2s linear infinite' }} />
                      : isPast
                        ? <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                        : <Icon size={20} style={{ color: step.color }} />
                    }
                  </div>
                  <p className="font-display font-bold text-sm text-center mb-1" style={{ color: isActive ? 'var(--text)' : 'var(--text2)' }}>
                    {step.label}
                  </p>
                  <p className="text-[10px] font-mono text-center leading-tight" style={{ color: 'var(--text3)' }}>
                    {step.desc}
                  </p>
                  <div className="mt-2 text-[9px] font-mono" style={{ color: step.color + '80' }}>0{i+1}</div>
                </motion.div>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="flex items-center justify-center w-8 h-8 my-2 md:my-0 shrink-0">
                    <motion.div
                      animate={isPast || isActive ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.8 }}
                      className="rotate-90 md:rotate-0"
                    >
                      <ArrowDown size={16} style={{ color: STEPS[i].color }} />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => { setActiveStep(0); setRunning(true); }}
            className="text-xs font-mono px-4 py-2 rounded-lg transition-all"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--accent)' }}
          >
            {running ? '⏸ Pause animation' : '▶ Resume animation'}
          </button>
        </div>
      </div>
    </section>
  );
}
