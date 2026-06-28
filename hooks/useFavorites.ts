import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoritePair } from '@/types';

const FAVORITES_KEY = 'fx_favorites';

// Mock user ID for localStorage fallback
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

function getLocalFavorites(): FavoritePair[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(FAVORITES_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLocalFavorites(favorites: FavoritePair[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return getLocalFavorites();
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const favorites = getLocalFavorites();
      
      // Check if already exists
      if (favorites.some(f => f.from_currency === from && f.to_currency === to)) {
        return favorites;
      }
      
      const newFavorite: FavoritePair = {
        id: crypto.randomUUID(),
        user_id: MOCK_USER_ID,
        from_currency: from,
        to_currency: to,
        created_at: new Date().toISOString(),
      };
      
      const updatedFavorites = [...favorites, newFavorite];
      saveLocalFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const favorites = getLocalFavorites();
      const updatedFavorites = favorites.filter(
        f => !(f.from_currency === from && f.to_currency === to)
      );
      
      saveLocalFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useIsFavorite(from: string, to: string) {
  const { data: favorites } = useFavorites();
  if (!favorites) return false;
  return favorites.some(f => f.from_currency === from && f.to_currency === to);
}
