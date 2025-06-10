import { PaymentMethod } from "@prisma/client";

export const MODERATOR_PERMISSIONS = {
    can_view_products: "can_view_products",
    can_view_categories: "can_view_categories",
    can_view_payments: "can_view_payments",
    can_view_orders: "can_view_orders",
    can_view_user_info: "can_view_user_info",
    can_view_review: "can_view_review",
    can_view_admin_dashboard: "can_view_admin_dashboard",

    can_manage_personal_cart: "can_manage_personal_cart",
    can_place_orders: "can_place_orders",
    can_write_reviews: "can_write_reviews",

    can_moderate_reviews: "can_moderate_reviews",
    can_moderate_products: "can_moderate_products",

    can_perform_crud_on_product: "can_perform_crud_on_product",
    can_perform_crud_on_category: "can_perform_crud_on_category",

    can_ban_user: "can_ban_user",
    can_promote_user: "can_promote_user",
};

export const AVAILABLE_MODERATOR_PERMISSIONS = Object.values(
    MODERATOR_PERMISSIONS,
);

export const VALID_PAYMENT_METHODS = Object.values(PaymentMethod);
