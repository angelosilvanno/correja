import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  calendarOutline,
  checkmarkCircle,
  checkmarkOutline,
  chevronBackOutline,
  chevronForwardOutline,
  flagOutline,
  flashOutline,
  helpCircleOutline,
  locationOutline,
  moonOutline,
  repeatOutline,
  timeOutline
} from 'ionicons/icons';

export interface TrainingPlan {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  active: boolean;
}

export interface CalendarDayItem {
  date: Date;
  isoDate: string;
  dayNumber: number;
  weekdayShort: string;
  isToday: boolean;
}

export interface ScheduleDayRow {
  isoDate: string;
  dayNumber: number;
  weekdayShort: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  isRest: boolean;
  isToday: boolean;
  status: 'completed' | 'today' | 'upcoming';
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss']
})
export class PlansPage implements OnInit {
  private router = inject(Router);

  plans: TrainingPlan[] = [
    {
      id: 'p-5k',
      level: 'INICIANTE',
      title: 'Primeiros 5 km',
      subtitle: 'Construa sua base com segurança e transforme caminhada em corrida.',
      durationWeeks: 8,
      sessionsPerWeek: 3,
      active: true
    },
    {
      id: 'p-10k',
      level: 'INTERMEDIÁRIO',
      title: 'Evolua para 10 km',
      subtitle: 'Ganhe resistência, controle de ritmo e conforto para ir mais longe.',
      durationWeeks: 10,
      sessionsPerWeek: 3,
      active: false
    },
    {
      id: 'p-21k',
      level: 'AVANÇADO',
      title: 'Desafio 21 km',
      subtitle: 'Prepare corpo e mente para completar sua primeira meia-maratona.',
      durationWeeks: 14,
      sessionsPerWeek: 3,
      active: false
    }
  ];

  selectedPlan: TrainingPlan | null = null;
  selectedWeek = 3;

  currentViewYear = 0;
  currentViewMonth = 0;
  selectedDateIso = '';
  calendarDays: CalendarDayItem[] = [];
  weekScheduleRows: ScheduleDayRow[] = [];

