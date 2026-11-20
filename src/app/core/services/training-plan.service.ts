import { Injectable, signal, computed } from '@angular/core';

export type PlanId = '5k' | '10k' | '21k';

export interface PlanConfig {
  id: PlanId;
  distanceLabel: string; // '5', '10', '21'
  title: string;
  description: string;
  level: string;
  totalWeeks: number;
  workoutsPerWeek: number;
  goalLabel: string;
}

export const PLANS_CATALOG: Record<PlanId, PlanConfig> = {
  '5k': {
    id: '5k',
    distanceLabel: '5',
    title: 'Primeiros 5 km',
    description: 'Construa sua base e corra seus primeiros 5 km com confiança.',
    level: 'Iniciante',
    totalWeeks: 8,
    workoutsPerWeek: 3, // Total = 24 treinos
    goalLabel: '5 km',
  },
  '10k': {
    id: '10k',
    distanceLabel: '10',
    title: 'Evolução 10 km',
    description: 'Ganhe resistência e ritmo para chegar mais longe e correr melhor.',
    level: 'Intermediário',
    totalWeeks: 10,
    workoutsPerWeek: 4, // Total = 40 treinos
    goalLabel: '10 km',
  },
  '21k': {
    id: '21k',
    distanceLabel: '21',
    title: 'Meia Maratona 21 km',
    description: 'Prepare corpo e mente para cruzar a linha de chegada dos 21 km.',
    level: 'Avançado',
    totalWeeks: 12,
    workoutsPerWeek: 5, // Total = 60 treinos
    goalLabel: '21 km',
  },
};

@Injectable({ providedIn: 'root' })
export class TrainingPlanService {
  readonly activePlanId = signal<PlanId>(
    (localStorage.getItem('correja_active_plan') as PlanId) || '5k'
  );

  readonly completedWorkouts = signal<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('correja_completed_workouts') || '[]'))
  );

  readonly currentPlan = computed(() => PLANS_CATALOG[this.activePlanId()]);

  readonly totalPlanWorkouts = computed(() => {
    const plan = this.currentPlan();
    return plan.totalWeeks * plan.workoutsPerWeek;
  });

  readonly completedCountForCurrentPlan = computed(() => {
    const prefix = `${this.activePlanId()}-`;
    let count = 0;
    this.completedWorkouts().forEach((id) => {
      if (id.startsWith(prefix)) count++;
    });
    return count;
  });

  readonly progressPercentage = computed(() => {
    const total = this.totalPlanWorkouts();
    if (total === 0) return 0;
    const pct = Math.round((this.completedCountForCurrentPlan() / total) * 100);
    return Math.min(100, pct);
  });

  readonly currentWeek = computed(() => {
    const plan = this.currentPlan();
    const done = this.completedCountForCurrentPlan();
    const week = Math.floor(done / plan.workoutsPerWeek) + 1;
    return Math.min(plan.totalWeeks, week);
  });

  changePlan(newPlanId: PlanId): void {
    this.activePlanId.set(newPlanId);
    localStorage.setItem('correja_active_plan', newPlanId);
  }

  toggleWorkoutCompleted(week: number, workoutIndex: number): void {
    const workoutKey = `${this.activePlanId()}-w${week}-t${workoutIndex}`;
    const updated = new Set(this.completedWorkouts());

    if (updated.has(workoutKey)) {
      updated.delete(workoutKey);
    } else {
      updated.add(workoutKey);
    }

    this.completedWorkouts.set(updated);
    localStorage.setItem('correja_completed_workouts', JSON.stringify([...updated]));
  }

  isWorkoutCompleted(week: number, workoutIndex: number): boolean {
    return this.completedWorkouts().has(`${this.activePlanId()}-w${week}-t${workoutIndex}`);
  }
}