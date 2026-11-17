import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon, IonButton]
})
export class DashboardPage implements OnInit {
  athleteName = 'Lucas';
  currentDateFormatted = '';

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

  public ngOnInit(): void {
    this.loadDynamicDate();
    this.loadUserData();
  }

  private loadDynamicDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const formatted = now.toLocaleDateString('pt-BR', options);
    this.currentDateFormatted = formatted.toUpperCase();
  }

  private loadUserData(): void {
    const savedName = localStorage.getItem('correja_user_name');
    if (savedName) {
      this.athleteName = savedName;
    }
  }

  public getAthleteInitials(): string {
    const parts = this.athleteName.trim().split(' ');
    if (parts.length === 0 || !parts[0]) return 'LM';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}