-- AlterTable
ALTER TABLE `ProjectFile` ADD COLUMN `content_type` VARCHAR(191) NULL,
    ADD COLUMN `folder_id` VARCHAR(191) NULL,
    ADD COLUMN `size` DOUBLE NULL;

-- CreateTable
CREATE TABLE `ProjectFolder` (
    `id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `parent_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `category_id` VARCHAR(191) NULL,
    `project_step_id` VARCHAR(191) NULL,
    `created_by_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectFile` ADD CONSTRAINT `ProjectFile_folder_id_fkey` FOREIGN KEY (`folder_id`) REFERENCES `ProjectFolder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFolder` ADD CONSTRAINT `ProjectFolder_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFolder` ADD CONSTRAINT `ProjectFolder_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `ProjectFolder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFolder` ADD CONSTRAINT `ProjectFolder_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFolder` ADD CONSTRAINT `ProjectFolder_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectFolder` ADD CONSTRAINT `ProjectFolder_project_step_id_fkey` FOREIGN KEY (`project_step_id`) REFERENCES `ProjectStep`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
