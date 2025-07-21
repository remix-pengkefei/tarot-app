export interface TarotCard {
  id: number;
  name: string;
  arcana: string;
  suit?: string;
  number?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  imageUrl?: string;
}

export interface Spread {
  id: number;
  name: string;
  description: string;
  positions: SpreadPosition[];
  cardCount: number;
}

export interface SpreadPosition {
  name: string;
  meaning: string;
}

export interface Divination {
  id: string;
  question: string;
  spreadId: number;
  questionAnalysis: string;
  spreadRecommendation: string;
  summary?: string;
  spread: Spread;
  divinationCards?: DivinationCard[];
  createdAt: string;
  updatedAt: string;
}

export interface DivinationCard {
  id: string;
  divinationId: string;
  cardId: number;
  position: string;
  isReversed: boolean;
  interpretation: string;
  card: TarotCard;
  createdAt: string;
}

export interface DrawnCard {
  cardId: number;
  position: string;
  isReversed: boolean;
}