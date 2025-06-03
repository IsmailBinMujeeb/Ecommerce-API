-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_verification_token" TEXT,
ADD COLUMN     "email_verification_token_expiry" TIMESTAMP(3),
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false;
