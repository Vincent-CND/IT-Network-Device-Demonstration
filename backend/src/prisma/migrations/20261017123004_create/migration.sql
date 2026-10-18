/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instruction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_answerId_fkey";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Instruction";

-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "instruction" (
    "id" SERIAL NOT NULL,
    "step" TEXT NOT NULL,

    CONSTRAINT "instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "type" VARCHAR(6) NOT NULL,
    "hint" VARCHAR(100) NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instruction_step_key" ON "instruction"("step");

-- CreateIndex
CREATE UNIQUE INDEX "question_question_key" ON "question"("question");

-- CreateIndex
CREATE UNIQUE INDEX "question_answerId_key" ON "question"("answerId");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
