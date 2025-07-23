import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';
import { divinationRouter } from './routes/divination.routes';
import { tarotRouter } from './routes/tarot.routes';
import { spreadRouter } from './routes/spread.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 强制在每个响应中添加CORS头
app.use((req, res, next) => {
  // 在响应发送前添加CORS头
  const originalSend = res.send;
  res.send = function(data) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    return originalSend.call(this, data);
  };
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// Routes - 在每个路由响应前也添加CORS头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api/divination', divinationRouter);
app.use('/api/tarot', tarotRouter);
app.use('/api/spreads', spreadRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS测试端点
app.get('/api/cors-test', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    message: 'CORS test successful',
    headers: req.headers,
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// 根路径
app.get('/', (_req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ message: 'Tarot API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS headers will be added to all responses`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});