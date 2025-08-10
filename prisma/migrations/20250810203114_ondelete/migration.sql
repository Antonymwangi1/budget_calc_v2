-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_budgetId_fkey";

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
