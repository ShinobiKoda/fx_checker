import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoritePair } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const FAVORITES_KEY = 'fx_favorites';
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
  const { user, isAuthenticated, isLoading: authLoading, supabase } = useAuth();

  return useQuery({
    queryKey: ['favorites', isAuthenticated ? user?.id : 'local'],
    enabled: !authLoading,
    queryFn: async () => {
      if (!isAuthenticated || !user) {
        return getLocalFavorites();
      }

      const { data, error } = await supabase
        .from('favorite_pairs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FavoritePair[];
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      if (!isAuthenticated || !user) {
        const favorites = getLocalFavorites();
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
      }

      const { data, error } = await supabase
        .from('favorite_pairs')
        .insert({
          user_id: user.id,
          from_currency: from,
          to_currency: to,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      if (!isAuthenticated || !user) {
        const favorites = getLocalFavorites();
        const updatedFavorites = favorites.filter(
          f => !(f.from_currency === from && f.to_currency === to)
        );
        saveLocalFavorites(updatedFavorites);
        return updatedFavorites;
      }

      const { error } = await supabase
        .from('favorite_pairs')
        .delete()
        .match({
          user_id: user.id,
          from_currency: from,
          to_currency: to,
        });

      if (error) throw error;
      return true;
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
