"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divinationService = void 0;
const client_1 = require("@prisma/client");
const ai_service_1 = require("./ai.service");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
exports.divinationService = {
    async analyzeQuestionAndRecommendSpread(dto) {
        const { question } = dto;
        const spreads = await prisma.spread.findMany();
        const analysis = await ai_service_1.aiService.analyzeQuestion(question, spreads);
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
    async drawAndInterpretCards(dto) {
        const { divinationId, drawnCards } = dto;
        const divination = await prisma.divination.findUnique({
            where: { id: divinationId },
            include: { spread: true }
        });
        if (!divination) {
            throw new errorHandler_1.AppError(404, 'Divination not found');
        }
        if (drawnCards.length !== divination.spread.cardCount) {
            throw new errorHandler_1.AppError(400, `This spread requires exactly ${divination.spread.cardCount} cards`);
        }
        const interpretations = await Promise.all(drawnCards.map(async (drawnCard) => {
            const card = await prisma.tarotCard.findUnique({
                where: { id: drawnCard.cardId }
            });
            if (!card) {
                throw new errorHandler_1.AppError(404, `Card with id ${drawnCard.cardId} not found`);
            }
            const interpretation = await ai_service_1.aiService.interpretCard({
                question: divination.question,
                card,
                position: drawnCard.position,
                isReversed: drawnCard.isReversed,
                spreadPositions: divination.spread.positions
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
        }));
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
    async getDivinationResult(divinationId) {
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
            throw new errorHandler_1.AppError(404, 'Divination not found');
        }
        return divination;
    }
};
//# sourceMappingURL=divination.service.js.map