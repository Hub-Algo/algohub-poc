/*
  Warnings:

  - You are about to drop the column `username` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    CONSTRAINT "Campaign_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User" ("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("creator", "id", "title") SELECT "creator", "id", "title" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE UNIQUE INDEX "Campaign_id_key" ON "Campaign"("id");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wallet_address" TEXT NOT NULL,
    "username" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "wallet_address") SELECT "id", "wallet_address" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
