import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createWallet = async (walletuser_id, crypto_id) => {
  const walletExists = await prisma.wallet.findFirst({
    where: {
      walletuser_id,
      crypto_id,
    },
  });

  if (walletExists) {
    return walletExists;
  }

  const newWallet = await prisma.wallet.create({
    data: {
      walletuser_id,
      crypto_id,
      balance: 0,
    },
  });

  return newWallet;
};

// Service 2: Get Wallets for user
export const getWalletsByUserId = async (userId) => {

  
  return prisma.wallet.findMany({
    where: { walletuser_id: userId },
  });
};

// Service 3: Update Wallet Balance
export const updateWalletBalanceService = async (wallet_id, amount) => {
  return prisma.wallet.update({
    where: { wallet_id },
    data: { balance: { increment: amount } },
  });
};


// Service 4: Transfer Wallet
export const transferWalletService = async (
  senderWalletUserId,
  receiverWalletUserId,
  quantity
) => {
  try {
    // ตรวจสอบ Wallet ของ Sender
    const senderWallet = await prisma.wallet.findFirst({
      where: { walletuser_id: Number(senderWalletUserId) },
    });

    if (!senderWallet) {
      return { success: false, message: 'Sender wallet not found' };
    }

    // ตรวจสอบ Wallet ของ Receiver
    const receiverWallet = await prisma.wallet.findFirst({
      where: { walletuser_id: Number(receiverWalletUserId) },
    });

    if (!receiverWallet) {
      return { success: false, message: 'Receiver wallet not found' };
    }

    // ตรวจสอบยอดเงินใน Wallet ผู้ส่ง
    if (senderWallet.balance < Number(quantity)) {
      return { success: false, message: 'Insufficient balance' };
    }

    // ดำเนินการโอนเงิน
    const updatedSenderWallet = await prisma.wallet.update({
      where: { walletuser_id: Number(senderWalletUserId) },
      data: { balance: senderWallet.balance - Number(quantity) },
    });

    const updatedReceiverWallet = await prisma.wallet.update({
      where: { walletuser_id: Number(receiverWalletUserId) },
      data: { balance: receiverWallet.balance + Number(quantity) },
    });

    // บันทึก Transaction Log
    const transactionLog = await prisma.transaction.create({
      data: {
        sender_user_id: senderWalletUserId,
        receiver_user_id: receiverWalletUserId,
        crypto_id: senderWallet.crypto_id,
        quantity: Number(quantity),
        transaction_type: 'Internal Transfer',
        status: 'Success',
      },
    });

    return {
      success: true,
      transaction: transactionLog,
    };
  } catch (error) {
    console.error('Transaction failed', error);
    return { success: false, message: error.message };
  }
};
// Service 5: Delete Wallet
export const deleteWalletService = async (wallet_id) => {
  return prisma.wallet.delete({
    where: { wallet_id },
  });
};
