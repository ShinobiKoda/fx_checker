import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RateAlert } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const ALERTS_KEY = 'fx_rate_alerts';
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

function getLocalAlerts(): RateAlert[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ALERTS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLocalAlerts(alerts: RateAlert[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

export function useRateAlerts() {
  const { user, isAuthenticated, isLoading: authLoading, supabase } = useAuth();

  return useQuery({
    queryKey: ['rate_alerts', isAuthenticated ? user?.id : 'local'],
    enabled: !authLoading,
    queryFn: async () => {
      if (!isAuthenticated || !user) {
        return getLocalAlerts();
      }

      const { data, error } = await supabase
        .from('rate_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RateAlert[];
    },
  });
}

export function useAddRateAlert() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async ({ from, to, targetRate, condition }: { from: string; to: string; targetRate: number; condition: 'above' | 'below' }) => {
      if (!isAuthenticated || !user) {
        const alerts = getLocalAlerts();
        const newAlert: RateAlert = {
          id: crypto.randomUUID(),
          user_id: MOCK_USER_ID,
          from_currency: from,
          to_currency: to,
          target_rate: targetRate,
          condition,
          triggered: false,
          created_at: new Date().toISOString(),
        };
        const updatedAlerts = [newAlert, ...alerts];
        saveLocalAlerts(updatedAlerts);
        return updatedAlerts;
      }

      const { data, error } = await supabase
        .from('rate_alerts')
        .insert({
          user_id: user.id,
          from_currency: from,
          to_currency: to,
          target_rate: targetRate,
          condition,
          triggered: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate_alerts'] });
    },
  });
}

export function useRemoveRateAlert() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isAuthenticated || !user) {
        const alerts = getLocalAlerts();
        const updatedAlerts = alerts.filter(alert => alert.id !== id);
        saveLocalAlerts(updatedAlerts);
        return updatedAlerts;
      }

      const { error } = await supabase
        .from('rate_alerts')
        .delete()
        .match({
          id,
          user_id: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate_alerts'] });
    },
  });
}

export function useUpdateRateAlert() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async ({ id, triggered }: { id: string; triggered: boolean }) => {
      if (!isAuthenticated || !user) {
        const alerts = getLocalAlerts();
        const updatedAlerts = alerts.map(alert => alert.id === id ? { ...alert, triggered } : alert);
        saveLocalAlerts(updatedAlerts);
        return updatedAlerts;
      }

      const { error } = await supabase
        .from('rate_alerts')
        .update({ triggered })
        .match({
          id,
          user_id: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate_alerts'] });
    },
  });
}
