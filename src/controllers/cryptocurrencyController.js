import * as cryptoService from '../services/cryptocurrencyService.js';

// สร้าง Cryptocurrency ใหม่
export const createCryptocurrency = async (req, res) => {
  const { name, symbol, price_usd } = req.body;

  try {
    const newCrypto = await cryptoService.createCryptocurrency(name, symbol, price_usd);
    res.status(201).json(newCrypto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ดึงข้อมูล Cryptocurrency ทั้งหมด
export const getCryptocurrencies = async (req, res) => {
  try {
    const cryptocurrencies = await cryptoService.getAllCryptocurrencies();
    res.status(200).json(cryptocurrencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// อัปเดต Cryptocurrency
export const updateCryptocurrency = async (req, res) => {
  const { id } = req.params;
  const { price_usd } = req.body;

  try {
    const updatedCrypto = await cryptoService.updateCryptocurrencyPrice(Number(id), price_usd);
    res.status(200).json(updatedCrypto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
