import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bedOutline,
  bulbOutline,
  checkmarkCircle,
  checkmarkOutline,
  chevronBackOutline,
  chevronForwardOutline,
  happyOutline,
  informationCircleOutline,
  playOutline,
  pulseOutline,
  timeOutline
} from 'ionicons/icons';

import { TrainingPlanService } from '../../../core/services/training-plan.service';

interface DaySession {
  dayName: string;
  dayType: 'workout' | 'rest';
  title: string;
  durationMinutes: number;
  targetZone: string;
  zoneColor: string;
  status: 'completed' | 'today' | 'upcoming' | 'rest';
  purpose: string;
  structure: string;
}

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './plan-detail.page.html',
  styleUrls: ['./plan-detail.page.scss']
})
export class PlanDetailPage implements OnInit {
  private router = inject(Router);
  public planService = inject(TrainingPlanService);
  private readonly storageKey = 'correja_plan_completed_sessions';

  selectedWeek = 2;
  selectedWorkoutIndex = 0;

  currentWeekSessions: DaySession[] = [
    {
      dayName: 'Terça-feira',
      dayType: 'workout',
      title: 'Base Aeróbica e Fortalecimento',
      durationMinutes: 35,
      targetZone: 'Z2 - Leve',
      zoneColor: '#10b981',
      status: 'today',
      purpose: 'Estimula novos capilares nos músculos e fortalece tendões sem gerar fadiga.',
      structure: '5 min caminhada Z1 + 5x [3m trote Z2 + 2m caminhada Z1] + 5 min Z1'
    },
    {
      dayName: 'Quarta-feira',
      dayType: 'rest',
      title: 'Recuperação Muscular',
      durationMinutes: 0,
      targetZone: 'Descanso',
      zoneColor: '#64748b',
      status: 'rest',
      purpose: 'O corpo se adapta e fica mais forte durante o repouso.',
      structure: 'Descanso total ou 20 min de caminhada regenerativa muito leve.'
    },
    {
      dayName: 'Quinta-feira',
      dayType: 'workout',
      title: 'Sessão de Ritmo Confortável',
      durationMinutes: 30,
      targetZone: 'Z2 - Leve',
      zoneColor: '#10b981',
      status: 'upcoming',
      purpose: 'Treina a eficiência respiratória e a cadência de passada suave.',
      structure: '5 min caminhada Z1 + 4x [4m trote Z2 + 2m caminhada Z1] + 5 min Z1'
    },
    {
      dayName: 'Sexta-feira',
      dayType: 'rest',
      title: 'Descanso Ativo',
      durationMinutes: 0,
      targetZone: 'Descanso',
      zoneColor: '#64748b',
      status: 'rest',
      purpose: 'Alongamentos e mobilidade leve de tornozelos e quadril.',
      structure: 'Sem corrida hoje.'
    },
    {
      dayName: 'Sábado',
      dayType: 'workout',
      title: 'Longão de Base (Treino do Dia)',
      durationMinutes: 40,
      targetZone: 'Z2 - Leve',
      zoneColor: '#10b981',
      status: 'upcoming',
      purpose: 'Ensina o corpo a utilizar gordura como combustível por períodos mais longos.',
      structure: '5 min caminhada Z1 + 6x [3m trote Z2 + 2m caminhada Z1] + 5 min Z1'
    },
    {
      dayName: 'Domingo',
      dayType: 'rest',
      title: 'Regeneração Semanal',
      durationMinutes: 0,
      targetZone: 'Descanso',
      zoneColor: '#64748b',
      status: 'rest',
      purpose: 'Prepara seu corpo para iniciar a Semana 3 com energia máxima.',
      structure: 'Descanso completo.'
    }
  ];

  constructor() {
    addIcons({
      arrowBackOutline,
      bedOutline,
      bulbOutline,
      checkmarkCircle,
      checkmarkOutline,
      chevronBackOutline,
      chevronForwardOutline,
      happyOutline,
      informationCircleOutline,
      playOutline,
      pulseOutline,
      timeOutline
    });
  }

