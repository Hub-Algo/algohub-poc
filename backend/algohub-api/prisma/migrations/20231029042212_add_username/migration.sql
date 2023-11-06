/*
  Warnings:

  - Added the required column `username` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    CONSTRAINT "Campaign_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User" ("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("creator", "id", "title") SELECT "creator", "id", "title" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE UNIQUE INDEX "Campaign_id_key" ON "Campaign"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
