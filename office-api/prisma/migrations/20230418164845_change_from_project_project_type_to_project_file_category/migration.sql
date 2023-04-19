/*
  Warnings:

  - You are about to drop the column `project_type_id` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `ProjectType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_project_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProjectType` DROP FOREIGN KEY `ProjectType_office_id_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `project_type_id`;

-- AlterTable
ALTER TABLE `ProjectFile` ADD COLUMN `category_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ProjectType`;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `office_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFile` ADD CONSTRAINT `ProjectFile_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
