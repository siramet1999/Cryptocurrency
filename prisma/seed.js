import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = "ssssssssss12345";

async function seedDatabase() {
  try {
    // Step 1: Seed Users
    const users = [
      { username: "user1", email: "user1@example.com", password: "password", walletuser_id: 123456 },
      { username: "user2", email: "user2@example.com", password: "password", walletuser_id: 234567 },
      { username: "user3", email: "user3@example.com", password: "password", walletuser_id: 345678 },
      { username: "user4", email: "user4@example.com", password: "password", walletuser_id: 456789 },
      { username: "user5", email: "user5@example.com", password: "password", walletuser_id: 567890 },
    ];

    // Hash passwords using bcrypt
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => ({
        username: user.username,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        walletuser_id: user.walletuser_id,
      }))
    );

    await prisma.user.createMany({
      data: usersWithHashedPasswords,
    });
    console.log("Users created with hashed passwords.");

    // Step 2: Seed Cryptocurrencies
    const cryptocurrencies = [
      { name: "Bitcoin", symbol: "BTC", price_usd: 50 },
      { name: "Ethereum", symbol: "ETH", price_usd: 30 },
      { name: "Ripple", symbol: "XRP", price_usd: 1 },
      { name: "Dogecoin", symbol: "DOGE", price_usd: 1 },
    ];

    await prisma.cryptocurrency.createMany({ data: cryptocurrencies });
    console.log("Cryptocurrencies created.");

    // Step 3: Seed Fiat Currencies
    const fiatCurrencies = [
      { name: "Thai Baht", symbol: "THB", exchange_rate: 35 },
      { name: "US Dollar", symbol: "USD", exchange_rate: 1 },
    ];

    await prisma.fiatCurrency.createMany({ data: fiatCurrencies });
    console.log("Fiat Currencies created.");

    // Step 4: Seed Cryptocurrency Wallets
    const userRecords = await prisma.user.findMany({ select: { walletuser_id: true } });
    const wallets = [];
    for (const user of userRecords) {
      wallets.push(
        { walletuser_id: user.walletuser_id, crypto_id: 1, balance: 200 }, // BTC
        { walletuser_id: user.walletuser_id, crypto_id: 2, balance: 200 }, // ETH
        { walletuser_id: user.walletuser_id, crypto_id: 3, balance: 200 }, // XRP
        { walletuser_id: user.walletuser_id, crypto_id: 4, balance: 200 }  // DOGE
      );
    }

    await prisma.wallet.createMany({ data: wallets });
    console.log("Cryptocurrency wallets created.");

    // Step 5: Seed Fiat Wallets
    const fiatWallets = [];
    for (const user of userRecords) {
      fiatWallets.push(
        { walletuser_id: user.walletuser_id, fiat_id: 1, balance: 1500 }, // THB
        { walletuser_id: user.walletuser_id, fiat_id: 2, balance: 1500 }  // USD
      );
    }

    await prisma.fiatWallet.createMany({ data: fiatWallets });
    console.log("Fiat wallets created.");

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
