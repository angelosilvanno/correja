import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  bedOutline,
  checkmarkCircle,
  informationCircleOutline,
  playOutline,
  timeOutline
} from 'ionicons/icons';

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
  imports: [CommonModule, IonButton, IonContent, IonIcon],
  templateUrl: './plan-detail.page.html',
  styleUrls: ['./plan-detail.page.scss']
})
export class PlanDetailPage {
  private router = inject(Router);

  selectedWeek = 2; // Semana atual
  weeks = [1, 2, 3, 4, 5, 6];

  // Dados das sessões da semana atual do plano Primeiros 5 km
  currentWeekSessions: DaySession[] = [
    {
      dayName: 'Terça-feira',
      dayType: 'workout',
      title: 'Base Aeróbica e Fortalecimento',
      durationMinutes: 35,
      targetZone: 'Z2 - Leve',
      zoneColor: '#10b981',
      status: 'completed',
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
      status: 'completed',
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
      status: 'today',
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
      checkmarkCircle,
      informationCircleOutline,
      playOutline,
      timeOutline
    });
  }

  selectWeek(week: number): void {
    this.selectedWeek = week;
  }

  goBack(): void {
    this.router.navigate(['/tabs/plans']);
  }
}