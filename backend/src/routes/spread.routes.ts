import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all spreads
router.get('/', async (_req: Request, res: Response) => {
  const spreads = await prisma.spread.findMany({
    orderBy: { cardCount: 'asc' }
  });
  res.json(spreads);
});

// Get a specific spread
router.get('/:id', async (req: Request, res: Response) => {
  const spread = await prisma.spread.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  
  if (!spread) {
    return res.status(404).json({ error: 'Spread not found' });
  }
  
  return res.json(spread);
});

export const spreadRouter = router;