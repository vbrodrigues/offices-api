/*
  Warnings:

  - A unique constraint covering the columns `[project_id,step_id]` on the table `ProjectStep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProjectStep_project_id_step_id_key` ON `ProjectStep`(`project_id`, `step_id`);
