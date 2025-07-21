import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all tarot cards
router.get('/cards', async (_req, res) => {
  const cards = await prisma.tarotCard.findMany({
    orderBy: [
      { arcana: 'asc' },
      { number: 'asc' }
    ]
  });
  res.json(cards);
});

// Get a specific card
router.get('/cards/:id', async (req, res) => {
  const card = await prisma.tarotCard.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  
  return res.json(card);
});

// Get random cards for shuffling
router.get('/shuffle', async (req, res) => {
  const count = parseInt(req.query.count as string) || 78;
  
  // Get all cards and shuffle them
  const cards = await prisma.tarotCard.findMany();
  const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);
  
  res.json(shuffled);
});

export const tarotRouter = router;