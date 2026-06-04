import { useState, useCallback } from 'react';
export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s !== null ? JSON.parse(s) : fallback; }
    catch { return fallback; }
  });
  const set = useCallback((v) => {
    setValue(prev => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}
