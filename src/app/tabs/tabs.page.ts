import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class TabsPage implements OnInit {
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
    return clean || 'Atleta CorreJa';
  }

  public get userInitials(): string {
    const clean = (this.userName ?? '').trim();
    if (!clean) return 'AC';

    const parts = clean.split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return `${first}${last}`.toUpperCase();
  }

  public ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const savedName = localStorage.getItem('correja_user_name');
    if (savedName) {
      this.userName = savedName.trim();
    }
  }
}