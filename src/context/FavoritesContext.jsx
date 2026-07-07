import { createContext, useContext, useMemo, useCallback } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from './ToastContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { favorites, toggleFavorite: rawToggle, isFavorite } = useFavorites();
  const { addToast } = useToast();

  const toggleFavorite = useCallback((id, name) => {
    const wasFav = favorites.includes(id);
    rawToggle(id);
    addToast(wasFav ? `Removed ${name} from favorites` : `Added ${name} to favorites`, 'info');
  }, [favorites, rawToggle, addToast]);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
