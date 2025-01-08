-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "client_country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "client_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "freelancer_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "project_title" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "client_country" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "DOB" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "freelancer_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "github" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linkedin" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "workingHours" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "x" TEXT NOT NULL DEFAULT '';
