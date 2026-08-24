import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { DailyStudyPlan } from '../types';

export function useStudyPlan() {
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPlan = useCallback(async () => {
    setIsLoading(true);
    try {
      const plan = await apiClient.getStudyPlan();
      setStudyPlan(plan);
    } catch (err) {
      console.error('Failed to load study plan:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTask = async (taskId: string) => {
    try {
      const updated = await apiClient.toggleStudyPlanTask(taskId);
      setStudyPlan(updated);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    studyPlan,
    isLoading,
    toggleTask,
    refreshPlan: fetchPlan,
  };
}
