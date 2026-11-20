-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "satisfaction" INTEGER NOT NULL,
    "enjoyment" INTEGER NOT NULL,
    "ease_of_use" INTEGER NOT NULL,
    "learning" INTEGER NOT NULL,
    "interest" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);
