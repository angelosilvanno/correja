import { Injectable, signal } from '@angular/core';

import type { TrainingZone, ZoneId } from '../models/training-zone.model';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  private readonly zones = signal<Record<ZoneId, TrainingZone>>({
    Z1: {
      id: 'Z1',
      name: 'Recuperação Ativa',
      shortName: 'Z1 - Muito Leve',
      tagline: 'Regeneração muscular e relaxamento',
      talkTest: 'Consegue cantar ou manter diálogos longos sem parar para respirar.',
      perceivedEffort: '1 a 3 de 10',
      purpose: 'Estimula a circulação sanguínea acelerando a recuperação sem gerar cansaço.',
      colorHex: '#0ea5e9',
      textColorHex: '#ffffff',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          workoutTitle: 'Caminhada Dinâmica Regenerativa',
          duration: '20 a 30 min',
          instructions: 'Caminhada com postura ereta e respiração 100% pelo nariz. Braços soltos e ritmo relaxado para soltar a musculatura.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          workoutTitle: 'Trote Suave de Soltura',
          duration: '25 a 35 min',
          instructions: 'Trote muito lento no dia seguinte ao longão. O objetivo é apenas oxigenar as pernas, sem qualquer esforço respiratório.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          workoutTitle: 'Desaquecimento & Recuperação Ativa',
          duration: '30 a 45 min',
          instructions: 'Corrida regenerativa pós-treino de tiros com foco em relaxamento articular e hidratação contínua.'
        }
      ]
    },
    Z2: {
      id: 'Z2',
      name: 'Base Aeróbica (Fácil)',
      shortName: 'Z2 - Leve / Base',
      tagline: 'O coração da evolução na corrida',
      talkTest: 'Consegue conversar em frases completas confortavelmente.',
      perceivedEffort: '4 a 5 de 10',
      purpose: 'Desenvolve a eficiência cardiovascular e ensina o corpo a queimar gordura como combustível.',
      colorHex: '#10b981',
      textColorHex: '#ffffff',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          workoutTitle: 'Alternância Trote e Caminhada (Run-Walk)',
          duration: '35 min',
          instructions: '5 min caminhada Z1 + 5x [3 min trote leve Z2 + 2 min caminhada Z1] + 5 min Z1. Não corra rápido no trote!'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          workoutTitle: 'Rodagem Contínua de Base',
          duration: '45 a 60 min',
          instructions: 'Corrida contínua mantendo o mesmo ritmo do primeiro ao último minuto. Se a respiração apertar, diminua a passada.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          workoutTitle: 'Longão Clássico de Resistência',
          duration: '75 a 90 min',
          instructions: 'Longão de final de semana em Zona 2 pura para adaptação mitocondrial e consumo de lipídios.'
        }
      ]
    },
    Z3: {
      id: 'Z3',
      name: 'Moderada (Ritmo)',
      shortName: 'Z3 - Moderada',
      tagline: 'Velocidade de cruzeiro controlada',
      talkTest: 'Fala apenas frases curtas de 3 a 5 palavras por vez.',
      perceivedEffort: '6 a 7 de 10',
      purpose: 'Melhora a sustentação de velocidade em distâncias maiores.',
      colorHex: '#f59e0b',
      textColorHex: '#1f2937',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          workoutTitle: 'Blocos Progressivos Curtos',
          duration: '30 min',
          instructions: '10 min aquecimento Z1/Z2 + 3 séries de [3 min em ritmo firme Z3 + 2 min caminhada Z1] + 5 min desaquecimento.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          workoutTitle: 'Tempo Run Sustentado',
          duration: '40 min',
          instructions: '10 min aquecimento Z2 + 20 min contínuos na Zona 3 (ritmo de cruzeiro) + 10 min volta à calma Z1.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          workoutTitle: 'Blocos de Ritmo de Meia Maratona',
          duration: '60 min',
          instructions: '15 min aquecimento + 2x [18 min no ritmo alvo de prova Z3 com 4 min trote Z2 de intervalo] + desaquecimento.'
        }
      ]
    },
    Z4: {
      id: 'Z4',
      name: 'Limiar Anaeróbico',
      shortName: 'Z4 - Intensa',
      tagline: 'Desconforto produtivo sustentável',
      talkTest: 'Dificuldade para responder mais do que palavras soltas como "sim" ou "não".',
      perceivedEffort: '8 de 10',
      purpose: 'Aumenta a capacidade de suportar acúmulo de ácido lático e melhora o ritmo de prova.',
      colorHex: '#f97316',
      textColorHex: '#ffffff',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          workoutTitle: 'Acelerações Suaves (Strides)',
          duration: '25 min',
          instructions: '20 min trote leve Z2 + 4 retas de 50 metros em ritmo vivo e postura elegante, caminhando 1 minuto entre cada.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          workoutTitle: 'Intervalado de Limiar (Tiros Médios)',
          duration: '45 min',
          instructions: '10 min aquecimento + 5x [800 metros no ritmo de prova de 5k com 2 min de trote leve Z1] + 5 min volta à calma.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          workoutTitle: 'Repetições de Limiar de Lactato',
          duration: '60 min',
          instructions: '15 min aquecimento + 4x [2.000m na Zona 4 com 2m30 de recuperação ativa] + 10 min desaquecimento Z1.'
        }
      ]
    },
    Z5: {
      id: 'Z5',
      name: 'Potência Máxima',
      shortName: 'Z5 - Máxima',
      tagline: 'Intervalos curtos e explosivos',
      talkTest: 'Impossível conversar. Foco total em respirar.',
      perceivedEffort: '9 a 10 de 10',
      purpose: 'Recruta fibras rápidas, melhora potência neuromuscular e VO2 máximo.',
      colorHex: '#ef4444',
      textColorHex: '#ffffff',
      workoutExamples: [
        {
          level: 'iniciante',
          levelLabel: 'Iniciante',
          workoutTitle: 'Subidas Curtas de Força (Introdução)',
          duration: '25 min',
          instructions: 'Não faça tiros longos ainda! Faça 15 min de trote Z2 + 4 subidas curtas de 15 segundos firmes, descendo caminhando devagar.'
        },
        {
          level: 'intermediario',
          levelLabel: 'Intermediário',
          workoutTitle: 'Tiros Curtos de 200m a 400m',
          duration: '40 min',
          instructions: '12 min aquecimento + 8x [300m em velocidade máxima com 1m30 de descanso caminhando] + 10 min desaquecimento.'
        },
        {
          level: 'avancado',
          levelLabel: 'Avançado',
          workoutTitle: 'Treino de Potência de VO2 Máx',
          duration: '50 min',
          instructions: '15 min aquecimento + 10x [400m em ritmo máximo de prova de 1.500m com 1m15 de pausa ativa] + 10 min trote solto Z1.'
        }
      ]
    }
  });

  getZone(id: ZoneId): TrainingZone {
    return this.zones()[id];
  }

  getAllZones(): TrainingZone[] {
    return Object.values(this.zones());
  }
}