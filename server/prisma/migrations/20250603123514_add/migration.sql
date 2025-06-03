/*
  Warnings:

  - The primary key for the `CartProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CartProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CartProduct_pkey" PRIMARY KEY ("cartId", "productId");
