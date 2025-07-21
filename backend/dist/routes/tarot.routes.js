"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tarotRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/cards', async (_req, res) => {
    const cards = await prisma.tarotCard.findMany({
        orderBy: [
            { arcana: 'asc' },
            { number: 'asc' }
        ]
    });
    res.json(cards);
});
router.get('/cards/:id', async (req, res) => {
    const card = await prisma.tarotCard.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    if (!card) {
        return res.status(404).json({ error: 'Card not found' });
    }
    return res.json(card);
});
router.get('/shuffle', async (req, res) => {
    const count = parseInt(req.query.count) || 78;
    const cards = await prisma.tarotCard.findMany();
    const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);
    res.json(shuffled);
});
exports.tarotRouter = router;
//# sourceMappingURL=tarot.routes.js.map