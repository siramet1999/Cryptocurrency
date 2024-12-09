import {
  createWallet, 
  getWalletsByUserId, 
  updateWalletBalanceService, 
  transferWalletService,
  deleteWalletService 
} from "../services/walletService.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// สร้างกระเป๋าสตางค์


export const createWalletController = async (req, res) => {
  const { walletuser_id, crypto_id } = req.body;

  try {
    const wallet = await createWallet(walletuser_id, crypto_id);
    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create wallet',
      error: error.message,
    });
  }
};

// 2. Get Wallets for a User
export const getWalletsController = async (req, res) => {
  const {walletuser_id}= req.user;
  try {
    const wallets = await getWalletsByUserId(walletuser_id);
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch wallets',
      error: error.message,
    });
  }
};

// 3. Update Wallet Balance
export const updateWalletBalanceController = async (req, res) => {
  const { wallet_id, amount } = req.body; // ดึง `wallet_id` และ `amount` จาก body request

  try {
    const updatedWallet = await prisma.wallet.update({
      where: {
        wallet_id: Number(wallet_id), // แปลง wallet_id เป็น Number
      },
      data: {
        balance: Number(amount), // แปลง amount เป็น Number เพื่อให้ Prisma สามารถประมวลผลได้
      },
    });

    res.status(200).json(updatedWallet);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update wallet balance",
      error: error.message,
    });
  }
};

// 4. Transfer between Wallets
export const transferWalletController = async (req, res) => {
  const { receiver_walletuser_id, quantity } = req.body; // ดึงข้อมูลจาก body
  const senderWalletUserId = req.user.walletuser_id; // ดึง walletuser_id จาก token หรือ middleware

  try {
    const transactionResult = await transferWalletService(
      senderWalletUserId,
      receiver_walletuser_id,
      quantity
    );

    if (!transactionResult.success) {
      return res.status(400).json({ message: transactionResult.message });
    }

    res.status(200).json({
      message: 'Transaction successful',
      transaction: transactionResult.transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Transaction failed',
      error: error.message,
    });
  }
};

// 5. Delete Wallet
export const deleteWalletController = async (req, res) => {
  const { wallet_id } = req.params;

  try {
    const result = await deleteWalletService(wallet_id);
    res.status(200).json({
      message: 'Wallet deleted successfully',
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete wallet',
      error: error.message,
    });
  }
};