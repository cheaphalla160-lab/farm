export interface VocabularyWord {
  id: string;
  word: string;
  ipa: string;
  syllables: string[];
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  teacherNote: string;
  funFact: string;
  color: string;
  iconName: string;
  category: 'core' | 'bonus';
}

export type GameDifficulty = 'easy' | 'medium' | 'master';

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  applesCollected: number;
  readAloudStars: number;
  accuracy: number;
  date: string;
  badge: string;
}

export interface ReadAloudEvaluation {
  spokenText: string;
  accuracyScore: number; // 0 to 100
  stars: 1 | 2 | 3;
  feedbackText: string;
  isCorrect: boolean;
}

export type ActiveTab = 'explorer' | 'apple-picking' | 'learn' | 'leaderboard' | 'teacher-prep';
