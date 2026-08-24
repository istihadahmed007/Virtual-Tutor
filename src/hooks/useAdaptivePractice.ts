import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { Question } from '../types';

export function useAdaptivePractice() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; masteryDelta?: string } | null>(null);

  const loadAdaptiveSession = useCallback(async (count: number = 5, subject?: string, topic?: string) => {
    setIsLoading(true);
    try {
      const questions = await apiClient.getAdaptiveQuestions(count, subject, topic);
      setSessionQuestions(questions);
      setCurrentIndex(0);
      setCurrentQuestion(questions[0] || null);
      setSelectedOption(null);
      setIsSubmitted(false);
      setFeedback(null);
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSingleAdaptiveQuestion = useCallback(async (subject?: string, topic?: string) => {
    setIsLoading(true);
    try {
      const q = await apiClient.getAdaptiveQuestion(subject, topic);
      setCurrentQuestion(q);
      setSelectedOption(null);
      setIsSubmitted(false);
      setFeedback(null);
    } catch (err) {
      console.error('Failed to load adaptive question:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = async (option: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion || isSubmitted) return;
    setSelectedOption(option);
    setIsSubmitted(true);

    const correctId = currentQuestion.correctOptionId || currentQuestion.correctAnswer;
    const isCorrect = option === correctId;
    setFeedback({
      isCorrect,
      masteryDelta: isCorrect ? '+4% Topic Mastery' : '-3% (Logged in Mistake Book)',
    });

    try {
      await apiClient.recordAttempt(currentQuestion.id, option, 30);
    } catch (err) {
      console.error('Failed to submit attempt:', err);
    }
  };

  const nextQuestion = () => {
    if (sessionQuestions.length > 0 && currentIndex < sessionQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCurrentQuestion(sessionQuestions[nextIdx]);
      setSelectedOption(null);
      setIsSubmitted(false);
      setFeedback(null);
    } else {
      // Fetch fresh adaptive question
      loadSingleAdaptiveQuestion();
    }
  };

  return {
    currentQuestion,
    sessionQuestions,
    currentIndex,
    selectedOption,
    isSubmitted,
    isLoading,
    feedback,
    setSelectedOption,
    submitAnswer,
    nextQuestion,
    loadAdaptiveSession,
    loadSingleAdaptiveQuestion,
  };
}
