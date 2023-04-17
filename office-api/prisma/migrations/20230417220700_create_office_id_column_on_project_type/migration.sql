-- AlterTable
ALTER TABLE `ProjectType` ADD COLUMN `office_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ProjectType` ADD CONSTRAINT `ProjectType_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
