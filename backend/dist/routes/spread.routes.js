"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spreadRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', async (_req, res) => {
    const spreads = await prisma.spread.findMany({
        orderBy: { cardCount: 'asc' }
    });
    res.json(spreads);
});
router.get('/:id', async (req, res) => {
    const spread = await prisma.spread.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    if (!spread) {
        return res.status(404).json({ error: 'Spread not found' });
    }
    return res.json(spread);
});
exports.spreadRouter = router;
//# sourceMappingURL=spread.routes.js.map