  private readonly weekdayLabels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      calendarOutline,
      checkmarkCircle,
      checkmarkOutline,
      chevronBackOutline,
      chevronForwardOutline,
      flagOutline,
      flashOutline,
      helpCircleOutline,
      locationOutline,
      moonOutline,
      repeatOutline,
      timeOutline
    });
  }

  public get planWeeks(): number[] {
    const total = this.selectedPlan?.durationWeeks ?? 8;
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  public get currentMonthYearLabel(): string {
    const refDate = new Date(this.currentViewYear, this.currentViewMonth, 1);
    const monthName = refDate.toLocaleDateString('pt-BR', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${this.currentViewYear}`;
  }

  public ngOnInit(): void {
    this.initializeTodayCalendar();
  }

  public getPlanDistanceNumber(plan: TrainingPlan): string {
    const match = plan.title.match(/\d+/);
    return match ? match[0] : '5';
  }

  public getPlanHighlights(plan: TrainingPlan): string[] {
    if (plan.id === 'p-10k') {
      return ['Volume progressivo', 'Treinos de ritmo', 'Recuperação planejada'];
    }
    if (plan.id === 'p-21k') {
      return ['Treinos longos', 'Ritmo e intensidade', 'Cronograma progressivo'];
    }
    return ['Progressão gradual', 'Caminhada + corrida', 'Desenvolvimento de resistência'];
  }

  public getWeekPhaseTitle(week: number): string {
    return week <= 3 ? 'Construindo resistência' : 'Evolução gradual';
  }

  public openPlanSchedule(plan: TrainingPlan): void {
    this.selectedPlan = plan;
    this.selectedWeek = plan.active ? 3 : 1;
    this.initializeTodayCalendar();
    this.buildWeekRowsFromDate(this.parseLocalIsoDate(this.selectedDateIso));
  }

  public closePlanSchedule(): void {
    this.selectedPlan = null;
  }

  public viewSchedule(planId: string): void {
    this.router.navigate(['/tabs/plans', planId]);
  }

  public selectWeek(week: number): void {
    if (!this.selectedPlan) return;
    if (week < 1 || week > this.selectedPlan.durationWeeks) return;
    this.selectedWeek = week;
    const baseDate = this.parseLocalIsoDate(this.selectedDateIso);
    this.buildWeekRowsFromDate(baseDate);
  }

  public changeMonth(offset: number): void {
    const target = new Date(this.currentViewYear, this.currentViewMonth + offset, 1);
    this.currentViewYear = target.getFullYear();
    this.currentViewMonth = target.getMonth();
    this.generateMonthDays(this.currentViewYear, this.currentViewMonth);

    const todayIso = this.toLocalIsoDate(new Date());
    const hasToday = this.calendarDays.some((d) => d.isoDate === todayIso);
    const chosen = hasToday ? todayIso : this.calendarDays[0].isoDate;
    this.selectedDateIso = chosen;
    this.buildWeekRowsFromDate(this.parseLocalIsoDate(chosen));
  }

  public selectCalendarDate(dayItem: CalendarDayItem): void {
    this.selectedDateIso = dayItem.isoDate;
    this.buildWeekRowsFromDate(dayItem.date);
  }

  public onSelectScheduleRow(row: ScheduleDayRow): void {
    this.selectedDateIso = row.isoDate;
    if (!row.isRest && this.selectedPlan) {
      this.viewSchedule(this.selectedPlan.id);
    }
  }

  private initializeTodayCalendar(): void {
    const today = new Date();
    this.currentViewYear = today.getFullYear();
    this.currentViewMonth = today.getMonth();
    this.selectedDateIso = this.toLocalIsoDate(today);
    this.generateMonthDays(this.currentViewYear, this.currentViewMonth);
  }

  private generateMonthDays(year: number, month: number): void {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = this.toLocalIsoDate(new Date());
    const days: CalendarDayItem[] = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const iso = this.toLocalIsoDate(dateObj);
      days.push({
        date: dateObj,
        isoDate: iso,
        dayNumber: day,
        weekdayShort: this.weekdayLabels[dateObj.getDay()],
        isToday: iso === todayIso
      });
    }

    this.calendarDays = days;
  }

  private buildWeekRowsFromDate(anchorDate: Date): void {
    const today = new Date();
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const startOfWeek = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() - 2);

    const templates = [
      { title: 'Corrida leve', subtitle: 'Ritmo confortável e constante', durationLabel: '30 min • Z2', isRest: false },
      { title: 'Descanso', subtitle: 'Recuperação e sono adequado', durationLabel: 'Recuperação', isRest: true },
      { title: 'Intervalado leve', subtitle: 'Controle de ritmo e resistência', durationLabel: '35 min • Z3', isRest: false },
      { title: 'Descanso', subtitle: 'Recuperação e sono adequado', durationLabel: 'Recuperação', isRest: true },
      { title: 'Caminhada + corrida', subtitle: 'Construção de base aeróbica', durationLabel: '25 min • Z2', isRest: false },
      { title: 'Descanso', subtitle: 'Recuperação e sono adequado', durationLabel: 'Recuperação', isRest: true },
      { title: 'Corrida contínua', subtitle: 'Construção de base aeróbica', durationLabel: '40 min • Z2', isRest: false }
    ];

    this.weekScheduleRows = templates.map((tpl, index) => {
      const dateObj = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + index);
      const iso = this.toLocalIsoDate(dateObj);
      const rowTime = dateObj.getTime();
      const isToday = rowTime === todayZero;

      let status: 'completed' | 'today' | 'upcoming' = 'upcoming';
      if (isToday) {
        status = 'today';
      } else if (rowTime < todayZero) {
        status = 'completed';
      }

      return {
        isoDate: iso,
        dayNumber: dateObj.getDate(),
        weekdayShort: this.weekdayLabels[dateObj.getDay()],
        title: tpl.title,
        subtitle: tpl.subtitle,
        durationLabel: tpl.durationLabel,
        isRest: tpl.isRest,
        isToday,
        status
      };
    });
  }

  private toLocalIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private parseLocalIsoDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
}