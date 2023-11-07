/*
  Warnings:

  - Added the required column `description` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `media_id` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CampaignMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    CONSTRAINT "Campaign_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "CampaignMedia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User" ("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("creator", "id", "title") SELECT "creator", "id", "title" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE UNIQUE INDEX "Campaign_id_key" ON "Campaign"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMedia_id_key" ON "CampaignMedia"("id");
