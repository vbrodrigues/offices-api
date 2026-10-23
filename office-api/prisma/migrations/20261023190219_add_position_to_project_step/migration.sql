-- AlterTable
ALTER TABLE `ProjectStep` ADD COLUMN `position` INTEGER NOT NULL DEFAULT 0;

-- Number the steps of existing projects (0, 1, 2...) following the order the
-- steps were created in the office, which is the closest to the intended order.
UPDATE `ProjectStep` ps
JOIN (
    SELECT ps2.`id`,
           ROW_NUMBER() OVER (
               PARTITION BY ps2.`project_id`
               ORDER BY s.`created_at`, ps2.`id`
           ) - 1 AS `new_position`
    FROM `ProjectStep` ps2
    JOIN `Step` s ON s.`id` = ps2.`step_id`
) ordered ON ordered.`id` = ps.`id`
SET ps.`position` = ordered.`new_position`;
