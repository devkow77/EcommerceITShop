/*
  Warnings:

  - You are about to drop the column `discountedPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountedPrice";

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "discount";
