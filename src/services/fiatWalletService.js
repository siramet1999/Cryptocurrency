import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFiatWalletsByUser = async (userId) => {
  console.log(userId);
  
  return await prisma.fiatWallet.findMany({
    where: { walletuser_id: userId },
    include: { fiat_currency: true },
  });
};

export const createFiatWallet = async (walletuser_id, fiat_id) => {

  const walletExists = await prisma.fiatWallet.findFirst({
    where: {
      walletuser_id,
      fiat_id,
    },
  });

  if (walletExists) {
    return walletExists;
  }
  
  return await prisma.fiatWallet.create({
    data: { walletuser_id, fiat_id, balance: 0 },
  });
};

export const updateFiatWallet = async (walletId, amount) => {
  console.log(walletId, amount);
  
  return await prisma.fiatWallet.update({
    where: { wallet_id: walletId },
    data: { balance:amount },
  });
};

export const deleteFiatWallet = async (walletId) => {
  await prisma.fiatWallet.delete({
    where: { wallet_id: walletId },
  });
};