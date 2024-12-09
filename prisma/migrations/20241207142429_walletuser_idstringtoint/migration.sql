/*
  Warnings:

  - You are about to alter the column `walletuser_id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `walletuser_id` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "transaction_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sender_user_id" INTEGER NOT NULL,
    "receiver_user_id" INTEGER,
    "crypto_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Transaction_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "User" ("walletuser_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transaction_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("created_at", "crypto_id", "quantity", "receiver_user_id", "sender_user_id", "status", "transaction_id", "transaction_type", "updated_at") SELECT "created_at", "crypto_id", "quantity", "receiver_user_id", "sender_user_id", "status", "transaction_id", "transaction_type", "updated_at" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "walletuser_id" INTEGER NOT NULL
);
INSERT INTO "new_User" ("created_at", "email", "password", "updated_at", "user_id", "username", "walletuser_id") SELECT "created_at", "email", "password", "updated_at", "user_id", "username", "walletuser_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_walletuser_id_key" ON "User"("walletuser_id");
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
