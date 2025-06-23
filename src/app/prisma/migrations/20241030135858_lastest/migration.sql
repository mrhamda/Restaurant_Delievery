-- DropIndex
DROP INDEX `OrderItem_orderId_fkey` ON `orderitem`;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `orderId` VARCHAR(191) NOT NULL;
