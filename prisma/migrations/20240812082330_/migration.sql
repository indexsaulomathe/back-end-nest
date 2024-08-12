/*
  Warnings:

  - The `amount` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `balance` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "balance",
ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0;
