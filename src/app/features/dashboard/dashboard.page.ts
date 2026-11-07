import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  flameOutline,
  informationCircleOutline,
  playOutline,
  sparklesOutline,
  speedometerOutline,
  timeOutline,
  trendingUpOutline
} from 'ionicons/icons';

import { WorkoutService } from '../../core/services/workout.service';
import { ZoneService } from '../../core/services/zone.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, IonIcon],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  private workoutService = inject(WorkoutService);
  private zoneService = inject(ZoneService);

  athleteName: string = localStorage.getItem('correja_athlete_name') || 'Atleta';
  workout = this.workoutService.todayWorkout;
  progress = this.workoutService.weeklyProgress;

  constructor() {
    addIcons({
      checkmarkCircle,
      flameOutline,
      informationCircleOutline,
      playOutline,
      sparklesOutline,
      speedometerOutline,
      timeOutline,
      trendingUpOutline
    });
  }

  get targetZone(): ReturnType<ZoneService['getZone']> { 
    return this.zoneService.getZone(this.workout().primaryZone); 
  }

  get progressRatio(): number {
    const p = this.progress();
    return p.completedCount / p.plannedCount;
  }

  onCompleteWorkout(): void {
    this.workoutService.completeTodayWorkout();
  }
}