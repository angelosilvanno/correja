import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  calendarClearOutline,
  calendarOutline,
  chatbubbleEllipsesOutline,
  checkmark,
  checkmarkCircle,
  chevronForwardOutline,
  flame,
  flameOutline,
  radioButtonOnOutline,
  timeOutline,
  trophyOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon, IonButton]
})
export class DashboardPage implements OnInit {
  athleteName = '';

  progress = signal({
    completedCount: 3,
    plannedCount: 8,
    streakWeeks: 2
  });

  workout = signal({
    title: 'Intervalado leve',
    subtitle: 'Ganhar resistência com controle',
    completed: false,
    primaryZone: 'Z2',
    totalDurationMinutes: 35
  });

  targetZone = {
    id: 'Z2',
    shortName: 'Z2 - Leve / Base',
    colorHex: '#10b981'
  };

  constructor() {
    addIcons({
      arrowForwardOutline,
      calendarClearOutline,
      calendarOutline,
      chatbubbleEllipsesOutline,
      checkmark,
      checkmarkCircle,
      chevronForwardOutline,
      flame,
      flameOutline,
      radioButtonOnOutline,
      timeOutline,
      trophyOutline
    });
  }

  public get currentDateFormatted(): string {
    const now = new Date();
    const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    return `${weekday}, ${day} de ${month}`.toUpperCase();
  }

  public get firstName(): string {
    const cleanName = (this.athleteName ?? '').trim();
    if (!cleanName) return 'Atleta';
    return cleanName.split(/\s+/)[0];
  }

  public get athleteInitials(): string {
    const cleanName = (this.athleteName ?? '').trim();
    if (!cleanName) return 'AC';

    const parts = cleanName.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  public ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const savedName = localStorage.getItem('correja_user_name');
    if (savedName) {
      this.athleteName = savedName.trim();
    }
  }

  public getAthleteInitials(): string {
    return this.athleteInitials;
  }
}