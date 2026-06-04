import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
const Ctx = createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('os-theme', 'dark');
  const isDark = theme !== 'light';
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDark);
  }, [isDark]);
  return <Ctx.Provider value={{ theme, isDark, toggle: () => setTheme(isDark ? 'light' : 'dark') }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
