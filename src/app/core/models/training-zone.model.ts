export type ZoneId = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export interface TrainingZone {
  id: ZoneId;
  name: string;
  shortName: string;
  tagline: string;
  talkTest: string; // Teste da fala (diferencial acessível)
  perceivedEffort: string; // Escala 1 a 10
  purpose: string;
  colorHex: string;
  textColorHex: string;
}