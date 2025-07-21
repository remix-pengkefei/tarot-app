import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { divinationService } from '../src/services/divination.service';

const prisma = new PrismaClient();

describe('Divination Service', () => {
  beforeAll(async () => {
    // Ensure test data exists
    const spreadsCount = await prisma.spread.count();
    if (spreadsCount === 0) {
      // Create test spreads
      await prisma.spread.createMany({
        data: [
          {
            name: 'Test Single Card',
            description: 'Test spread with one card',
            cardCount: 1,
            positions: JSON.stringify([{ name: 'Guidance', meaning: 'Direct guidance' }])
          },
          {
            name: 'Test Three Cards',
            description: 'Test spread with three cards',
            cardCount: 3,
            positions: JSON.stringify([
              { name: 'Past', meaning: 'Past influences' },
              { name: 'Present', meaning: 'Current situation' },
              { name: 'Future', meaning: 'Future direction' }
            ])
          }
        ]
      });
    }

    const cardsCount = await prisma.tarotCard.count();
    if (cardsCount === 0) {
      // Create test cards
      await prisma.tarotCard.createMany({
        data: [
          {
            name: 'Test Fool',
            arcana: 'Major',
            number: 0,
            uprightMeaning: 'New beginnings',
            reversedMeaning: 'Recklessness',
            keywords: ['beginning', 'innocence', 'spontaneity']
          },
          {
            name: 'Test Magician',
            arcana: 'Major',
            number: 1,
            uprightMeaning: 'Manifestation',
            reversedMeaning: 'Manipulation',
            keywords: ['power', 'skill', 'concentration']
          },
          {
            name: 'Test High Priestess',
            arcana: 'Major',
            number: 2,
            uprightMeaning: 'Intuition',
            reversedMeaning: 'Secrets',
            keywords: ['intuition', 'mystery', 'subconscious']
          }
        ]
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('analyzeQuestionAndRecommendSpread', () => {
    it('should analyze a simple question and recommend single card spread', async () => {
      const result = await divinationService.analyzeQuestionAndRecommendSpread({
        question: 'Should I take this job offer?'
      });

      expect(result).toBeDefined();
      expect(result.question).toBe('Should I take this job offer?');
      expect(result.spreadId).toBeDefined();
      expect(result.questionAnalysis).toBeDefined();
      expect(result.spreadRecommendation).toBeDefined();
      expect(result.spread).toBeDefined();
    });

    it('should analyze a complex question and recommend appropriate spread', async () => {
      const result = await divinationService.analyzeQuestionAndRecommendSpread({
        question: 'What does my romantic future look like and how can I improve my relationships?'
      });

      expect(result).toBeDefined();
      expect(result.spread.cardCount).toBeGreaterThan(1);
    });
  });

  describe('drawAndInterpretCards', () => {
    it('should draw cards and generate interpretations', async () => {
      // First create a divination
      const divination = await divinationService.analyzeQuestionAndRecommendSpread({
        question: 'What should I focus on today?'
      });

      // Get available cards
      const cards = await prisma.tarotCard.findMany({ take: 3 });
      
      // Draw cards
      const drawnCards = cards.slice(0, divination.spread.cardCount).map((card, index) => ({
        cardId: card.id,
        position: JSON.parse(divination.spread.positions as any)[index].name,
        isReversed: false
      }));

      const result = await divinationService.drawAndInterpretCards({
        divinationId: divination.id,
        drawnCards
      });

      expect(result).toBeDefined();
      expect(result.cards).toHaveLength(divination.spread.cardCount);
      expect(result.cards[0].interpretation).toBeDefined();
      expect(result.cards[0].card).toBeDefined();
    });

    it('should reject invalid number of cards', async () => {
      const divination = await divinationService.analyzeQuestionAndRecommendSpread({
        question: 'Test question'
      });

      await expect(
        divinationService.drawAndInterpretCards({
          divinationId: divination.id,
          drawnCards: [] // Wrong number of cards
        })
      ).rejects.toThrow();
    });
  });

  describe('getDivinationResult', () => {
    it('should retrieve complete divination result', async () => {
      // Create and complete a divination
      const divination = await divinationService.analyzeQuestionAndRecommendSpread({
        question: 'What is my path?'
      });

      const cards = await prisma.tarotCard.findMany({ take: 3 });
      const drawnCards = cards.slice(0, divination.spread.cardCount).map((card, index) => ({
        cardId: card.id,
        position: JSON.parse(divination.spread.positions as any)[index].name,
        isReversed: Math.random() > 0.5
      }));

      await divinationService.drawAndInterpretCards({
        divinationId: divination.id,
        drawnCards
      });

      const result = await divinationService.getDivinationResult(divination.id);

      expect(result).toBeDefined();
      expect(result?.question).toBe('What is my path?');
      expect(result?.divinationCards).toHaveLength(divination.spread.cardCount);
      expect(result?.divinationCards?.[0].interpretation).toBeDefined();
    });

    it('should return error for non-existent divination', async () => {
      await expect(
        divinationService.getDivinationResult('non-existent-id')
      ).rejects.toThrow('Divination not found');
    });
  });
});