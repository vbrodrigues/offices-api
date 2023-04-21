/*
  Warnings:

  - You are about to drop the column `project_step_id` on the `ProjectStep` table. All the data in the column will be lost.
  - Added the required column `step_id` to the `ProjectStep` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProjectStep` DROP FOREIGN KEY `ProjectStep_project_step_id_fkey`;

-- AlterTable
ALTER TABLE `ProjectStep` DROP COLUMN `project_step_id`,
    ADD COLUMN `step_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProjectStep` ADD CONSTRAINT `ProjectStep_step_id_fkey` FOREIGN KEY (`step_id`) REFERENCES `Step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
