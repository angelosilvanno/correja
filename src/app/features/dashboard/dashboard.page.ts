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

  public get currentDateFormatted(): string {
    const now = new Date();
    const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    return `${weekday}, ${day} de ${month}`.toUpperCase();
  }

  public get firstName(): string {
    const cleanName = (this.athleteName ?? '').trim();
    if (!cleanName) return '';
    return cleanName.split(/\s+/)[0];
  }

  public get athleteInitials(): string {
    const cleanName = (this.athleteName ?? '').trim();
    if (!cleanName) return '';

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