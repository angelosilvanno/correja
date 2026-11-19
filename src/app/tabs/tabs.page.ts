import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  documentTextOutline,
  homeOutline,
  personOutline,
  sparklesOutline,
  speedometerOutline
} from 'ionicons/icons';

import { SupabaseService } from '../core/services/supabase.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage implements OnInit {
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  userName = '';
  activePlanLabel = 'Plano 5 km';

  constructor() {
    addIcons({
      chevronForwardOutline,
      documentTextOutline,
      homeOutline,
      personOutline,
      sparklesOutline,
      speedometerOutline
    });
  }

  public get fullUserName(): string {
    const clean = (this.userName ?? '').trim();
    if (!clean || clean === 'Corredor' || clean === 'Atleta CorreJa') {
      return 'Atleta CorreJa';
    }

    const parts = clean.split(/\s+/);
    return parts.slice(0, 2).join(' ');
  }

  public get userInitials(): string {
    const clean = (this.userName ?? '').trim();
    if (!clean) return 'AC';

    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const first = parts[0].charAt(0);
    const second = parts[1].charAt(0);
    return `${first}${second}`.toUpperCase();
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
      this.userName = savedName.trim();
    }
  }

  private async syncCloudUser(): Promise<void> {
    try {
      const profile = await this.supabaseService.getProfile();
      if (profile?.full_name) {
        this.userName = profile.full_name.trim();
        localStorage.setItem('correja_user_name', this.userName);
      }

      if (profile?.active_plan_id) {
        this.activePlanLabel = `Plano ${profile.active_plan_id.replace('k', ' km')}`;
      }

      this.cdr.detectChanges();
    } catch {
      // mantém dados locais caso esteja offline
    }
  }
}