import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
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

  athleteName: string = localStorage.getItem('correja_athlete_name') || 'Atleta';
  registerForm!: FormGroup;

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

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const name = this.registerForm.value.name;

    localStorage.setItem('correja_athlete_name', name);
    this.athleteName = name;

    this.router.navigate(['/tabs/dashboard']);
  }

  logout(): void {
    this.router.navigate(['/auth']);
  }
}