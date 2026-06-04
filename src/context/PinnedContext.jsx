import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PinnedContext = createContext(null);

export function PinnedProvider({ children }) {
  const [pinned, setPinned] = useLocalStorage('pinned-tools', []);

  const isPinned = useCallback((id) => pinned.includes(id), [pinned]);
  const togglePin = useCallback((id) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, [setPinned]);

  return (
    <PinnedContext.Provider value={{ pinned, isPinned, togglePin }}>
      {children}
    </PinnedContext.Provider>
  );
}

export function usePinnedContext() {
  return useContext(PinnedContext);
}
