import axios from 'axios';
import type { Divination, TarotCard, Spread, DrawnCard } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tarotAPI = {
  // Tarot card endpoints
  getAllCards: (): Promise<TarotCard[]> => api.get('/tarot/cards'),
  getCard: (id: number): Promise<TarotCard> => api.get(`/tarot/cards/${id}`),
  shuffleCards: (count?: number): Promise<TarotCard[]> => api.get('/tarot/shuffle', { params: { count } }),

  // Spread endpoints
  getAllSpreads: (): Promise<Spread[]> => api.get('/spreads'),
  getSpread: (id: number): Promise<Spread> => api.get(`/spreads/${id}`),

  // Divination endpoints
  startDivination: (question: string): Promise<Divination> => 
    api.post('/divination/start', { question }),
  
  drawCards: (divinationId: string, drawnCards: DrawnCard[]): Promise<{ divination: Divination; cards: any[] }> =>
    api.post('/divination/draw-cards', {
      divinationId,
      drawnCards,
    }),
  
  getDivination: (id: string): Promise<Divination> => api.get(`/divination/${id}`),
};

// Error interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);