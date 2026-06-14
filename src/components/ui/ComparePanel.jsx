import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ArrowRight, Check, Minus } from 'lucide-react';
import useCompareStore from '@/stores/compareStore';
import { getAllTools } from '@/utils/tools';
import { getIcon } from '@/utils/icons';

const CAT_COLORS = { Trading:'#f59e0b',AI:'#8b5cf6',Development:'#3b82f6',Utilities:'#22c55e',Restaurant:'#f97316',Automations:'#06b6d4',Archive:'#6b7280' };

const FEATURE_FIELDS = [
  { key: 'category', label: 'Category', format: (v, t) => v },
  { key: 'status', label: 'Status', format: (v, t) => v },
  { key: 'version', label: 'Version', format: (v) => v },
  { key: 'type', label: 'Type', format: (v) => v === 'external' ? 'External Tool' : 'Built-in' },
  { key: 'tags', label: 'Tags', format: (v) => (v || []).slice(0, 4).join(', ') },
];

export default function ComparePanel({ open, onClose }) {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const allTools = getAllTools();
  const tools = compareList.map(id => allTools.find(t => t.id === id)).filter(Boolean);

  const availableTools = allTools.filter(t => !compareList.includes(t.id) && compareList.length < 4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(5,8,22,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl overflow-hidden"
            style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'var(--os-card)' }}>
              <h2 className="text-base font-bold" style={{ color: 'var(--os-text)' }}>Compare Tools</h2>
              <div className="flex items-center gap-2">
                {tools.length > 0 && (
                  <button onClick={clearCompare} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    Clear all
                  </button>
                )}
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <X size={13} style={{ color: 'var(--os-text3)' }} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 60px)' }}>
              {tools.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-sm mb-4" style={{ color: 'var(--os-text3)' }}>Select up to 4 tools to compare</p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                    {availableTools.slice(0, 8).map(t => {
                      const c = CAT_COLORS[t.category] || 'var(--os-accent)';
                      return (
                        <button key={t.id} onClick={() => { useCompareStore.getState().addToCompare(t.id); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <Plus size={11} /> {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  {/* Tool header row */}
                  <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)` }}>
                    <div />
                    {tools.map(tool => {
                      const c = CAT_COLORS[tool.category] || 'var(--os-accent)';
                      const Icon = getIcon(tool.icon);
                      return (
                        <div key={tool.id} className="text-center">
                          <div className="flex items-center justify-between mb-2">
                            <div />
                            <button onClick={() => removeFromCompare(tool.id)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <X size={11} style={{ color: 'var(--os-text3)' }} />
                            </button>
                          </div>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: c + '18' }}>
                            <Icon size={18} style={{ color: c }} />
                          </div>
                          <p className="text-sm font-bold" style={{ color: 'var(--os-text)' }}>{tool.name}</p>
                          <p className="text-[10px] font-mono mt-0.5" style={{ color: c }}>{tool.category}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feature comparison rows */}
                  <div className="space-y-1">
                    {FEATURE_FIELDS.map(field => (
                      <div key={field.key} className="grid gap-4 py-3 px-3 rounded-lg" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)`, background: 'rgba(255,255,255,0.02)' }}>
                        <span className="text-xs font-medium" style={{ color: 'var(--os-text2)' }}>{field.label}</span>
                        {tools.map(tool => (
                          <div key={tool.id} className="text-center">
                            <span className="text-xs" style={{ color: 'var(--os-text)' }}>
                              {field.format(tool[field.key], tool)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Description comparison */}
                  <div className="mt-4">
                    <p className="text-xs font-medium mb-3" style={{ color: 'var(--os-text2)' }}>Description</p>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)` }}>
                      <div />
                      {tools.map(tool => (
                        <div key={tool.id} className="text-xs leading-relaxed" style={{ color: 'var(--os-text3)' }}>
                          {tool.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags comparison */}
                  <div className="mt-4">
                    <p className="text-xs font-medium mb-3" style={{ color: 'var(--os-text2)' }}>Tags</p>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${tools.length}, 1fr)` }}>
                      <div />
                      {tools.map(tool => (
                        <div key={tool.id} className="flex flex-wrap gap-1">
                          {(tool.tags || []).slice(0, 5).map(tag => (
                            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--os-text3)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add more button */}
                  {compareList.length < 4 && (
                    <div className="mt-6 flex justify-center">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {availableTools.slice(0, 6).map(t => {
                          const c = CAT_COLORS[t.category] || 'var(--os-accent)';
                          return (
                            <button key={t.id} onClick={() => { useCompareStore.getState().addToCompare(t.id); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                              <Plus size={10} /> {t.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
