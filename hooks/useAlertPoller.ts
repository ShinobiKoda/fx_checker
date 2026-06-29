import { useEffect, useRef } from 'react';
import { useRateAlerts, useUpdateRateAlert } from './useRateAlerts';
import { toast } from 'sonner';

export function useAlertPoller() {
  const { data: alerts } = useRateAlerts();
  const { mutate: updateAlert } = useUpdateRateAlert();
  
  // Keep track of the latest alerts in a ref so the interval closure always has the latest data
  const alertsRef = useRef(alerts);
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    const pollRates = async () => {
      if (document.visibilityState !== 'visible') return;

      const activeAlerts = alertsRef.current?.filter(a => !a.triggered) || [];
      if (activeAlerts.length === 0) return;

      // Group alerts by base currency to minimize API calls
      const bases = Array.from(new Set(activeAlerts.map(a => a.from_currency)));
      
      try {
        for (const base of bases) {
          // We can use the simple latest endpoint since we only need the current rate
          const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}`);
          if (!res.ok) continue;
          
          const data = await res.json();
          const rates = data.rates;

          const alertsForBase = activeAlerts.filter(a => a.from_currency === base);
          
          for (const alert of alertsForBase) {
            const currentRate = rates[alert.to_currency];
            if (!currentRate) continue;

            let isTriggered = false;
            if (alert.condition === 'above' && currentRate >= alert.target_rate) {
              isTriggered = true;
            } else if (alert.condition === 'below' && currentRate <= alert.target_rate) {
              isTriggered = true;
            }

            if (isTriggered) {
              toast.success(`Rate Alert Triggered!`, {
                description: `1 ${alert.from_currency} is now ${currentRate} ${alert.to_currency} (${alert.condition} ${alert.target_rate})`,
                duration: 10000,
              });
              updateAlert({ id: alert.id, triggered: true });
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll rates for alerts', error);
      }
    };

    // Poll immediately, then every 60 seconds
    pollRates();
    const interval = setInterval(pollRates, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pollRates();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateAlert]);
}
