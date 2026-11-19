import { Injectable, inject, signal } from '@angular/core';

import type { WorkoutSession } from '../models/workout.model';

import {
  type CompletedWorkoutRecord,
  SupabaseService
} from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private supabaseService = inject(SupabaseService);

  private readonly completedCacheKey = 'correja_completed_workouts_cache';

  readonly completedWorkoutIds = signal<Set<string>>(new Set<string>());
  readonly isSyncing = signal<boolean>(false);

  readonly todayWorkout = signal<WorkoutSession>({
    id: 'w-today',
    title: 'Trote Leve de Base',
    subtitle: 'Alternando caminhada e trote suave',
    type: 'walk_run',
    primaryZone: 'Z2',
    totalDurationMinutes: 35,
    estimatedDistanceKm: 3.8,
    whyThisMatters:
      'Correr leve acostuma seu corpo e seus tendões sem cansaço excessivo. O segredo para evoluir na corrida é não forçar no começo.',
    howItShouldFeel:
      'Ritmo bem tranquilo em que você consegue conversar. Se o ar faltar, basta caminhar até estabilizar.',
    warmupMinutes: 5,
    cooldownMinutes: 5,
    completed: false,
    dateScheduled: new Date().toISOString(),
    steps: [
      {
        name: 'Aquecimento',
        durationMinutes: 5,
        description: 'Caminhada leve para acordar o corpo e soltar as pernas.',
        targetZone: 'Z1'
      },
      {
        name: 'Bloco Principal',
        durationMinutes: 25,
        description:
          'Faça 5 vezes: 3 min de trote leve + 2 min de caminhada para recuperar o fôlego.',
        targetZone: 'Z2'
      },
      {
        name: 'Desaquecimento',
        durationMinutes: 5,
        description: 'Caminhada bem calma para relaxar e baixar os batimentos.',
        targetZone: 'Z1'
      }
    ]
  });

  readonly weeklyProgress = signal({
    completedCount: 0,
    plannedCount: 3,
    totalDistanceKm: 0,
    streakWeeks: 1
  });

  constructor() {
    this.restoreLocalCache();
    void this.syncFromCloud();
  }

  public async syncFromCloud(planId?: string): Promise<void> {
    this.isSyncing.set(true);
    try {
      const profile = await this.supabaseService.getProfile();
      const activePlanId = planId || profile?.active_plan_id || '5k';
      const plannedCount = profile?.weekly_frequency || 3;

      const records = await this.supabaseService.getCompletedWorkouts(activePlanId);
      this.applyRecordsToSignals(records, plannedCount);

      localStorage.setItem(this.completedCacheKey, JSON.stringify(records));
    } catch {
      // mantém cache local caso esteja offline
    } finally {
      this.isSyncing.set(false);
    }
  }

  public isWorkoutCompleted(workoutId: string): boolean {
    return this.completedWorkoutIds().has(workoutId);
  }

  public completeTodayWorkout(): void {
    const workout = this.todayWorkout();
    if (workout.completed) return;

    this.todayWorkout.update((w) => ({ ...w, completed: true }));
    this.weeklyProgress.update((p) => ({
      ...p,
      completedCount: Math.min(p.plannedCount, p.completedCount + 1),
      totalDistanceKm: Number(
        (p.totalDistanceKm + (workout.estimatedDistanceKm || 0)).toFixed(1)
      )
    }));

    const updatedSet = new Set(this.completedWorkoutIds());
    updatedSet.add(workout.id);
    this.completedWorkoutIds.set(updatedSet);

    void this.persistWorkoutCompletion({
      plan_id: '5k',
      workout_id: workout.id,
      distance_km: workout.estimatedDistanceKm,
      duration_minutes: workout.totalDurationMinutes
    });
  }

  public async toggleWorkoutCompletion(
    planId: string,
    workoutId: string,
    metrics?: { distanceKm?: number; durationMinutes?: number; avgPace?: string; perceivedEffort?: number }
  ): Promise<boolean> {
    const currentlyCompleted = this.completedWorkoutIds().has(workoutId);
    const nextState = !currentlyCompleted;

    // Atualização otimista na UI
    const nextSet = new Set(this.completedWorkoutIds());
    if (nextState) {
      nextSet.add(workoutId);
    } else {
      nextSet.delete(workoutId);
    }
    this.completedWorkoutIds.set(nextSet);

    if (workoutId === this.todayWorkout().id) {
      this.todayWorkout.update((w) => ({ ...w, completed: nextState }));
    }

    try {
      if (nextState) {
        await this.supabaseService.markWorkoutCompleted({
          plan_id: planId,
          workout_id: workoutId,
          distance_km: metrics?.distanceKm,
          duration_minutes: metrics?.durationMinutes,
          avg_pace: metrics?.avgPace,
          perceived_effort: metrics?.perceivedEffort
        });
      } else {
        await this.supabaseService.unmarkWorkoutCompleted(planId, workoutId);
      }

      await this.syncFromCloud(planId);
      return nextState;
    } catch {
      return nextState;
    }
  }

  private async persistWorkoutCompletion(record: CompletedWorkoutRecord): Promise<void> {
    try {
      const profile = await this.supabaseService.getProfile();
      const activePlanId = profile?.active_plan_id || record.plan_id || '5k';

      await this.supabaseService.markWorkoutCompleted({
        ...record,
        plan_id: activePlanId
      });

      await this.syncFromCloud(activePlanId);
    } catch {
      // mantém estado otimista caso falhe rede momentaneamente
    }
  }

  private applyRecordsToSignals(
    records: CompletedWorkoutRecord[],
    plannedCount: number
  ): void {
    const ids = new Set<string>(records.map((r) => r.workout_id));
    this.completedWorkoutIds.set(ids);

    const todayId = this.todayWorkout().id;
    const todayCompleted = ids.has(todayId);
    this.todayWorkout.update((w) => ({ ...w, completed: todayCompleted }));

    const totalDistance = records.reduce(
      (sum, r) => sum + (Number(r.distance_km) || 0),
      0
    );

    // Filtra treinos concluídos nos últimos 7 dias para a meta semanal
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const completedThisWeek = records.filter((r) => {
      if (!r.completed_at) return true;
      return new Date(r.completed_at).getTime() >= sevenDaysAgo;
    }).length;

    this.weeklyProgress.set({
      completedCount: Math.min(plannedCount, completedThisWeek),
      plannedCount,
      totalDistanceKm: Number(totalDistance.toFixed(1)),
      streakWeeks: records.length > 0 ? Math.max(1, Math.ceil(records.length / plannedCount)) : 0
    });
  }

  private restoreLocalCache(): void {
    try {
      const raw = localStorage.getItem(this.completedCacheKey);
      if (!raw) return;
      const records = JSON.parse(raw) as CompletedWorkoutRecord[];
      if (Array.isArray(records)) {
        this.applyRecordsToSignals(records, this.weeklyProgress().plannedCount);
      }
    } catch {
      // ignora cache inválido
    }
  }
}