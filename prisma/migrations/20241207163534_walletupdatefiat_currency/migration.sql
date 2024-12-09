-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wallet" (
    "wallet_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletuser_id" INTEGER NOT NULL,
    "crypto_id" INTEGER,
    "fiat_id" INTEGER,
    "balance" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Wallet_walletuser_id_fkey" FOREIGN KEY ("walletuser_id") REFERENCES "User" ("walletuser_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wallet_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Cryptocurrency" ("crypto_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Wallet_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "FiatCurrency" ("fiat_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Wallet" ("balance", "created_at", "crypto_id", "updated_at", "wallet_id", "walletuser_id") SELECT "balance", "created_at", "crypto_id", "updated_at", "wallet_id", "walletuser_id" FROM "Wallet";
DROP TABLE "Wallet";
ALTER TABLE "new_Wallet" RENAME TO "Wallet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
