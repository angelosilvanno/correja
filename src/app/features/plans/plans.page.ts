import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkCircle, flagOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonIcon
  ],
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss']
})
export class PlansPage {
  constructor() {
    addIcons({ checkmarkCircle, flagOutline, timeOutline });
  }

  plans = [
    {
      id: 'p-5k',
      title: 'Primeiros 5 km',
      subtitle: 'Da caminhada aos seus primeiros 5 km sem parar.',
      level: 'Iniciante',
      durationWeeks: 6,
      sessionsPerWeek: 3,
      active: true,
      badgeColor: '#0284c7'
    },
    {
      id: 'p-zero',
      title: 'Comece a Correr do Zero',
      subtitle: 'Adaptação muscular e respiratória com blocos graduais.',
      level: 'Sedentário / Iniciante',
      durationWeeks: 8,
      sessionsPerWeek: 3,
      active: false,
      badgeColor: '#10b981'
    },
    {
      id: 'p-10k',
      title: 'Evolução para 10 km',
      subtitle: 'Desenvolva base sólida e ritmo sustentável.',
      level: 'Intermediário',
      durationWeeks: 10,
      sessionsPerWeek: 4,
      active: false,
      badgeColor: '#f59e0b'
    },
    {
      id: 'p-21k',
      title: 'Meia Maratona (21 km)',
      subtitle: 'Longões e treinos em limiar aeróbico com segurança.',
      level: 'Avançado',
      durationWeeks: 14,
      sessionsPerWeek: 4,
      active: false,
      badgeColor: '#ef4444'
    }
  ];
}