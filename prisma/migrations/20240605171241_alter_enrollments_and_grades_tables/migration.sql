/*
  Warnings:

  - Added the required column `absences` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAbscences` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "absences" INTEGER NOT NULL,
ADD COLUMN     "maxAbscences" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Grade" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;
