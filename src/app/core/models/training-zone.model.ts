export type ZoneId = 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export interface ZoneWorkoutExample {
  level: 'iniciante' | 'intermediario' | 'avancado';
  levelLabel: string;
  workoutTitle: string;
  duration: string;
  instructions: string;
}

export interface TrainingZone {
  id: ZoneId;
  name: string;
  shortName: string;
  tagline: string;
  talkTest: string;
  perceivedEffort: string;
  purpose: string;
  colorHex: string;
  textColorHex: string;
  workoutExamples: ZoneWorkoutExample[];
}