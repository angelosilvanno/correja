import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chatbubbleOutline,
  chatbubblesOutline,
  chevronForwardOutline,
  fitnessOutline,
  flashOutline,
  micOutline,
  radioButtonOnOutline,
  sparklesOutline,
  speedometerOutline,
  timeOutline
} from 'ionicons/icons';

export type TrainingLevel = 'all' | 'iniciante' | 'intermediario' | 'avancado';

export interface ZoneWorkoutExample {
  level: Exclude<TrainingLevel, 'all'>;
  levelLabel: string;
  duration: string;
  workoutTitle: string;
  instructions: string;
}

export interface TrainingZone {
  id: string;
  name: string;
  perceivedEffort: string;
  colorHex: string;
  textColorHex: string;
  tagline: string;
  talkTest: string;
  workoutExamples: ZoneWorkoutExample[];
}

@Component({
  selector: 'app-zones-guide',
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon],
  templateUrl: './zones-guide.page.html',
  styleUrls: ['./zones-guide.page.scss']
})
export class ZonesGuidePage {
  selectedLevel = signal<TrainingLevel>('all');
  selectedZoneId = signal<string>('Z1');

  zones: TrainingZone[] = [
    {
      id: 'Z1',
      name: 'Recuperação',
      perceivedEffort: 'MUITO LEVE',
      colorHex: '#38bdf8',
      textColorHex: '#ffffff',
      tagline: 'Recuperar o corpo e estimular a circulação.',
      talkTest: 'Respiração tranquila. Conversa sem esforço.',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          duration: '20 min',
          workoutTitle: 'Caminhada leve regenerativa',
          instructions: '20 minutos de caminhada confortável mantendo postura relaxada.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          duration: '25 min',
          workoutTitle: 'Trote regenerativo solto',
          instructions: '25 minutos de trote bem leve sem preocupação com ritmo.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          duration: '30 min',
          workoutTitle: 'Rodagem de recuperação ativa',
          instructions: '30 minutos contínuos em esforço mínimo no dia seguinte a treinos fortes.'
        }
      ]
    },
    {
      id: 'Z2',
      name: 'Base aeróbica',
      perceivedEffort: 'LEVE',
      colorHex: '#10b981',
      textColorHex: '#ffffff',
      tagline: 'Construir resistência e eficiência da corrida.',
      talkTest: 'Confortável. Você fala frases completas.',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          duration: '30 min',
          workoutTitle: 'Alternado caminhada + trote',
          instructions: '5 min caminhada + 5x (3 min trote Z2 + 2 min caminhada).'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          duration: '40 min',
          workoutTitle: 'Corrida contínua de base',
          instructions: '40 minutos em ritmo estável onde seja possível conversar.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          duration: '60 min',
          workoutTitle: 'Longão aeróbico controlado',
          instructions: '60 minutos constantes mantendo baixa fadiga muscular.'
        }
      ]
    },
    {
      id: 'Z3',
      name: 'Resistência',
      perceivedEffort: 'MODERADO',
      colorHex: '#f59e0b',
      textColorHex: '#ffffff',
      tagline: 'Sustentar um esforço controlado por mais tempo.',
      talkTest: 'Respiração presente. Frases mais curtas.',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          duration: '25 min',
          workoutTitle: 'Blocos moderados curtos',
          instructions: '10 min Z1/Z2 + 3x (3 min Z3 + 2 min caminhada).'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          duration: '35 min',
          workoutTitle: 'Tempo contínuo moderado',
          instructions: '10 min aquecimento + 15 min Z3 + 10 min volta à calma.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          duration: '45 min',
          workoutTitle: 'Progressivo aeróbico',
          instructions: '20 min Z2 seguidos de 20 min firmes em Z3 + 5 min Z1.'
        }
      ]
    },
    {
      id: 'Z4',
      name: 'Limiar',
      perceivedEffort: 'FORTE',
      colorHex: '#f97316',
      textColorHex: '#ffffff',
      tagline: 'Aumentar a tolerância a ritmos fortes.',
      talkTest: 'Fala difícil. Poucas palavras por vez.',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          duration: '28 min',
          workoutTitle: 'Estímulos curtos controlados',
          instructions: '10 min Z1 + 4x (2 min Z4 + 2 min caminhada) + 2 min Z1.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          duration: '36 min',
          workoutTitle: 'Intervalado de limiar',
          instructions: '10 min Z2 + 4x (4 min Z4 + 2 min trote leve) + 2 min Z1.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          duration: '45 min',
          workoutTitle: 'Séries sustentadas de limiar',
          instructions: '12 min Z2 + 3x (8 min Z4 + 2 min trote) + 3 min Z1.'
        }
      ]
    },
    {
      id: 'Z5',
      name: 'Alta intensidade',
      perceivedEffort: 'MUITO FORTE',
      colorHex: '#ef4444',
      textColorHex: '#ffffff',
      tagline: 'Desenvolver potência e capacidade máxima.',
      talkTest: 'Muito difícil. Falar não é confortável.',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          duration: '24 min',
          workoutTitle: 'Tiros curtos com pausa ampla',
          instructions: '10 min Z1 + 6x (30s forte + 90s caminhada) + 2 min Z1.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          duration: '32 min',
          workoutTitle: 'Intervalado de velocidade',
          instructions: '10 min Z2 + 8x (1 min Z5 + 1 min 30s trote leve) + 2 min Z1.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          duration: '40 min',
          workoutTitle: 'Tiros de potência aeróbica',
          instructions: '12 min Z2 + 6x (2 min Z5 + 2 min trote) + 4 min Z1.'
        }
      ]
    }
  ];

  activeZone = computed<TrainingZone>(() => {
    const id = this.selectedZoneId();
    return this.zones.find((z) => z.id === id) ?? this.zones[0];
  });

  constructor() {
    addIcons({
      calendarOutline,
      chatbubbleOutline,
      chatbubblesOutline,
      chevronForwardOutline,
      fitnessOutline,
      flashOutline,
      micOutline,
      radioButtonOnOutline,
      sparklesOutline,
      speedometerOutline,
      timeOutline
    });
  }

  public setLevel(level: TrainingLevel): void {
    this.selectedLevel.set(level);
  }

  public selectZone(zone: TrainingZone): void {
    this.selectedZoneId.set(zone.id);
  }

  public getFilteredWorkouts(examples: ZoneWorkoutExample[]): ZoneWorkoutExample[] {
    const level = this.selectedLevel();
    if (level === 'all') return examples;
    return examples.filter((item) => item.level === level);
  }

  public getWhenToUse(zoneId: string): string {
    const usageMap: Record<string, string> = {
      Z1: 'Aquecimento, volta à calma e dias regenerativos.',
      Z2: 'Maior parte das corridas semanais.',
      Z3: 'Treinos progressivos e ritmados.',
      Z4: 'Séries curtas após ter boa base.',
      Z5: 'Tiros curtos, com orientação completa.'
    };
    return usageMap[zoneId] ?? 'Treinos estruturados conforme seu plano.';
  }

  public getWorkoutSummary(zone: TrainingZone): string {
    const first = zone.workoutExamples[0];
    return first ? `${first.duration} — ${first.workoutTitle.toLowerCase()}.` : 'Sessão guiada por sensação.';
  }
}