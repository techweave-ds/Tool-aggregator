import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, [setFavorites]);
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);
  return { favorites, toggleFavorite, isFavorite, favoriteIds: favorites };
}
