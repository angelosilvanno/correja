import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  chatbubblesOutline,
  checkmarkDoneOutline,
  fitnessOutline,
  flameOutline,
  informationCircleOutline,
  sparklesOutline,
  speedometerOutline,
  timeOutline
} from 'ionicons/icons';

import type { ZoneWorkoutExample } from '../../core/models/training-zone.model';
import { ZoneService } from '../../core/services/zone.service';

type LevelFilter = 'all' | 'iniciante' | 'intermediario' | 'avancado';

@Component({
  selector: 'app-zones-guide',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './zones-guide.page.html',
  styleUrls: ['./zones-guide.page.scss']
})
export class ZonesGuidePage {
  private zoneService = inject(ZoneService);
  zones = this.zoneService.getAllZones();

  selectedLevel = signal<LevelFilter>('all');

  constructor() {
    addIcons({
      barChartOutline,
      chatbubblesOutline,
      checkmarkDoneOutline,
      fitnessOutline,
      flameOutline,
      informationCircleOutline,
      sparklesOutline,
      speedometerOutline,
      timeOutline
    });
  }

  setLevel(level: LevelFilter): void {
    this.selectedLevel.set(level);
  }

  getFilteredWorkouts(examples: ZoneWorkoutExample[]): ZoneWorkoutExample[] {
    const current = this.selectedLevel();
    if (current === 'all') {
      return examples;
    }
    return examples.filter(e => e.level === current);
  }
}