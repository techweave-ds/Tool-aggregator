import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const [log, setLog] = useLocalStorage('activity-log', []);

  const addActivity = useCallback((type, payload) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    setLog((prev) => [entry, ...prev].slice(0, 200));
  }, [setLog]);

  const clearLog = useCallback(() => setLog([]), [setLog]);

  return (
    <ActivityContext.Provider value={{ log, addActivity, clearLog }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivityContext() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivityContext must be used within ActivityProvider');
  return ctx;
}
