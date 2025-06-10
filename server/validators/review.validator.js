import { body, param } from "express-validator";

export const CreateReviewValidator = () => [
    body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer")
        .bail()
        .toInt(),

    body("rating")
        .notEmpty()
        .withMessage("rating is required")
        .bail()
        .isInt({ min: 1, max: 5 })
        .withMessage("rating must be an integer between 1 and 5")
        .bail()
        .toInt(),

    body("comment")
        .optional()
        .isString()
        .withMessage("comment must be a string"),
];

export const FetchAllReviewsForProductValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("product id is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("product id must be a positive integer")
        .bail()
        .toInt(),
];
