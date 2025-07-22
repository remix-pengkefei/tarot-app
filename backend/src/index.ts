import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';
import { divinationRouter } from './routes/divination.routes';
import { tarotRouter } from './routes/tarot.routes';
import { spreadRouter } from './routes/spread.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 手动设置CORS头 - 最彻底的解决方案
app.use((req, res, next) => {
  // 允许所有来源
  res.header('Access-Control-Allow-Origin', '*');
  
  // 允许的请求头
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // 允许的方法
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // 允许credentials
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 备用CORS中间件
app.use(cors({
  origin: true, // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

console.log('CORS configured with manual headers');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);

app.use(express.json());

// Routes
app.use('/api/divination', divinationRouter);
app.use('/api/tarot', tarotRouter);
app.use('/api/spreads', spreadRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS测试端点
app.get('/api/cors-test', (req, res) => {
  res.json({ 
    message: 'CORS test successful',
    headers: req.headers,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// 根路径
app.get('/', (_req, res) => {
  res.json({ message: 'Tarot API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS is enabled for all origins`);
});