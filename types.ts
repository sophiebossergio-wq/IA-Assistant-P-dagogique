export enum LearnerLevel {
  Beginner = 'débutant',
  Intermediate = 'intermédiaire',
  Advanced = 'avancé',
}

export enum FeedbackTone {
  Neutral = '1',
  Benevolent = '2',
  Encouraging = '3',
}

export interface FeedbackParams {
  level: LearnerLevel;
  tone: FeedbackTone;
  text: string;
}

export interface Feedback {
  strengths: string[];
  areasForImprovement: string[];
  suggestions: string[];
  finalMessage: string;
}
