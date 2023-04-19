/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `current_step` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProjectSchedule` DROP FOREIGN KEY `ProjectSchedule_assigned_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectSchedule` DROP FOREIGN KEY `ProjectSchedule_project_id_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `status`,
    ADD COLUMN `current_step` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ProjectSchedule`;

-- CreateTable
CREATE TABLE `Step` (
    `id` VARCHAR(191) NOT NULL,
    `office_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectStep` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `project_step_id` VARCHAR(191) NOT NULL,
    `assigned_to` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `step_hours` INTEGER NULL,
    `last_updated_at` DATETIME(3) NOT NULL,
    `last_updated_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step` ADD CONSTRAINT `Step_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStep` ADD CONSTRAINT `ProjectStep_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStep` ADD CONSTRAINT `ProjectStep_project_step_id_fkey` FOREIGN KEY (`project_step_id`) REFERENCES `Step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStep` ADD CONSTRAINT `ProjectStep_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
