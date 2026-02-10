-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('highschool', 'college');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "studentType" "StudentType" NOT NULL DEFAULT 'highschool',
ALTER COLUMN "grade" DROP NOT NULL,
ALTER COLUMN "section" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Student_studentType_idx" ON "Student"("studentType");
