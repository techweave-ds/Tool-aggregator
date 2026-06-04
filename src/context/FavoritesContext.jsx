import { createContext, useContext, useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { favorites, favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  const value = useMemo(
    () => ({ favorites, favoriteIds, toggleFavorite, isFavorite }),
    [favorites, favoriteIds, toggleFavorite, isFavorite]
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
