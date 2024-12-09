import express from 'express';
import { buyCryptoWithFiat,sellCryptoWithFiat,cancelOrder } from '../controllers/tradeController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/buy', authMiddleware, buyCryptoWithFiat);
router.post('/sell', authMiddleware, sellCryptoWithFiat);
router.post('/cancel', authMiddleware,cancelOrder);

export default router;