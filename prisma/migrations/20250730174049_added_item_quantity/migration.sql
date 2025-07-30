/*
  Warnings:

  - You are about to drop the column `description` on the `Items` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Items" DROP COLUMN "description",
ADD COLUMN     "quantity" INTEGER NOT NULL;
