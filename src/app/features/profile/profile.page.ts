import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  chevronForwardOutline,
  flameOutline,
  logOutOutline,
  notificationsOutline,
  pulseOutline,
  sparklesOutline,
  speedometerOutline,
  timeOutline,
  trophyOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  private router = inject(Router);

  constructor() {
    addIcons({
      arrowForwardOutline,
      chevronForwardOutline,
      flameOutline,
      logOutOutline,
      notificationsOutline,
      pulseOutline,
      sparklesOutline,
      speedometerOutline,
      timeOutline,
      trophyOutline
    });
  }

  logout(): void {
    this.router.navigate(['/auth']);
  }
}