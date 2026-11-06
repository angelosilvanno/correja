import { Injectable, signal } from '@angular/core';
import { WorkoutSession } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  // Treino recomendado para a demonstração do MVP
  readonly todayWorkout = signal<WorkoutSession>({
    id: 'w-today',
    title: 'Construção de Base Aeróbica',
    subtitle: 'Alternância caminhada e trote leve',
    type: 'walk_run',
    primaryZone: 'Z2',
    totalDurationMinutes: 35,
    estimatedDistanceKm: 3.8,
    whyThisMatters: 'Correr devagar cria novos capilares nos músculos e fortalece tendões. Tentar correr rápido agora aumentaria o risco de lesões sem gerar mais condicionamento.',
    howItShouldFeel: 'Ritmo confortável onde você não fica ofegante. Se sentir que a respiração acelerou demais, caminhe até estabilizar.',
    warmupMinutes: 5,
    cooldownMinutes: 5,
    completed: false,
    dateScheduled: new Date().toISOString(),
    steps: [
      { name: 'Aquecimento', durationMinutes: 5, description: 'Caminhada dinâmica para lubrificar articulações.', targetZone: 'Z1' },
      { name: 'Bloco Principal', durationMinutes: 25, description: 'Repita 5x: [3 min trote leve Z2 + 2 min caminhada Z1].', targetZone: 'Z2' },
      { name: 'Desaquecimento', durationMinutes: 5, description: 'Caminhada suave para desacelerar o coração.', targetZone: 'Z1' }
    ]
  });

  // Métricas de progresso semanal (Mock do MVP)
  readonly weeklyProgress = signal({
    completedCount: 2,
    plannedCount: 3,
    totalDistanceKm: 7.4,
    streakWeeks: 2
  });

  completeTodayWorkout(): void {
    this.todayWorkout.update(w => ({ ...w, completed: true }));
    this.weeklyProgress.update(p => ({
      ...p,
      completedCount: Math.min(p.plannedCount, p.completedCount + 1),
      totalDistanceKm: Number((p.totalDistanceKm + (this.todayWorkout().estimatedDistanceKm || 0)).toFixed(1))
    }));
  }
}