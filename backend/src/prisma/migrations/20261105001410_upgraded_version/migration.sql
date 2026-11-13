-- CreateTable
CREATE TABLE "game_instruction" (
    "id" SERIAL NOT NULL,
    "mission" TEXT NOT NULL,

    CONSTRAINT "game_instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "builder_hint" (
    "id" SERIAL NOT NULL,
    "hint" VARCHAR(100) NOT NULL,

    CONSTRAINT "builder_hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LAN_hint" (
    "id" SERIAL NOT NULL,
    "hint" VARCHAR(100) NOT NULL,

    CONSTRAINT "LAN_hint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_instruction_mission_key" ON "game_instruction"("mission");
