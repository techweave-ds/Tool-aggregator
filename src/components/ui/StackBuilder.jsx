import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Save, X, Bot, Lightbulb, Layers } from 'lucide-react';
import useStackStore from '@/stores/stackStore';
import { getAllTools } from '@/utils/tools';
import { getIcon } from '@/utils/icons';

const PRESETS = [
  { id: 'ai-support-bot', label: 'AI Support Bot', icon: Bot, color: '#8b5cf6' },
  { id: 'lead-generation', label: 'Lead Generation', icon: Lightbulb, color: '#f59e0b' },
  { id: 'trading-automation', label: 'Trading Automation', icon: TrendingIcon, color: '#22c55e' },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: Layers, color: '#3b82f6' },
  { id: 'restaurant-ordering', label: 'Restaurant Ordering', icon: UtensilsIcon, color: '#f97316' },
  { id: 'devops-pipeline', label: 'DevOps Pipeline', icon: PipelineIcon, color: '#06b6d4' },
];

function TrendingIcon({ size, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={style?.color || 'currentColor'} strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function UtensilsIcon({ size, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={style?.color || 'currentColor'} strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>;
}
function PipelineIcon({ size, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={style?.color || 'currentColor'} strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}

export default function StackBuilder({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { generateStack, generatedStack, saveStack, savedStacks } = useStackStore();
  const allTools = getAllTools();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    generateStack(query);
    setSubmitted(true);
    setSaved(false);
  }

  function handlePreset(preset) {
    setQuery(preset.label);
    generateStack(preset.label);
    setSubmitted(true);
    setSaved(false);
  }

  function handleSave() {
    if (generatedStack) {
      saveStack(generatedStack);
      setSaved(true);
    }
  }

  function handleReset() {
    setQuery('');
    setSubmitted(false);
    setSaved(false);
  }

  const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>AI Stack Builder</h2>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>What are you trying to build?</p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.05)' }}>
                <X size={13} style={{ color: 'var(--text3)' }} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {!submitted ? (
                <>
                  {/* Query input */}
                  <form onSubmit={handleSubmit}>
                    <div className="flex gap-2">
                      <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="e.g. AI Support Bot, Trading Automation..."
                        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--card2)', border: '1px solid rgba(0,0,0,0.07)', color: 'var(--text)' }}
                        autoFocus
                      />
                      <button type="submit"
                        className="px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"
                        style={{ background: 'var(--accent)', color: '#fff' }}>
                        Generate <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>

                  {/* Presets */}
                  <div>
                    <p className="text-xs font-mono mb-3" style={{ color: 'var(--text3)' }}>Quick start:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PRESETS.map(p => {
                        const Icon = p.icon;
                        return (
                          <button key={p.id} onClick={() => handlePreset(p)}
                            className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all hover:-translate-y-0.5"
                            style={{ background: p.color + '10', border: '1px solid ' + p.color + '25' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.color + '20' }}>
                              <Icon size={14} style={{ color: p.color }} />
                            </div>
                            <span className="text-xs font-medium leading-tight" style={{ color: 'var(--text)' }}>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Saved stacks */}
                  {savedStacks.length > 0 && (
                    <div>
                      <p className="text-xs font-mono mb-3" style={{ color: 'var(--text3)' }}>Saved stacks:</p>
                      <div className="space-y-2">
                        {savedStacks.slice(-3).reverse().map(s => {
                          const tools = s.tools.map(id => allTools.find(t => t.id === id)).filter(Boolean);
                          return (
                            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.name}</p>
                                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text3)' }}>
                                  {tools.map(t => t?.name).join(' · ')}
                                </p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }}>
                                {tools.length} tools
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Results */
                <div className="space-y-4">
                  {/* Query pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }}>
                      "{query}"
                    </span>
                    <button onClick={handleReset} className="text-xs" style={{ color: 'var(--text3)' }}>Try another →</button>
                  </div>

                  {generatedStack && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Stack description */}
                      <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                        <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>Recommended Stack</h3>
                        <p className="text-xs" style={{ color: 'var(--text2)' }}>{generatedStack.description}</p>
                      </div>

                      {/* Tool cards */}
                      <div className="space-y-2">
                        {generatedStack.tools.map((toolId, i) => {
                          const tool = allTools.find(t => t.id === toolId);
                          if (!tool) return null;
                          const c = CAT_COLORS[tool.category] || 'var(--accent)';
                          const Icon = getIcon(tool.icon);
                          return (
                            <div key={tool.id}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ background: 'var(--card2)', border: '1px solid rgba(0,0,0,0.05)' }}>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c + '18' }}>
                                <Icon size={15} style={{ color: c }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{tool.name}</p>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: c + '15', color: c }}>{tool.category}</span>
                                </div>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>{tool.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {generatedStack.explanation && (
                        <div className="p-4 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.05)' }}>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                            <span className="font-semibold" style={{ color: 'var(--text)' }}>Why this stack: </span>
                            {generatedStack.explanation}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{ background: saved ? 'rgba(34,197,94,0.15)' : 'var(--accent)', color: saved ? '#22c55e' : '#fff', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none' }}>
                          <Save size={14} /> {saved ? 'Saved' : 'Save Stack'}
                        </button>
                        <button onClick={handleReset}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                          style={{ background: 'var(--bg)', border: '1px solid rgba(0,0,0,0.07)', color: 'var(--text2)' }}>
                          Build Another
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
