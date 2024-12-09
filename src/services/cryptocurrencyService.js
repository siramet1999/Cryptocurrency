import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// สร้าง Cryptocurrency ใหม่
export const createCryptocurrency = async (name, symbol, price_usd) => {
  try {
    const crypto = await prisma.cryptocurrency.create({
      data: {
        name,
        symbol,
        price_usd,
      },
    });
    return crypto;
  } catch (error) {
    throw new Error('Error creating cryptocurrency: ' + error.message);
  }
};

// ดึงข้อมูล Cryptocurrency ทั้งหมด
export const getAllCryptocurrencies = async () => {
  try {
    return await prisma.cryptocurrency.findMany();
  } catch (error) {
    throw new Error('Error fetching cryptocurrencies: ' + error.message);
  }
};

// อัปเดตราคา Cryptocurrency
export const updateCryptocurrencyPrice = async (crypto_id, newPrice) => {
  try {
    const updatedCrypto = await prisma.cryptocurrency.update({
      where: { crypto_id },
      data: { price_usd: newPrice },
    });
    return updatedCrypto;
  } catch (error) {
    throw new Error('Error updating cryptocurrency: ' + error.message);
  }
};
