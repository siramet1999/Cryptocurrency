
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getAllFiatCurrencies = async () => {
    return prisma.fiatCurrency.findMany();
  };
  
  export const createFiatCurrency = async (data) => {
    return prisma.fiatCurrency.create({ data });
  };
  
  export const updateFiatCurrency = async (fiatId, data) => {
    return prisma.fiatCurrency.update({
      where: { fiat_id: fiatId },
      data,
    });
  };
  
  export const deleteFiatCurrency = async (fiatId) => {
    return prisma.fiatCurrency.delete({
      where: { fiat_id: fiatId },
    });
  };
  