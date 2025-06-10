import { body, param, query } from "express-validator";
import { VALID_PAYMENT_METHODS } from "../constants.js";

export const FetchAllOrdersValidator = () => [
    query("cursor")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("cursor must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("limit must be a positive integer")
        .toInt(),
];

export const fetchOrderValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("Order ID is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Order ID must be a positive integer")
        .toInt(),
];

export const placeOrderValidator = () => [
    body("items")
        .notEmpty()
        .withMessage("Items are required")
        .bail()
        .isArray({ min: 1 })
        .withMessage("Items must be a non-empty array"),

    body("items.*.productId")
        .notEmpty()
        .withMessage("productId is required for each item")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer")
        .toInt(),

    body("items.*.quantity")
        .notEmpty()
        .withMessage("quantity is required for each item")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("quantity must be a positive integer")
        .toInt(),

    body("payment_method")
        .notEmpty()
        .withMessage("Payment method is required")
        .bail()
        .isIn(VALID_PAYMENT_METHODS)
        .withMessage("Invalid payment method"),
];
