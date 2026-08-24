import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { TopicMastery, SubjectMastery } from '../types';

export function useMastery() {
  const [overallScore, setOverallScore] = useState<number>(72);
  const [weakestTopics, setWeakestTopics] = useState<TopicMastery[]>([]);
  const [strongestTopics, setStrongestTopics] = useState<TopicMastery[]>([]);
  const [subjectMasteries, setSubjectMasteries] = useState<SubjectMastery[]>([]);
  const [criticalAlert, setCriticalAlert] = useState<TopicMastery | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMastery = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getMasteryOverview();
      setOverallScore(data.overallScore);
      setWeakestTopics(data.weakestTopics || []);
      setStrongestTopics(data.strongestTopics || []);
      setSubjectMasteries(data.subjectMasteries || []);
      if (data.criticalAlert) setCriticalAlert(data.criticalAlert);
    } catch (err) {
      console.error('Failed to load mastery:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMastery();
  }, [fetchMastery]);

  return {
    overallScore,
    weakestTopics,
    strongestTopics,
    subjectMasteries,
    criticalAlert,
    isLoading,
    refreshMastery: fetchMastery,
  };
}
