'use client';

import { useState, useEffect, useCallback } from 'react';
import { simulationsAPI, SimulationQuota } from '../api/simulations-service';

export const useSimulationQuota = () => {
  const [quota, setQuota] = useState<SimulationQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await simulationsAPI.getQuota();
      setQuota(data);
    } catch (err: any) {
      console.error('Error fetching simulation quota:', err);
      setError(err.response?.data?.message || 'Error al obtener información de simulaciones');
      // Set default quota on error
      setQuota({
        totalPurchased: 0,
        totalUsed: 0,
        remaining: 0,
        canPurchaseMore: true,
        maxPurchasable: 3,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const startSimulation = useCallback(async (): Promise<boolean> => {
    try {
      const response = await simulationsAPI.startSimulation();
      if (response.success) {
        // Refetch quota to get updated values
        await fetchQuota();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error starting simulation:', err);
      setError(err.response?.data?.message || 'Error al iniciar la simulación');
      return false;
    }
  }, [fetchQuota]);

  return {
    quota,
    loading,
    error,
    refetch: fetchQuota,
    startSimulation,
  };
};
