import { Router } from 'express';
import { divinationService } from '../services/divination.service';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';

const router = Router();

// Start a new divination
router.post('/start', 
  validateRequest({
    body: Joi.object({
      question: Joi.string().min(5).max(500).required()
    })
  }),
  async (req, res) => {
    const result = await divinationService.analyzeQuestionAndRecommendSpread(req.body);
    res.json(result);
  }
);

// Draw cards and get interpretations
router.post('/draw-cards',
  validateRequest({
    body: Joi.object({
      divinationId: Joi.string().uuid().required(),
      drawnCards: Joi.array().items(
        Joi.object({
          cardId: Joi.number().integer().min(1).required(),
          position: Joi.string().required(),
          isReversed: Joi.boolean().required()
        })
      ).required()
    })
  }),
  async (req, res) => {
    const result = await divinationService.drawAndInterpretCards(req.body);
    res.json(result);
  }
);

// Get divination result
router.get('/:id', async (req, res) => {
  const result = await divinationService.getDivinationResult(req.params.id);
  res.json(result);
});

export const divinationRouter = router;