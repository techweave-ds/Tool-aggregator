import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/services/storage';
import { getAllTools } from '@/utils/tools';

export function useRecentTools() {
  const [recentIds, setRecentIds] = useLocalStorage(STORAGE_KEYS.RECENT_TOOLS, []);

  const trackOpen = useCallback(
    (toolId) => {
      setRecentIds((prev) => {
        const filtered = prev.filter((id) => id !== toolId);
        return [toolId, ...filtered].slice(0, 20);
      });
    },
    [setRecentIds]
  );

  const recents = useMemo(() => {
    const all = getAllTools();
    const map = new Map(all.map((t) => [t.id, t]));
    return recentIds.map((id) => map.get(id)).filter(Boolean);
  }, [recentIds]);

  return { recents, recentIds, trackOpen };
}
