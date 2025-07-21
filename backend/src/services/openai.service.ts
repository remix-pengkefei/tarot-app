import OpenAI from 'openai';
import { TarotCard, Spread } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

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

export const openaiService = {
  async analyzeQuestion(question: string, availableSpreads: Spread[]): Promise<AnalyzeQuestionResult> {
    try {
      const prompt = `你是一位经验丰富的塔罗占卜师。用户想要通过塔罗牌占卜解决以下问题：

"${question}"

请分析这个问题，并从以下牌阵中推荐最合适的一个：

${availableSpreads.map(spread => `
- ${spread.name}（${spread.cardCount}张牌）：${spread.description}
  适用场景：${JSON.parse(spread.positions as string).map((p: any) => p.meaning).join('、')}
`).join('\n')}

请返回以下格式的JSON响应：
{
  "recommendedSpreadId": <推荐牌阵的ID>,
  "analysis": "<对问题的简要分析>",
  "recommendation": "<为什么推荐这个牌阵的原因>"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: '你是一位专业的塔罗占卜师，请用温柔、富有洞察力的语言回答问题。'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError(500, 'Empty response from OpenAI');
      }

      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to simple logic
      const simpleRecommendation = this.getSimpleSpreadRecommendation(question, availableSpreads);
      return simpleRecommendation;
    }
  },

  async interpretCard(params: InterpretCardParams): Promise<string> {
    const { question, card, position, isReversed } = params;
    
    try {
      const prompt = `你是一位温柔且富有洞察力的塔罗占卜师。请为以下占卜提供解读：

用户的问题："${question}"
当前牌位："${position}"
抽到的牌："${card.name}"（${card.arcana}${card.suit ? ' - ' + card.suit : ''}）
牌的方向：${isReversed ? '逆位' : '正位'}

牌的含义：
- 正位：${card.uprightMeaning}
- 逆位：${card.reversedMeaning}
- 关键词：${card.keywords}

请结合：
1. 用户的具体问题
2. 这张牌在"${position}"位置的特殊含义
3. 牌本身的象征意义
4. ${isReversed ? '逆位' : '正位'}的特殊含义

给出一段温柔、有洞察力的解读（150-200字）。不要直接给出结论，而是帮助用户思考和理解。语言要通俗易懂，富有启发性。`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: '你是一位专业的塔罗占卜师，请用温柔、富有洞察力的语言提供解读。避免使用过于神秘或晦涩的表达。'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError(500, 'Empty response from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback interpretation
      return this.getSimpleInterpretation(params);
    }
  },

  async generateSummary(question: string, cards: Array<{
    card: TarotCard;
    position: string;
    isReversed: boolean;
    interpretation: string;
  }>): Promise<string> {
    try {
      // 只为多张牌生成总结
      if (cards.length <= 1) {
        return '';
      }

      const cardsDescription = cards.map(c => 
        `- ${c.card.name}（${c.isReversed ? '逆位' : '正位'}）在"${c.position}"位置`
      ).join('\n');

      const prompt = `你是一位温柔且富有洞察力的塔罗占卜师。请基于以下占卜结果，为用户提供一个整体性的总结解读。

用户的问题："${question}"

抽到的塔罗牌：
${cardsDescription}

请综合所有抽到的牌，围绕用户的问题写一段总结性的解读（200-300字）。

这段总结应包括：
1. 所有牌之间的联系与互动（例如：象征层面、倾向、张力）
2. 回应用户的问题本质，提炼核心洞察
3. 提供温柔、有智慧、具有方向性的建议，鼓励用户内在觉察

语气柔和有同理心，避免直接给出"好/坏"的结论，而是引导用户理解潜藏的含义与可能性。`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: '你是一位专业的塔罗占卜师，请用温柔、富有洞察力的语言提供整体性解读。重点关注牌与牌之间的联系，以及它们共同传达的信息。'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 600
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError(500, 'Empty response from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('OpenAI API error (generateSummary):', error);
      // Fallback summary
      return this.getSimpleSummary(question, cards);
    }
  },

  // Enhanced fallback methods with rich mock data (复制自 claude.service.ts)
  getSimpleSpreadRecommendation(question: string, spreads: Spread[]): AnalyzeQuestionResult {
    const questionLower = question.toLowerCase();
    let recommendedSpread: Spread;
    let analysis: string;
    let recommendation: string;

    // 分析问题类型
    if (questionLower.includes('爱情') || questionLower.includes('感情') || questionLower.includes('恋爱') || questionLower.includes('喜欢')) {
      recommendedSpread = spreads.find(s => s.cardCount === 3) || spreads[1];
      analysis = '您的问题涉及到感情和人际关系。爱情是生命中最神秘的力量之一，它需要我们用心去感受和理解。通过塔罗牌，我们可以探索内心深处的情感需求和关系模式。';
      recommendation = '三张牌阵特别适合探索感情的发展脉络，它能帮您看清过去的影响、现在的状态，以及可能的未来走向。';
    } else if (questionLower.includes('工作') || questionLower.includes('事业') || questionLower.includes('职业') || questionLower.includes('工作')) {
      recommendedSpread = spreads.find(s => s.cardCount === 3) || spreads[1];
      analysis = '您关心的是事业发展和职业道路。工作不仅是谋生的手段，更是实现自我价值的重要途径。让我们通过塔罗牌来探索您的职业潜能和机遇。';
      recommendation = '三张牌阵可以清晰地展现您事业的过去基础、当前挑战和未来机会，帮助您做出明智的职业决策。';
    } else if (questionLower.includes('选择') || questionLower.includes('决定') || questionLower.includes('应该') || questionLower.includes('还是')) {
      recommendedSpread = spreads.find(s => s.cardCount === 1) || spreads[0];
      analysis = '您面临着一个需要做出选择的时刻。人生就是由无数个选择组成的，每一个决定都可能影响我们的未来。让塔罗牌为您提供内心的指引。';
      recommendation = '单张牌阵能够给您一个明确的方向指引，帮助您聆听内心真实的声音。';
    } else if (questionLower.includes('为什么') || questionLower.includes('原因') || questionLower.includes('怎么回事')) {
      recommendedSpread = spreads.find(s => s.cardCount === 10) || spreads[2];
      analysis = '您想要深入了解某个情况背后的原因和真相。生活中的很多事情都有其深层的因果关系，通过塔罗牌我们可以揭示那些隐藏的联系。';
      recommendation = '凯尔特十字牌阵是最全面的牌阵之一，它能从多个角度深入剖析问题，帮您看清事情的全貌。';
    } else {
      // 默认推荐
      recommendedSpread = spreads.find(s => s.cardCount === 3) || spreads[1];
      analysis = '您的问题触及了生活中的重要主题。每个问题都是成长的契机，让我们通过塔罗牌的智慧来探索答案。';
      recommendation = `${recommendedSpread.name}能够为您提供全面而深入的洞察，帮助您理解当前的处境。`;
    }

    return {
      recommendedSpreadId: recommendedSpread.id,
      analysis,
      recommendation
    };
  },

  getSimpleInterpretation(params: InterpretCardParams): string {
    const { question, card, position, isReversed } = params;
    const questionLower = question.toLowerCase();
    
    // 根据不同的牌和位置生成个性化解读
    const interpretations: { [key: string]: { [key: string]: string } } = {
      '愚者': {
        '过去': isReversed 
          ? '过去的某个冲动决定可能给您带来了一些困扰。逆位的愚者提醒您，那些看似鲁莽的选择其实也是成长的一部分。'
          : '您的过去充满了冒险精神和新的开始。愚者代表着您曾经拥有的纯真和勇气，这些品质塑造了今天的您。',
        '现在': isReversed
          ? '当前您可能感到有些迷茫或缺乏方向。逆位的愚者建议您暂时停下脚步，重新审视自己的目标。'
          : '现在是开启新旅程的绝佳时机。愚者鼓励您保持开放的心态，相信直觉，勇敢地迈出第一步。',
        '未来': isReversed
          ? '未来可能会遇到一些需要谨慎对待的情况。逆位的愚者提醒您在冒险之前做好充分的准备。'
          : '未来充满了无限的可能性。愚者预示着新的机遇即将到来，保持您的好奇心和冒险精神。',
        '指引': isReversed
          ? '此刻需要您更加务实和谨慎。逆位的愚者提醒您在做决定时要考虑现实因素。'
          : '愚者邀请您释放内心的恐惧，以全新的视角看待您的处境。相信自己，相信生命的引导。'
      },
      '魔术师': {
        '过去': isReversed
          ? '过去可能有些才能没有得到充分发挥。逆位的魔术师暗示您曾经低估了自己的能力。'
          : '您过去展现出了强大的创造力和执行力。魔术师代表着您将想法转化为现实的能力。',
        '现在': isReversed
          ? '当前可能感到能量分散或缺乏专注。逆位的魔术师建议您重新整合自己的资源。'
          : '现在您拥有实现目标所需的一切工具和能力。魔术师鼓励您充分运用自己的才能。',
        '未来': isReversed
          ? '未来需要警惕不要过度自信或操之过急。逆位的魔术师提醒您保持谦逊。'
          : '未来您将能够更好地掌控自己的命运。魔术师预示着成功的机会即将到来。',
        '指引': isReversed
          ? '现在需要诚实面对自己的局限性。逆位的魔术师提醒您寻求他人的帮助。'
          : '魔术师告诉您：您已经拥有成功所需的一切。现在要做的就是相信自己，付诸行动。'
      }
    };

    // 生成解读
    let interpretation = '';
    const cardName = card.name.replace('Test ', '');
    
    if (interpretations[cardName] && interpretations[cardName][position]) {
      interpretation = interpretations[cardName][position];
    } else {
      // 通用解读模板
      const positionMeanings: { [key: string]: string } = {
        '过去': '回顾过去的经历',
        '现在': '审视当前的状况',
        '未来': '展望可能的发展',
        '指引': '获得内心的指引',
        '现状': '理解目前的处境',
        '挑战/交叉': '认识面临的挑战',
        '远因': '探索深层的原因',
        '近因': '发现近期的影响',
        '可能结果': '预见可能的结果',
        '近未来': '洞察即将到来的变化',
        '内在态度': '觉察内心的想法',
        '外在影响': '了解外部的因素',
        '希望与恐惧': '面对内心的期待',
        '最终结果': '接受最终的启示'
      };

      const action = positionMeanings[position] || '获得洞察';
      const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
      const keywordsArray = typeof card.keywords === 'string' 
        ? card.keywords.split(',') 
        : card.keywords;
      const keywords = keywordsArray.slice(0, 2).join('和');
      
      interpretation = `在${position}的位置上，${card.name}${isReversed ? '逆位' : '正位'}帮助您${action}。这张牌的核心信息是关于${keywords}。${meaning} `;
      
      // 根据问题类型添加个性化建议
      if (questionLower.includes('爱情') || questionLower.includes('感情')) {
        interpretation += '在感情方面，这提醒您要用心感受对方的需求，同时也要忠于自己的内心。';
      } else if (questionLower.includes('工作') || questionLower.includes('事业')) {
        interpretation += '在事业上，这意味着您需要找到个人价值与外在成就之间的平衡。';
      } else if (questionLower.includes('选择') || questionLower.includes('决定')) {
        interpretation += '面对选择时，请相信您的直觉，它会指引您走向正确的方向。';
      } else {
        interpretation += '请细细品味这个信息，让它在您的内心深处产生共鸣。';
      }
    }

    return interpretation;
  },

  getSimpleSummary(question: string, cards: Array<{
    card: TarotCard;
    position: string;
    isReversed: boolean;
    interpretation: string;
  }>): string {
    if (cards.length <= 1) return '';

    const cardNames = cards.map(c => c.card.name).join('、');
    const hasConflict = cards.some(c => c.isReversed);
    
    let summary = `在这次占卜中，${cardNames}共同为您的问题提供了多层次的洞察。`;
    
    if (hasConflict) {
      summary += '牌面中既有顺位也有逆位，这暗示着您正处在一个转变的过程中，内在可能存在一些需要平衡的张力。';
    } else {
      summary += '所有牌面呈现出和谐的能量流动，指向一个相对清晰的方向。';
    }
    
    summary += '\n\n这些牌共同提醒您，';
    
    const questionLower = question.toLowerCase();
    if (questionLower.includes('爱情') || questionLower.includes('感情')) {
      summary += '在感情的道路上，真诚与耐心是最重要的品质。聆听内心的声音，同时也要给予关系成长的空间。';
    } else if (questionLower.includes('工作') || questionLower.includes('事业')) {
      summary += '职业发展需要结合内在的热情与外在的机遇。保持开放的心态，同时也要相信自己的能力和判断。';
    } else {
      summary += '生活的答案往往不是非黑即白的。保持觉察，在变化中寻找属于您的平衡点。';
    }
    
    summary += '请记住，塔罗牌反映的是当下的能量状态，而您始终拥有改变未来的力量。';
    
    return summary;
  }
};