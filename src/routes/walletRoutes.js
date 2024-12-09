import express from "express";
import {
    createWalletController, 
    getWalletsController, 
    updateWalletBalanceController, 
    transferWalletController,
    deleteWalletController 
} from "../controllers/walletController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// เส้นทางสำหรับการสร้างกระเป๋าสตางค์
router.post('/create',authMiddleware, createWalletController);
router.get('/my-wallets',authMiddleware, getWalletsController);
router.patch('/update-balance',authMiddleware, updateWalletBalanceController);
router.post('/transfer',authMiddleware, transferWalletController);
router.delete('/:wallet_id',authMiddleware, deleteWalletController);

export default router;
