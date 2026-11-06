import { ZoneId } from './training-zone.model';

export type WorkoutType = 'base' | 'interval' | 'recovery' | 'long_run' | 'walk_run';

export interface WorkoutStep {
  name: string;
  durationMinutes: number;
  description: string;
  targetZone: ZoneId;
}

export interface WorkoutSession {
  id: string;
  title: string;
  subtitle: string;
  type: WorkoutType;
  primaryZone: ZoneId;
  totalDurationMinutes: number;
  estimatedDistanceKm?: number;
  whyThisMatters: string; // Por que este treino é importante
  howItShouldFeel: string; // Como o corpo deve se sentir
  warmupMinutes: number;
  cooldownMinutes: number;
  steps: WorkoutStep[];
  completed: boolean;
  dateScheduled: string;
}