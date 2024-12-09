import express from 'express';
import {
  getFiatCurrenciesController,
  createFiatCurrencyController,
  updateFiatCurrencyController,
  deleteFiatCurrencyController,
} from '../controllers/fiatController.js';

const router = express.Router();

router.get('/', getFiatCurrenciesController);
router.post('/', createFiatCurrencyController);
router.patch('/:fiatId', updateFiatCurrencyController);
router.delete('/:fiatId', deleteFiatCurrencyController);

export default router;
