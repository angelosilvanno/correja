import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
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
import type { Subscription } from 'rxjs';

import { SupabaseService } from '../../core/services/supabase.service';
import { type PlanId, TrainingPlanService } from '../../core/services/training-plan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon]
})
export class DashboardPage implements OnInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  public planService = inject(TrainingPlanService);
  private cdr = inject(ChangeDetectorRef);
  private profileSub?: Subscription;

  athleteName = '';
  profilePhotoUrl: string | null = null;

  activePlan = this.planService.currentPlan;
  planProgressPct = this.planService.progressPercentage;
  currentPlanWeek = this.planService.currentWeek;

  progress = computed(() => {
    const plan = this.planService.currentPlan();
    const totalDone = this.planService.completedCountForCurrentPlan();
    const weekDone = totalDone % plan.workoutsPerWeek;

    return {
      completedCount: weekDone === 0 && totalDone > 0 ? plan.workoutsPerWeek : weekDone,
      plannedCount: plan.workoutsPerWeek,
      totalCompleted: totalDone,
      streakWeeks: Math.max(1, Math.floor(totalDone / plan.workoutsPerWeek))
    };
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

    this.profileSub = this.supabaseService.profile$.subscribe((profile) => {
      if (profile?.full_name) {
        this.athleteName = profile.full_name.trim();
        this.profilePhotoUrl = profile.avatar_url || null;
      } else if (!profile) {
        this.athleteName = '';
        this.profilePhotoUrl = null;
      }

      const profilePlan = (profile as { goal_plan?: string; selected_plan?: string } | null)?.goal_plan
        ?? (profile as { selected_plan?: string } | null)?.selected_plan;
      if (profilePlan) {
        this.syncPlanFromValue(profilePlan);
      }

      this.cdr.detectChanges();
    });

    await this.syncCloudUser();
  }

  public ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }

  public async ionViewWillEnter(): Promise<void> {
    this.loadUserData();
    await this.syncCloudUser();
    this.cdr.detectChanges();
  }

  private loadUserData(): void {
    const cachedProfile = this.supabaseService.currentProfileValue;
    if (cachedProfile?.full_name) {
      this.athleteName = cachedProfile.full_name.trim();
      this.profilePhotoUrl = cachedProfile.avatar_url || null;
    } else {
      const savedName = localStorage.getItem('correja_user_name');
      this.athleteName = savedName && savedName.trim() !== 'Corredor' ? savedName.trim() : '';
      this.profilePhotoUrl = localStorage.getItem('correja_user_photo') || null;
    }

    const savedPlan = localStorage.getItem('correja_active_plan');
    if (savedPlan) {
      this.syncPlanFromValue(savedPlan);
    }
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

      const cloudPlan = (profile as { goal_plan?: string; selected_plan?: string } | null)?.goal_plan
        ?? (profile as { selected_plan?: string } | null)?.selected_plan;
      if (cloudPlan) {
        this.syncPlanFromValue(cloudPlan);
      }

      this.cdr.detectChanges();
    } catch {
      // mantém dados locais caso esteja offline
    }
  }

  private syncPlanFromValue(rawPlan: string): void {
    const normalized = rawPlan.toLowerCase();
    let planId: PlanId = '5k';

    if (normalized.includes('21')) {
      planId = '21k';
    } else if (normalized.includes('10')) {
      planId = '10k';
    }

    if (this.planService.activePlanId() !== planId) {
      this.planService.changePlan(planId);
    }
  }

  public getAthleteInitials(): string {
    return this.athleteInitials;
  }
}