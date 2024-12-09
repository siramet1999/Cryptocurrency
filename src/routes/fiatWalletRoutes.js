import express from 'express';
import { 
  getFiatWalletsByUserController, 
  createFiatWalletController, 
  updateFiatWalletController, 
  deleteFiatWalletController 
} from '../controllers/fiatWalletController.js';
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get('/my-wallets',authMiddleware, getFiatWalletsByUserController); // ดูกระเป๋า Fiat ของ User
router.post('/',authMiddleware, createFiatWalletController);           // สร้าง FiatWallet
router.patch('/update-balance',authMiddleware, updateFiatWalletController);   // แก้ไขยอดเงินใน FiatWallet
router.delete('/:walletId',authMiddleware, deleteFiatWalletController); // ลบ FiatWallet

export default router;
