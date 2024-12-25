-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "client_name" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "min_budget" TEXT NOT NULL DEFAULT '0',
ALTER COLUMN "max_budget" SET DATA TYPE TEXT;
