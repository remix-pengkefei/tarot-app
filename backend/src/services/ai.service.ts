import { claudeService } from './claude.service';
import { openaiService } from './openai.service';
import type { TarotCard, Spread } from '@prisma/client';

interface AnalyzeQuestionResult {
  recommendedSpreadId: number;
  analysis: string;
  recommendation: string;
}

interface InterpretCardParams {
  question: string;
  card: TarotCard;
  position: string;
  isReversed: boolean;
  spreadPositions: Array<{ name: string; meaning: string }>;
}

interface AIService {
  analyzeQuestion(question: string, availableSpreads: Spread[]): Promise<AnalyzeQuestionResult>;
  interpretCard(params: InterpretCardParams): Promise<string>;
}

// 根据环境变量选择 AI 服务
const getAIService = (): AIService => {
  const aiService = process.env.AI_SERVICE || 'openai';
  
  switch (aiService.toLowerCase()) {
    case 'claude':
      console.log('Using Claude AI service');
      return claudeService;
    case 'openai':
    default:
      console.log('Using OpenAI service');
      return openaiService;
  }
};

export const aiService = getAIService();