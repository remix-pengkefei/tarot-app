"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divinationRouter = void 0;
const express_1 = require("express");
const divination_service_1 = require("../services/divination.service");
const validateRequest_1 = require("../middleware/validateRequest");
const joi_1 = __importDefault(require("joi"));
const router = (0, express_1.Router)();
router.post('/start', (0, validateRequest_1.validateRequest)({
    body: joi_1.default.object({
        question: joi_1.default.string().min(5).max(500).required()
    })
}), async (req, res) => {
    const result = await divination_service_1.divinationService.analyzeQuestionAndRecommendSpread(req.body);
    res.json(result);
});
router.post('/draw-cards', (0, validateRequest_1.validateRequest)({
    body: joi_1.default.object({
        divinationId: joi_1.default.string().uuid().required(),
        drawnCards: joi_1.default.array().items(joi_1.default.object({
            cardId: joi_1.default.number().integer().min(1).required(),
            position: joi_1.default.string().required(),
            isReversed: joi_1.default.boolean().required()
        })).required()
    })
}), async (req, res) => {
    const result = await divination_service_1.divinationService.drawAndInterpretCards(req.body);
    res.json(result);
});
router.get('/:id', async (req, res) => {
    const result = await divination_service_1.divinationService.getDivinationResult(req.params.id);
    res.json(result);
});
exports.divinationRouter = router;
//# sourceMappingURL=divination.routes.js.map