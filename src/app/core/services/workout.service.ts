import { Injectable, signal } from '@angular/core';

import type { WorkoutSession } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  readonly todayWorkout = signal<WorkoutSession>({
    id: 'w-today',
    title: 'Trote Leve de Base',
    subtitle: 'Alternando caminhada e trote suave',
    type: 'walk_run',
    primaryZone: 'Z2',
    totalDurationMinutes: 35,
    estimatedDistanceKm: 3.8,
    whyThisMatters: 'Correr leve acostuma seu corpo e seus tendões sem cansaço excessivo. O segredo para evoluir na corrida é não forçar no começo.',
    howItShouldFeel: 'Ritmo bem tranquilo em que você consegue conversar. Se o ar faltar, basta caminhar até estabilizar.',
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
        description: 'Faça 5 vezes: 3 min de trote leve + 2 min de caminhada para recuperar o fôlego.', 
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