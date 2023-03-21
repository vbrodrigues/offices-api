-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "path" TEXT,
    "name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "ProjectFile_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectFile_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectFile" ("created_at", "created_by_id", "id", "name", "path", "project_id", "updated_at") SELECT "created_at", "created_by_id", "id", "name", "path", "project_id", "updated_at" FROM "ProjectFile";
DROP TABLE "ProjectFile";
ALTER TABLE "new_ProjectFile" RENAME TO "ProjectFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
