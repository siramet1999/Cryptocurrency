import express from 'express';
import { handleTransactionController } from '../controllers/transactionController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/transfer', authMiddleware, handleTransactionController);

export default router;