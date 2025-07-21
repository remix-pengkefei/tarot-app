import { PrismaClient } from '@prisma/client';
import { aiService } from './ai.service';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export interface CreateDivinationDto {
  question: string;
}

export interface DrawCardsDto {
  divinationId: string;
  drawnCards: Array<{
    cardId: number;
    position: string;
    isReversed: boolean;
  }>;
}

export const divinationService = {
  async analyzeQuestionAndRecommendSpread(dto: CreateDivinationDto) {
    const { question } = dto;

    // Get available spreads
    const spreads = await prisma.spread.findMany();
    
    // Use AI to analyze the question and recommend a spread
    const analysis = await aiService.analyzeQuestion(question, spreads);
    
    // Create divination record
    const divination = await prisma.divination.create({
      data: {
        question,
        spreadId: analysis.recommendedSpreadId,
        questionAnalysis: analysis.analysis,
        spreadRecommendation: analysis.recommendation
      },
      include: {
        spread: true
      }
    });

    return divination;
  },

  async drawAndInterpretCards(dto: DrawCardsDto) {
    const { divinationId, drawnCards } = dto;

    // Verify divination exists
    const divination = await prisma.divination.findUnique({
      where: { id: divinationId },
      include: { spread: true }
    });

    if (!divination) {
      throw new AppError(404, 'Divination not found');
    }

    // Validate number of cards matches spread
    if (drawnCards.length !== divination.spread.cardCount) {
      throw new AppError(400, `This spread requires exactly ${divination.spread.cardCount} cards`);
    }

    // Create divination cards with interpretations
    const interpretations = await Promise.all(
      drawnCards.map(async (drawnCard) => {
        const card = await prisma.tarotCard.findUnique({
          where: { id: drawnCard.cardId }
        });

        if (!card) {
          throw new AppError(404, `Card with id ${drawnCard.cardId} not found`);
        }

        // Get AI interpretation for this card in context
        const interpretation = await aiService.interpretCard({
          question: divination.question,
          card,
          position: drawnCard.position,
          isReversed: drawnCard.isReversed,
          spreadPositions: divination.spread.positions as any
        });

        return prisma.divinationCard.create({
          data: {
            divinationId,
            cardId: drawnCard.cardId,
            position: drawnCard.position,
            isReversed: drawnCard.isReversed,
            interpretation
          },
          include: {
            card: true
          }
        });
      })
    );

    // 生成总结（仅适用于多张牌）
    let summary = '';
    if (interpretations.length > 1) {
      const cardsForSummary = interpretations.map(interp => ({
        card: interp.card,
        position: interp.position,
        isReversed: interp.isReversed,
        interpretation: interp.interpretation
      }));
      
      summary = await aiService.generateSummary(divination.question, cardsForSummary);
      
      // 更新占卜记录，添加总结
      if (summary) {
        await prisma.divination.update({
          where: { id: divinationId },
          data: { summary }
        });
      }
    }

    // 获取更新后的完整占卜数据
    const updatedDivination = await prisma.divination.findUnique({
      where: { id: divinationId },
      include: {
        spread: true,
        divinationCards: {
          include: {
            card: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    return {
      divination: updatedDivination,
      cards: interpretations
    };
  },

  async getDivinationResult(divinationId: string) {
    const divination = await prisma.divination.findUnique({
      where: { id: divinationId },
      include: {
        spread: true,
        divinationCards: {
          include: {
            card: true
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    if (!divination) {
      throw new AppError(404, 'Divination not found');
    }

    return divination;
  }
};