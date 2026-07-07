import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from './ToastContext';

const PinnedContext = createContext(null);

export function PinnedProvider({ children }) {
  const [pinned, setPinned] = useLocalStorage('pinned-tools', []);
  const { addToast } = useToast();

  const isPinned = useCallback((id) => pinned.includes(id), [pinned]);
  const togglePin = useCallback((id, name) => {
    setPinned((prev) => {
      const wasPinned = prev.includes(id);
      addToast(wasPinned ? `Unpinned ${name}` : `Pinned ${name}`, 'success');
      return wasPinned ? prev.filter((p) => p !== id) : [...prev, id];
    });
  }, [setPinned, addToast]);

  return (
    <PinnedContext.Provider value={{ pinned, isPinned, togglePin }}>
      {children}
    </PinnedContext.Provider>
  );
}

export function usePinnedContext() {
  const ctx = useContext(PinnedContext);
  if (!ctx) throw new Error('usePinnedContext must be used within PinnedProvider');
  return ctx;
}
