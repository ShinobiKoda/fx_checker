import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConversionLog } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const LOGS_KEY = 'fx_conversion_logs';
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000000';

function getLocalLogs(): ConversionLog[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LOGS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLocalLogs(logs: ConversionLog[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function useConversionLogs() {
  const { user, isAuthenticated, isLoading: authLoading, supabase } = useAuth();

  return useQuery({
    queryKey: ['conversion_logs', isAuthenticated ? user?.id : 'local'],
    enabled: !authLoading,
    queryFn: async () => {
      if (!isAuthenticated || !user) {
        return getLocalLogs();
      }

      const { data, error } = await supabase
        .from('conversion_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ConversionLog[];
    },
  });
}

export function useAddConversionLog() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async ({ from, to, amount, convertedAmount }: { from: string; to: string; amount: number; convertedAmount: number }) => {
      if (!isAuthenticated || !user) {
        const logs = getLocalLogs();
        const newLog: ConversionLog = {
          id: crypto.randomUUID(),
          user_id: MOCK_USER_ID,
          from_currency: from,
          to_currency: to,
          amount,
          converted_amount: convertedAmount,
          created_at: new Date().toISOString(),
        };
        const updatedLogs = [newLog, ...logs];
        saveLocalLogs(updatedLogs);
        return updatedLogs;
      }

      const { data, error } = await supabase
        .from('conversion_logs')
        .insert({
          user_id: user.id,
          from_currency: from,
          to_currency: to,
          amount,
          converted_amount: convertedAmount,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversion_logs'] });
    },
  });
}

export function useRemoveConversionLog() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!isAuthenticated || !user) {
        const logs = getLocalLogs();
        const updatedLogs = logs.filter(log => log.id !== id);
        saveLocalLogs(updatedLogs);
        return updatedLogs;
      }

      const { error } = await supabase
        .from('conversion_logs')
        .delete()
        .match({
          id,
          user_id: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversion_logs'] });
    },
  });
}

export function useClearConversionLogs() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, supabase } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!isAuthenticated || !user) {
        saveLocalLogs([]);
        return [];
      }

      const { error } = await supabase
        .from('conversion_logs')
        .delete()
        .match({
          user_id: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversion_logs'] });
    },
  });
}
