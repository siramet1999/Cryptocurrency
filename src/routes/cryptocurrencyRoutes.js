import express from 'express';
import * as cryptoController from '../controllers/cryptocurrencyController.js';

const router = express.Router();


router.post('/', cryptoController.createCryptocurrency);
router.get('/', cryptoController.getCryptocurrencies);
router.patch('/:id', cryptoController.updateCryptocurrency);

export default router;
