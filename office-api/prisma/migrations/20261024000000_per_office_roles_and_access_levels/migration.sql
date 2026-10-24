-- Roles (job titles) become per office, and what an employee can do moves to
-- Employee.access_level. Existing data is migrated:
-- - employees with the old global "owner" role become PARTNER, and the
--   oldest one of each office becomes its single OWNER;
-- - every global role in use gets a copy per office ("owner" is renamed to
--   "Sócio(a)"), employees point to their office's copy, and the global rows
--   are deleted;
-- - every office gets the default job titles it doesn't have yet.

-- DropForeignKey
ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_role_id_fkey`;

-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `access_level` ENUM('OWNER', 'PARTNER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    MODIFY `role_id` VARCHAR(191) NULL;

-- Access levels from the old "owner" role
UPDATE `Employee` e
JOIN `Role` r ON r.`id` = e.`role_id`
SET e.`access_level` = 'PARTNER'
WHERE r.`label` = 'owner';

CREATE TEMPORARY TABLE `_first_owner` AS
SELECT (
    SELECT e2.`id` FROM `Employee` e2
    WHERE e2.`office_id` = e.`office_id` AND e2.`access_level` = 'PARTNER'
    ORDER BY e2.`created_at`, e2.`id`
    LIMIT 1
  ) AS `employee_id`
FROM `Employee` e
WHERE e.`access_level` = 'PARTNER'
GROUP BY e.`office_id`;

UPDATE `Employee` e
JOIN `_first_owner` f ON f.`employee_id` = e.`id`
SET e.`access_level` = 'OWNER';

DROP TEMPORARY TABLE `_first_owner`;

-- AlterTable
ALTER TABLE `Role` ADD COLUMN `office_id` VARCHAR(191) NULL;

-- One copy of each global role per office that uses it
CREATE TEMPORARY TABLE `_role_map` AS
SELECT t.`office_id`, t.`old_role_id`, UUID() AS `new_role_id`, t.`label`
FROM (
  SELECT DISTINCT e.`office_id`, e.`role_id` AS `old_role_id`,
    CASE WHEN r.`label` = 'owner' THEN 'Sócio(a)' ELSE r.`label` END AS `label`
  FROM `Employee` e
  JOIN `Role` r ON r.`id` = e.`role_id`
  WHERE r.`office_id` IS NULL
) t;

INSERT INTO `Role` (`id`, `office_id`, `label`, `created_at`)
SELECT `new_role_id`, `office_id`, `label`, CURRENT_TIMESTAMP(3) FROM `_role_map`;

UPDATE `Employee` e
JOIN `_role_map` m ON m.`office_id` = e.`office_id` AND m.`old_role_id` = e.`role_id`
SET e.`role_id` = m.`new_role_id`;

DROP TEMPORARY TABLE `_role_map`;

DELETE FROM `Role` WHERE `office_id` IS NULL;

-- Default job titles, also created at signup
INSERT INTO `Role` (`id`, `office_id`, `label`, `created_at`)
SELECT UUID(), o.`id`, d.`label`, CURRENT_TIMESTAMP(3)
FROM `Office` o
CROSS JOIN (
  SELECT 'Sócio(a)' AS `label`
  UNION ALL SELECT 'Arquiteto(a)'
  UNION ALL SELECT 'Engenheiro(a)'
  UNION ALL SELECT 'Estagiário(a)'
  UNION ALL SELECT 'Administrativo'
) d
WHERE NOT EXISTS (
  SELECT 1 FROM `Role` r WHERE r.`office_id` = o.`id` AND r.`label` = d.`label`
);

ALTER TABLE `Role` MODIFY `office_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Role_office_id_label_key` ON `Role`(`office_id`, `label`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_office_id_fkey` FOREIGN KEY (`office_id`) REFERENCES `Office`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
