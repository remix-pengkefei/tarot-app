import { create } from 'zustand';
import type { Divination, TarotCard, Spread, DrawnCard } from '../types';
import { tarotAPI } from './api';

interface DivinationState {
  // Current divination session
  currentDivination: Divination | null;
  currentQuestion: string;
  isLoading: boolean;
  error: string | null;
  
  // Cards and spreads
  allCards: TarotCard[];
  shuffledCards: TarotCard[];
  drawnCards: DrawnCard[];
  spreads: Spread[];
  
  // Actions
  setQuestion: (question: string) => void;
  startDivination: (question: string) => Promise<void>;
  drawCards: (cards: DrawnCard[]) => Promise<void>;
  shuffleCards: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  reset: () => void;
}

export const useDivinationStore = create<DivinationState>((set, get) => ({
  // Initial state
  currentDivination: null,
  currentQuestion: '',
  isLoading: false,
  error: null,
  allCards: [],
  shuffledCards: [],
  drawnCards: [],
  spreads: [],
  
  // Actions
  setQuestion: (question) => set({ currentQuestion: question }),
  
  startDivination: async (question) => {
    set({ isLoading: true, error: null });
    try {
      const divination = await tarotAPI.startDivination(question);
      set({ 
        currentDivination: divination,
        currentQuestion: question,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start divination',
        isLoading: false 
      });
    }
  },
  
  drawCards: async (cards) => {
    const { currentDivination } = get();
    if (!currentDivination) {
      set({ error: 'No active divination session' });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      console.log('Drawing cards:', cards);
      const result = await tarotAPI.drawCards(currentDivination.id, cards);
      console.log('Draw cards result:', result);
      
      // 确保数据结构正确
      if (result && result.divination) {
        set({ 
          currentDivination: result.divination,
          drawnCards: cards,
          isLoading: false 
        });
        console.log('State updated with divination:', result.divination);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error drawing cards:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to draw cards',
        isLoading: false 
      });
    }
  },
  
  shuffleCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const cards = await tarotAPI.shuffleCards();
      set({ shuffledCards: cards, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to shuffle cards',
        isLoading: false 
      });
    }
  },
  
  loadInitialData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [cards, spreads] = await Promise.all([
        tarotAPI.getAllCards(),
        tarotAPI.getAllSpreads()
      ]);
      set({ 
        allCards: cards,
        spreads: spreads,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load initial data',
        isLoading: false 
      });
    }
  },
  
  reset: () => set({
    currentDivination: null,
    currentQuestion: '',
    drawnCards: [],
    shuffledCards: [],
    error: null
  })
}));