-- AlterTable
ALTER TABLE `ProjectFile` ADD COLUMN `project_step_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ProjectFile` ADD CONSTRAINT `ProjectFile_project_step_id_fkey` FOREIGN KEY (`project_step_id`) REFERENCES `ProjectStep`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
