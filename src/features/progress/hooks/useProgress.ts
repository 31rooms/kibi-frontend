import { useState } from 'react';
import { progressAPI } from '../api/progressAPI';
import type { DashboardData, SubjectsEffectiveness, ProjectedScore } from '../api/types';

export function useProgress() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [effectiveness, setEffectiveness] = useState<SubjectsEffectiveness | null>(null);
  const [projectedScore, setProjectedScore] = useState<ProjectedScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressAPI.getDashboard();
      setDashboard(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadEffectiveness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressAPI.getSubjectsEffectiveness();
      setEffectiveness(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadProjectedScore = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressAPI.getProjectedScore();
      setProjectedScore(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadSubjectDetail = async (subjectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressAPI.getSubjectDetail(subjectId);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    effectiveness,
    projectedScore,
    loading,
    error,
    loadDashboard,
    loadEffectiveness,
    loadProjectedScore,
    loadSubjectDetail
  };
}