import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
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

import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon]
})
export class DashboardPage implements OnInit {
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  athleteName = '';
  profilePhotoUrl: string | null = null;

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
    if (!cleanName || cleanName === 'Corredor' || cleanName === 'Atleta CorreJa') {
      return '';
    }
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

  public async ngOnInit(): Promise<void> {
    this.loadUserData();
    await this.syncCloudUser();
  }

  public async ionViewWillEnter(): Promise<void> {
    this.loadUserData();
    await this.syncCloudUser();
  }

  private loadUserData(): void {
    const savedName = localStorage.getItem('correja_user_name');
    if (savedName && savedName.trim() !== 'Corredor') {
      this.athleteName = savedName.trim();
    }

    const savedPhoto = localStorage.getItem('correja_user_photo');
    this.profilePhotoUrl = savedPhoto || null;
  }

  private async syncCloudUser(): Promise<void> {
    try {
      const [user, profile] = await Promise.all([
        this.supabaseService.getCurrentUser(),
        this.supabaseService.getProfile()
      ]);

      if (profile?.full_name) {
        this.athleteName = profile.full_name.trim();
        localStorage.setItem('correja_user_name', this.athleteName);

        // Garante que contas antigas também gravem o full_name no user_metadata do Auth
        if (user && user.user_metadata?.['full_name'] !== this.athleteName) {
          await this.supabaseService.upsertProfile({
            id: user.id,
            full_name: this.athleteName
          });
        }
      }

      if (profile?.avatar_url) {
        this.profilePhotoUrl = profile.avatar_url;
        localStorage.setItem('correja_user_photo', profile.avatar_url);
      }

      this.cdr.detectChanges();
    } catch {
      // mantém dados locais caso esteja offline
    }
  }

  public getAthleteInitials(): string {
    return this.athleteInitials;
  }
}