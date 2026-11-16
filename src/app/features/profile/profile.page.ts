import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  calendarOutline,
  chevronForwardOutline,
  createOutline,
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
      calendarOutline,
      chevronForwardOutline,
      createOutline,
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

  editName(): void {
    const newName = prompt('Como prefere ser chamado(a)?', this.athleteName);
    if (newName && newName.trim() !== '') {
      this.athleteName = newName.trim();
      localStorage.setItem('correja_athlete_name', this.athleteName);
    }
  }

  goToZones(): void {
    this.router.navigate(['/tabs/zones']);
  }

  goToPlans(): void {
    this.router.navigate(['/tabs/plans']);
  }

  logout(): void {
    if (confirm('Deseja realmente sair da sua conta?')) {
      this.router.navigate(['/auth']);
    }
  }
}