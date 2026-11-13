-- CreateTable
CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "correct_answer" JSONB NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);
