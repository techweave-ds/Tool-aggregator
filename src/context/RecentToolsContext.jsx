import { createContext, useContext, useMemo } from 'react';
import { useRecentTools } from '@/hooks/useRecentTools';

const RecentToolsContext = createContext(null);

export function RecentToolsProvider({ children }) {
  const { recents, recentIds, trackOpen } = useRecentTools();

  const value = useMemo(
    () => ({ recents, recentIds, trackOpen }),
    [recents, recentIds, trackOpen]
  );

  return (
    <RecentToolsContext.Provider value={value}>
      {children}
    </RecentToolsContext.Provider>
  );
}

export function useRecentToolsContext() {
  const ctx = useContext(RecentToolsContext);
  if (!ctx) throw new Error('useRecentToolsContext must be used within RecentToolsProvider');
  return ctx;
}
