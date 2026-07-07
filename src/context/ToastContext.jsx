import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = { success: CheckCircle, error: XCircle, info: AlertCircle };
const COLORS = { success: '#22c55e', error: '#ef4444', info: '#6366f1' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type] || ICONS.success;
            const color = COLORS[t.type] || COLORS.success;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
                style={{
                  background: 'white',
                  border: `1px solid ${color}25`,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px ${color}10`,
                }}
              >
                <Icon size={16} style={{ color, flexShrink: 0 }} />
                <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{t.message}</span>
                <button onClick={() => removeToast(t.id)} className="shrink-0 p-0.5 rounded-full hover:bg-gray-100 transition-colors" style={{ color: 'var(--text3)' }}>
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
