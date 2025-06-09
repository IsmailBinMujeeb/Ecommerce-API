import { body, param, query } from "express-validator";

export const FetchAllCategoriesValidator = () => [
    query("cursor")
        .optional()
        .isInt({ gt: 0 }).withMessage("cursor must be a positive integer").bail()
        .toInt(),

    query("limit")
        .optional()
        .isInt({ gt: 0 }).withMessage("limit must be a positive integer").bail()
        .toInt(),
]

export const FetchCategoryValidator = () => [
    param("id")
        .notEmpty().withMessage("Category ID is required").bail()
        .isInt({ gt: 0 }).withMessage("Category ID must be a positive integer").bail()
        .toInt(),
]

export const createCategoryValidator = () => [
    body("name")
        .trim()
        .notEmpty().withMessage("Category name is required").bail()
        .isLength({ min: 2 }).withMessage("Category name must be at least 2 characters"),
];

export const categoryIdParamValidator = () => [
    param("id")
        .notEmpty().withMessage("Category ID is required").bail()
        .isInt({ gt: 0 }).withMessage("Category ID must be a positive integer").bail()
        .toInt(),
];

export const updateCategoryValidator = () => [
    ...categoryIdParamValidator(),
    body("name")
        .trim()
        .notEmpty().withMessage("Updated category name is required").bail()
        .isLength({ min: 2 }).withMessage("Category name must be at least 2 characters"),
];
