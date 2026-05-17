-- AlterTable
ALTER TABLE "client_tokens" ADD COLUMN     "lastViewedAt" TIMESTAMP(3),
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewedAt" TIMESTAMP(3);
