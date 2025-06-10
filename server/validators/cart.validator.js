import { body } from "express-validator";

export const addCartValidator = () => [
    body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer")
        .toInt(),

    body("quantity")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("quantity must be a positive integer")
        .toInt(),
];

export const updateCartValidator = () => [
    body("cartId")
        .notEmpty()
        .withMessage("cartId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("cartId must be a positive integer")
        .toInt(),

    body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer")
        .toInt(),

    body("quantity")
        .notEmpty()
        .withMessage("quantity is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("quantity must be a positive integer")
        .toInt(),
];

export const removeProductFromCartValidator = () => [
    body("cartId")
        .notEmpty()
        .withMessage("cartId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("cartId must be a positive integer")
        .toInt(),

    body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("productId must be a positive integer")
        .toInt(),
];
