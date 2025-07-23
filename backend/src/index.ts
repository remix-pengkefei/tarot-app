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
    
    // 检查是否有数据
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