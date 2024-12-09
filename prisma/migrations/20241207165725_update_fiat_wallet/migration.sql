/*
  Warnings:

  - You are about to drop the column `fiat_id` on the `Wallet` table. All the data in the column will be lost.
  - Made the column `crypto_id` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "FiatWallet" (
    "wallet_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletuser_id" INTEGER NOT NULL,
    "fiat_id" INTEGER NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "FiatWallet_walletuser_id_fkey" FOREIGN KEY ("walletuser_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FiatWallet_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "FiatCurrency" ("fiat_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "crypto_id" INTEGER,
    "fiat_id" INTEGER,
    "order_type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price_per_unit" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "FiatCurrency" ("fiat_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("created_at", "crypto_id", "order_id", "order_type", "price_per_unit", "quantity", "status", "updated_at", "user_id") SELECT "created_at", "crypto_id", "order_id", "order_type", "price_per_unit", "quantity", "status", "updated_at", "user_id" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Transaction" (
    "transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_user_id" INTEGER NOT NULL,
    "receiver_user_id" INTEGER,
    "crypto_id" INTEGER,
    "fiat_id" INTEGER,
    "quantity" REAL NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Transaction_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "User" ("walletuser_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "FiatCurrency" ("fiat_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("created_at", "crypto_id", "quantity", "receiver_user_id", "sender_user_id", "status", "transaction_id", "transaction_type", "updated_at") SELECT "created_at", "crypto_id", "quantity", "receiver_user_id", "sender_user_id", "status", "transaction_id", "transaction_type", "updated_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_Wallet" (
    "wallet_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletuser_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Wallet_walletuser_id_fkey" FOREIGN KEY ("walletuser_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wallet_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Wallet" ("balance", "created_at", "crypto_id", "updated_at", "wallet_id", "walletuser_id") SELECT "balance", "created_at", "crypto_id", "updated_at", "wallet_id", "walletuser_id" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
