/*
  Warnings:

  - You are about to drop the column `user_id` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `walletuser_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletuser_id` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "walletuser_id" TEXT NOT NULL
);
INSERT INTO "new_User" ("created_at", "email", "password", "updated_at", "user_id", "username") SELECT "created_at", "email", "password", "updated_at", "user_id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_walletuser_id_key" ON "User"("walletuser_id");
CREATE TABLE "new_Wallet" (
    "wallet_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletuser_id" TEXT NOT NULL,
    "crypto_id" INTEGER NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Wallet_walletuser_id_fkey" FOREIGN KEY ("walletuser_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wallet_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Wallet" ("balance", "created_at", "crypto_id", "updated_at", "wallet_id") SELECT "balance", "created_at", "crypto_id", "updated_at", "wallet_id" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
