-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_project_type_id_fkey`;

-- AlterTable
ALTER TABLE `Project` MODIFY `project_type_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_project_type_id_fkey` FOREIGN KEY (`project_type_id`) REFERENCES `ProjectType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
