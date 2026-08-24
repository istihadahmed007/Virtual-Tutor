import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { MistakeItem } from '../types';

export function useMistakes() {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalUnresolved: number;
    totalMistakes: number;
    categoryBreakdown: { category: string; count: number; percentage: number }[];
    topMistakeType: { category: string; count: number };
  }>({
    totalUnresolved: 0,
    totalMistakes: 0,
    categoryBreakdown: [],
    topMistakeType: { category: 'Conceptual Error', count: 0 },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMistakesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [list, stats] = await Promise.all([
        apiClient.getMistakes(),
        apiClient.getMistakeAnalytics(),
      ]);
      setMistakes(list);
      setAnalytics(stats);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveMistake = async (questionId: number) => {
    try {
      await apiClient.resolveMistake(questionId);
      await fetchMistakesData();
    } catch (err) {
      console.error('Failed to resolve mistake:', err);
    }
  };

  useEffect(() => {
    fetchMistakesData();
  }, [fetchMistakesData]);

  return {
    mistakes,
    analytics,
    isLoading,
    resolveMistake,
    refreshMistakes: fetchMistakesData,
  };
}
