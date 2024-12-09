import { PrismaClient } from "@prisma/client";
import { createWallet } from "../services/walletService.js";
const prisma = new PrismaClient();
export const handleTransferService = async (
  senderUserId,
  receiverwalletuser,
  cryptoId,
  quantity
) => {
  const senderWallet = await prisma.wallet.findFirst({
    where: {
      walletuser_id: senderUserId,
      crypto_id: cryptoId,
    },
  });

  if (!senderWallet || senderWallet.balance < quantity) {
    const transaction = await prisma.transaction.create({
      data: {
        sender_user_id: Number(senderUserId),
        receiver_user_id: Number(receiverwalletuser),
        crypto_id: cryptoId,
        quantity: quantity,
        transaction_type: "Transfer",
        status: "failed",
      },
    });
    throw new Error("Insufficient balance");
  }

  let receiverWallet = await prisma.wallet.findFirst({
    where: {
      walletuser_id: receiverwalletuser,
      crypto_id: cryptoId,
    },
  });

  if (!receiverWallet) {
    const wallet = await createWallet(receiverwalletuser, cryptoId);
    if (!wallet) {
      const transaction = await prisma.transaction.create({
        data: {
          sender_user_id: Number(senderUserId),
          receiver_user_id: Number(receiverwalletuser),
          crypto_id: cryptoId,
          quantity: quantity,
          transaction_type: "Transfer",
          status: "failed",
        },
      });

      throw new Error("Receiver wallet not found");
    }
    receiverWallet = wallet;
  }

  const updatedSenderWallet = await prisma.wallet.update({
    where: { wallet_id: senderWallet.wallet_id },
    data: { balance: senderWallet.balance - quantity },
  });

  const updatedReceiverWallet = await prisma.wallet.update({
    where: { wallet_id: receiverWallet.wallet_id },
    data: { balance: receiverWallet.balance + quantity },
  });

  const transaction = await prisma.transaction.create({
    data: {
      sender_user_id: Number(senderUserId),
      receiver_user_id: Number(receiverwalletuser),
      crypto_id: cryptoId,
      quantity: quantity,
      transaction_type: "Transfer",
      status: "Success",
    },
  });

  return { updatedSenderWallet, updatedReceiverWallet, transaction };
};