  public get weeks(): number[] {
    const total = this.planService.currentPlan().totalWeeks;
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  public get workoutSessions(): DaySession[] {
    return this.currentWeekSessions.filter((session) => session.dayType === 'workout');
  }

  public get activeSession(): DaySession | null {
    const workouts = this.workoutSessions;
    if (!workouts.length) return null;
    const safeIndex = Math.min(Math.max(this.selectedWorkoutIndex, 0), workouts.length - 1);
    return workouts[safeIndex];
  }

  public ngOnInit(): void {
    this.selectedWeek = this.planService.currentWeek();
    this.restoreSavedStatuses();
    const firstPendingIdx = this.workoutSessions.findIndex((s) => s.status !== 'completed');
    this.selectedWorkoutIndex = firstPendingIdx >= 0 ? firstPendingIdx : 0;
  }

  public ionViewWillEnter(): void {
    if (this.selectedWeek > this.planService.currentPlan().totalWeeks) {
      this.selectedWeek = 1;
    }
    this.restoreSavedStatuses();
  }

  selectWeek(week: number): void {
    this.selectedWeek = week;
    this.restoreSavedStatuses();
    const firstPendingIdx = this.workoutSessions.findIndex((s) => s.status !== 'completed');
    this.selectedWorkoutIndex = firstPendingIdx >= 0 ? firstPendingIdx : 0;
  }

  selectWorkout(index: number): void {
    this.selectedWorkoutIndex = index;
  }

  prevWorkout(): void {
    if (this.selectedWorkoutIndex > 0) {
      this.selectedWorkoutIndex--;
    }
  }

  nextWorkout(): void {
    if (this.selectedWorkoutIndex < this.workoutSessions.length - 1) {
      this.selectedWorkoutIndex++;
    }
  }

  goBack(): void {
    this.router.navigate(['/tabs/plans']);
  }

  completeSession(session: DaySession): void {
    const workoutIdx = this.workoutSessions.indexOf(session);
    if (workoutIdx === -1) return;

    // Alterna no TrainingPlanService global (atualiza imediatamente a barra de progresso no Dashboard)
    this.planService.toggleWorkoutCompleted(this.selectedWeek, workoutIdx);

    const isDone = this.planService.isWorkoutCompleted(this.selectedWeek, workoutIdx);
    session.status = isDone ? 'completed' : 'today';
    this.saveStatus(session);
  }

  private getSessionKey(session: DaySession): string {
    return `${this.planService.activePlanId()}_w${this.selectedWeek}_${session.dayName}`;
  }

  private saveStatus(session: DaySession): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const map: Record<string, 'completed' | 'today'> = raw ? JSON.parse(raw) : {};
      map[this.getSessionKey(session)] = session.status === 'completed' ? 'completed' : 'today';
      localStorage.setItem(this.storageKey, JSON.stringify(map));
    } catch (error) {
      console.warn('Não foi possível salvar o status do treino.', error);
    }
  }

  private restoreSavedStatuses(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      const map: Record<string, 'completed' | 'today'> = raw ? JSON.parse(raw) : {};

      this.workoutSessions.forEach((session, workoutIdx) => {
        const isDoneInService = this.planService.isWorkoutCompleted(this.selectedWeek, workoutIdx);
        const saved = map[this.getSessionKey(session)];

        if (isDoneInService || saved === 'completed') {
          session.status = 'completed';
          if (!isDoneInService) {
            this.planService.toggleWorkoutCompleted(this.selectedWeek, workoutIdx);
          }
        } else {
          session.status = workoutIdx === 0 ? 'today' : 'upcoming';
        }
      });
    } catch (error) {
      console.warn('Não foi possível restaurar os treinos salvos.', error);
    }
  }
}