import { param, body, query } from "express-validator";

export const FetchAllProductsValidator = () => [
    query("cursor")
        .optional()
        .isInt({ gt: 0 }).withMessage("cursor must be a positive integer").bail()
        .toInt(),

    query("limit")
        .optional()
        .isInt({ gt: 0 }).withMessage("limit must be a positive integer").bail()
        .toInt(),
];

export const FetchProductValidator = () => [
    param("id")
        .notEmpty().withMessage("product id is required").bail()
        .isInt({ gt: 0 }).withMessage("product id must be a positive integer").bail()
        .toInt(),
];

export const CreateProductValidator = () => [
    body("product_name")
        .notEmpty().withMessage("product_name is required").bail()
        .isString().withMessage("product_name must be a string"),

    body("product_description")
        .optional()
        .isString().withMessage("product_description must be a string"),

    body("product_offer")
        .notEmpty().withMessage("product_offer is required").bail()
        .isFloat({ min: 0 }).withMessage("product_offer must be a non-negative number").bail()
        .toFloat(),

    body("product_price")
        .notEmpty().withMessage("product_price is required").bail()
        .isFloat({ gt: 0 }).withMessage("product_price must be a positive number").bail()
        .toFloat(),

    body("product_stock")
        .notEmpty().withMessage("product_stock is required").bail()
        .isInt({ min: 0 }).withMessage("product_stock must be a non-negative integer").bail()
        .toInt(),

    body("categoryId")
        .notEmpty().withMessage("categoryId is required").bail()
        .isInt({ gt: 0 }).withMessage("categoryId must be a positive integer").bail()
        .toInt(),
];

export const UpdateProductValidator = () => [
    param("id")
        .notEmpty().withMessage("product id is required").bail()
        .isInt({ gt: 0 }).withMessage("product id must be a positive integer").bail()
        .toInt(),

    body("product_name")
        .notEmpty().withMessage("product_name is required").bail()
        .isString().withMessage("product_name must be a string"),

    body("product_description")
        .notEmpty().withMessage("product_description is required").bail()
        .isString().withMessage("product_description must be a string"),

    body("product_offer")
        .notEmpty().withMessage("product_offer is required").bail()
        .isFloat({ min: 0 }).withMessage("product_offer must be a non-negative number").bail()
        .toFloat(),

    body("product_price")
        .notEmpty().withMessage("product_price is required").bail()
        .isFloat({ gt: 0 }).withMessage("product_price must be a positive number").bail()
        .toFloat(),
];

export const DeleteProductValidator = () => [
    param("id")
        .notEmpty().withMessage("product id is required").bail()
        .isInt({ gt: 0 }).withMessage("product id must be a positive integer").bail()
        .toInt(),
];
