import express from 'express';
import dotenv from 'dotenv';
import userRoutes from   './routes/userRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import cryptocurrencyRoutes from './routes/cryptocurrencyRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import fiatRoutes from './routes/fiatRoutes.js';
import fiatWalletRoutes from './routes/fiatWalletRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
// โหลดค่าต่างๆ จากไฟล์ .env
dotenv.config();

// สร้างแอปพลิเคชัน Express
const app = express();

// ใช้ middleware
app.use(express.json());  // สำหรับการรับข้อมูลในรูปแบบ JSON


// กำหนดเส้นทาง
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/cryptocurrencies', cryptocurrencyRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/fiat',fiatRoutes)
app.use('/api/fiat-wallet', fiatWalletRoutes);
app.use('/api/trade',tradeRoutes)
// รันเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
