/*
  Warnings:

  - You are about to alter the column `congo` on the `PlayerPair` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `date` on the `Score` table. All the data in the column will be lost.
  - You are about to alter the column `congo` on the `Score` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pseudo" TEXT NOT NULL,
    "avatar" TEXT,
    "nickname" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Player" ("avatar", "createdAt", "id", "nickname", "pseudo", "updatedAt") SELECT "avatar", "createdAt", "id", "nickname", "pseudo", "updatedAt" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_pseudo_key" ON "Player"("pseudo");
CREATE TABLE "new_PlayerPair" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "victories" INTEGER NOT NULL DEFAULT 0,
    "defeats" INTEGER NOT NULL DEFAULT 0,
    "congo" INTEGER NOT NULL DEFAULT 0,
    "passage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlayerPair_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayerPair_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlayerPair" ("congo", "createdAt", "defeats", "id", "passage", "player1Id", "player2Id", "updatedAt", "victories") SELECT "congo", "createdAt", "defeats", "id", "passage", "player1Id", "player2Id", "updatedAt", "victories" FROM "PlayerPair";
DROP TABLE "PlayerPair";
ALTER TABLE "new_PlayerPair" RENAME TO "PlayerPair";
CREATE UNIQUE INDEX "PlayerPair_player1Id_player2Id_key" ON "PlayerPair"("player1Id", "player2Id");
CREATE TABLE "new_Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "isVictory" BOOLEAN NOT NULL,
    "congo" INTEGER NOT NULL DEFAULT 0,
    "passage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Score_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Score" ("congo", "createdAt", "id", "isVictory", "passage", "playerId", "updatedAt") SELECT "congo", "createdAt", "id", "isVictory", "passage", "playerId", "updatedAt" FROM "Score";
DROP TABLE "Score";
ALTER TABLE "new_Score" RENAME TO "Score";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
