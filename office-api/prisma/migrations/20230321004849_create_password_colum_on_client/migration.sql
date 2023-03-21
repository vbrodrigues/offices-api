/*
  Warnings:

  - Added the required column `password` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "office_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT,
    "logo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "Client_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "Office" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("created_at", "email", "id", "is_active", "logo", "name", "office_id", "phone_number", "updated_at") SELECT "created_at", "email", "id", "is_active", "logo", "name", "office_id", "phone_number", "updated_at" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
