/*
  Warnings:

  - Added the required column `transactionId` to the `wallet_activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wallet_activity_logs" ADD COLUMN     "transactionId" INTEGER NOT NULL;
