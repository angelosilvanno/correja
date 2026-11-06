import { Injectable, signal } from '@angular/core';
import { TrainingZone, ZoneId } from '../models/training-zone.model';

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
      textColorHex: '#ffffff'
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
      textColorHex: '#ffffff'
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
      textColorHex: '#1f2937'
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
      textColorHex: '#ffffff'
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
      textColorHex: '#ffffff'
    }
  });

  getZone(id: ZoneId): TrainingZone {
    return this.zones()[id];
  }

  getAllZones(): TrainingZone[] {
    return Object.values(this.zones());
  }
}