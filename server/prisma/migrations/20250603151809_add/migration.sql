-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "moderatorId" INTEGER NOT NULL,
    "can_view_products" BOOLEAN NOT NULL DEFAULT true,
    "can_view_categories" BOOLEAN NOT NULL DEFAULT true,
    "can_view_payments" BOOLEAN NOT NULL DEFAULT false,
    "can_view_orders" BOOLEAN NOT NULL DEFAULT true,
    "can_view_user_info" BOOLEAN NOT NULL DEFAULT true,
    "can_view_review" BOOLEAN NOT NULL DEFAULT true,
    "can_view_admin_dashboard" BOOLEAN NOT NULL DEFAULT true,
    "can_manage_personal_cart" BOOLEAN NOT NULL DEFAULT false,
    "can_place_orders" BOOLEAN NOT NULL DEFAULT false,
    "can_write_reviews" BOOLEAN NOT NULL DEFAULT false,
    "can_moderate_reviews" BOOLEAN NOT NULL DEFAULT true,
    "can_moderate_products" BOOLEAN NOT NULL DEFAULT true,
    "can_perform_crud_on_product" BOOLEAN NOT NULL DEFAULT false,
    "can_perform_crud_on_category" BOOLEAN NOT NULL DEFAULT false,
    "can_ban_user" BOOLEAN NOT NULL DEFAULT false,
    "can_promote_user" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_moderatorId_key" ON "Permission"("moderatorId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
