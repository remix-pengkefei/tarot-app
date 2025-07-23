import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';
import { divinationRouter } from './routes/divination.routes';
import { tarotRouter } from './routes/tarot.routes';
import { spreadRouter } from './routes/spread.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CORS_ORIGIN || process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

// 强制在每个响应中添加CORS头
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin as string) ? origin : allowedOrigins[0];
  
  // 在响应发送前添加CORS头
  const originalSend = res.send;
  res.send = function(data: any) {
    res.header('Access-Control-Allow-Origin', allowedOrigin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return originalSend.call(this, data);
  };
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', allowedOrigin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(express.json());

// Middleware to set CORS headers for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const allowedOrigin = allowedOrigins.includes(origin as string) ? origin : allowedOrigins[0];
  res.header('Access-Control-Allow-Origin', allowedOrigin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/divination', divinationRouter);
app.use('/api/tarot', tarotRouter);
app.use('/api/spreads', spreadRouter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS测试端点
app.get('/api/cors-test', (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    message: 'CORS test successful',
    headers: req.headers,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// 根路径
app.get('/', (_req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ message: 'Tarot API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 启动前初始化数据库
async function initializeDatabase() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 检查牌阵
    const spreadCount = await prisma.spread.count();
    if (spreadCount === 0) {
      console.log('No spreads found, creating default spreads...');
      // 创建基本的牌阵
      await prisma.spread.createMany({
        data: [
          {
            name: '单牌阵',
            description: '快速获得对问题的洞察',
            cardCount: 1,
            positions: JSON.stringify([
              { name: '答案', meaning: '对您问题的直接回应' }
            ])
          },
          {
            name: '三牌阵',
            description: '过去、现在、未来的经典牌阵',
            cardCount: 3,
            positions: JSON.stringify([
              { name: '过去', meaning: '影响当前状况的过去因素' },
              { name: '现在', meaning: '当前的状况和挑战' },
              { name: '未来', meaning: '可能的发展方向' }
            ])
          },
          {
            name: '五牌十字阵',
            description: '深入了解问题的各个方面',
            cardCount: 5,
            positions: JSON.stringify([
              { name: '现状', meaning: '当前的情况' },
              { name: '挑战', meaning: '面临的困难或阻碍' },
              { name: '过去', meaning: '导致现状的原因' },
              { name: '未来', meaning: '可能的结果' },
              { name: '建议', meaning: '行动指南' }
            ])
          }
        ]
      });
      console.log('Default spreads created successfully!');
    }
    
    // 检查塔罗牌
    const cardCount = await prisma.tarotCard.count();
    if (cardCount === 0) {
      console.log('No tarot cards found, creating Major Arcana...');
      
      // 创建大阿卡纳
      const majorArcana = [
        { number: 0, name: '愚者', keywords: ['新开始', '冒险', '天真', '自由'] },
        { number: 1, name: '魔术师', keywords: ['创造力', '技能', '意志力', '行动'] },
        { number: 2, name: '女祭司', keywords: ['直觉', '潜意识', '神秘', '智慧'] },
        { number: 3, name: '女皇', keywords: ['丰饶', '母性', '创造', '自然'] },
        { number: 4, name: '皇帝', keywords: ['权威', '结构', '控制', '父性'] },
        { number: 5, name: '教皇', keywords: ['传统', '信仰', '教育', '精神指引'] },
        { number: 6, name: '恋人', keywords: ['爱情', '选择', '结合', '价值观'] },
        { number: 7, name: '战车', keywords: ['胜利', '意志', '控制', '决心'] },
        { number: 8, name: '力量', keywords: ['勇气', '耐心', '内在力量', '温柔'] },
        { number: 9, name: '隐士', keywords: ['内省', '寻求', '智慧', '孤独'] },
        { number: 10, name: '命运之轮', keywords: ['周期', '命运', '转折', '机遇'] },
        { number: 11, name: '正义', keywords: ['公正', '平衡', '真相', '因果'] },
        { number: 12, name: '倒吊人', keywords: ['牺牲', '等待', '新视角', '放手'] },
        { number: 13, name: '死神', keywords: ['结束', '转变', '重生', '放下'] },
        { number: 14, name: '节制', keywords: ['平衡', '耐心', '调和', '适度'] },
        { number: 15, name: '恶魔', keywords: ['束缚', '物质', '诱惑', '执着'] },
        { number: 16, name: '塔', keywords: ['突变', '破坏', '觉醒', '解放'] },
        { number: 17, name: '星星', keywords: ['希望', '灵感', '宁静', '信念'] },
        { number: 18, name: '月亮', keywords: ['幻觉', '恐惧', '潜意识', '直觉'] },
        { number: 19, name: '太阳', keywords: ['成功', '活力', '喜悦', '积极'] },
        { number: 20, name: '审判', keywords: ['复活', '评估', '觉醒', '召唤'] },
        { number: 21, name: '世界', keywords: ['完成', '成就', '圆满', '整合'] }
      ];

      await prisma.tarotCard.createMany({
        data: majorArcana.map(card => ({
          name: card.name,
          arcana: 'Major',
          number: card.number,
          keywords: card.keywords.join(','),
          uprightMeaning: `${card.name}正位代表${card.keywords.slice(0, 2).join('、')}的能量。这是关于${card.keywords[0]}的时刻。`,
          reversedMeaning: `${card.name}逆位可能暗示${card.keywords[0]}的缺失或过度，需要重新审视${card.keywords[1]}。`
        }))
      });
      
      console.log('Tarot cards created successfully!');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 先初始化数据库，再启动服务器
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS headers will be added to all responses`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});