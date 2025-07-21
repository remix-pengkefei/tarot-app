import { renderHook, act } from '@testing-library/react';
import { useDivinationStore } from '../store';
import { tarotAPI } from '../api';

// Mock the API module
jest.mock('../api');

describe('Divination Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useDivinationStore());
    act(() => {
      result.current.reset();
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useDivinationStore());
      
      expect(result.current.currentDivination).toBeNull();
      expect(result.current.currentQuestion).toBe('');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.allCards).toEqual([]);
      expect(result.current.shuffledCards).toEqual([]);
      expect(result.current.drawnCards).toEqual([]);
      expect(result.current.spreads).toEqual([]);
    });
  });

  describe('Actions', () => {
    it('should set question', () => {
      const { result } = renderHook(() => useDivinationStore());
      
      act(() => {
        result.current.setQuestion('What is my future?');
      });
      
      expect(result.current.currentQuestion).toBe('What is my future?');
    });

    it('should start divination successfully', async () => {
      const mockDivination = {
        id: 'test-id',
        question: 'Test question',
        spreadId: 1,
        questionAnalysis: 'Test analysis',
        spreadRecommendation: 'Test recommendation',
        spread: {
          id: 1,
          name: 'Test Spread',
          description: 'Test description',
          positions: [],
          cardCount: 1
        }
      };
      
      (tarotAPI.startDivination as jest.Mock).mockResolvedValue(mockDivination);
      
      const { result } = renderHook(() => useDivinationStore());
      
      await act(async () => {
        await result.current.startDivination('Test question');
      });
      
      expect(result.current.currentDivination).toEqual(mockDivination);
      expect(result.current.currentQuestion).toBe('Test question');
      expect(result.current.error).toBeNull();
    });

    it('should handle divination error', async () => {
      const errorMessage = 'Failed to start divination';
      (tarotAPI.startDivination as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useDivinationStore());
      
      await act(async () => {
        await result.current.startDivination('Test question');
      });
      
      expect(result.current.currentDivination).toBeNull();
      expect(result.current.error).toBe(errorMessage);
    });

    it('should reset state', () => {
      const { result } = renderHook(() => useDivinationStore());
      
      // Set some state
      act(() => {
        result.current.setQuestion('Test question');
        result.current.error = 'Test error';
      });
      
      // Reset
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.currentQuestion).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.currentDivination).toBeNull();
    });

    it('should load initial data', async () => {
      const mockCards = [
        { id: 1, name: 'The Fool', arcana: 'Major' },
        { id: 2, name: 'The Magician', arcana: 'Major' }
      ];
      const mockSpreads = [
        { id: 1, name: 'Single Card', cardCount: 1 }
      ];
      
      (tarotAPI.getAllCards as jest.Mock).mockResolvedValue(mockCards);
      (tarotAPI.getAllSpreads as jest.Mock).mockResolvedValue(mockSpreads);
      
      const { result } = renderHook(() => useDivinationStore());
      
      await act(async () => {
        await result.current.loadInitialData();
      });
      
      expect(result.current.allCards).toEqual(mockCards);
      expect(result.current.spreads).toEqual(mockSpreads);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should set loading state during async operations', async () => {
      let resolvePromise: any;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      (tarotAPI.startDivination as jest.Mock).mockReturnValue(promise);
      
      const { result } = renderHook(() => useDivinationStore());
      
      // Start async operation
      const divinationPromise = act(async () => {
        return result.current.startDivination('Test question');
      });
      
      // Check loading state is true
      expect(result.current.isLoading).toBe(true);
      
      // Resolve the promise
      await act(async () => {
        resolvePromise({ id: 'test', question: 'Test question' });
        await divinationPromise;
      });
      
      // Check loading state is false
      expect(result.current.isLoading).toBe(false);
    });
  });
});