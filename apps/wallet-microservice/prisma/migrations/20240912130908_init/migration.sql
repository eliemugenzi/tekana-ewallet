-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('SAVING', 'PERSONAL', 'LOAN');

-- CreateEnum
CREATE TYPE "ActivityLogAction" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "wallets" (
    "id" SERIAL NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "WalletType" NOT NULL DEFAULT 'SAVING',
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_activity_logs" (
    "id" SERIAL NOT NULL,
    "action" "ActivityLogAction" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "walletId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_activity_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wallet_activity_logs" ADD CONSTRAINT "wallet_activity_logs_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
