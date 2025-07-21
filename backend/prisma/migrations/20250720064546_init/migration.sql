-- CreateTable
CREATE TABLE "TarotCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "arcana" TEXT NOT NULL,
    "suit" TEXT,
    "number" INTEGER,
    "uprightMeaning" TEXT NOT NULL,
    "reversedMeaning" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Spread" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "positions" TEXT NOT NULL,
    "cardCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Divination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "spreadId" INTEGER NOT NULL,
    "questionAnalysis" TEXT NOT NULL,
    "spreadRecommendation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Divination_spreadId_fkey" FOREIGN KEY ("spreadId") REFERENCES "Spread" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DivinationCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "divinationId" TEXT NOT NULL,
    "cardId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "isReversed" BOOLEAN NOT NULL DEFAULT false,
    "interpretation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DivinationCard_divinationId_fkey" FOREIGN KEY ("divinationId") REFERENCES "Divination" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DivinationCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "TarotCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TarotCard_name_key" ON "TarotCard"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Spread_name_key" ON "Spread"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DivinationCard_divinationId_position_key" ON "DivinationCard"("divinationId", "position");
