import { param, body, query } from "express-validator";
import { MODERATOR_PERMISSIONS } from "../constants.js";

const permissionsKeys = Object.values(MODERATOR_PERMISSIONS);

export const FetchAllUserValidator = () => [
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

export const FetchUserByIdValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("user id is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("user id must be a positive integer")
        .toInt(),
];

export const BanUserValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("user id is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("user id must be a positive integer")
        .toInt(),
    query("ttb")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("time to ban (ttb) must be a positive integer")
        .toInt(),
];

export const PromoteUserToModeratorValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("user id is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("user id must be a positive integer")
        .toInt(),

    body("permissions")
        .notEmpty()
        .withMessage("permissions object is required")
        .bail()
        .isObject()
        .withMessage("permissions must be an object"),

    // Validate each permission key exists and is boolean
    ...permissionsKeys.map((key) =>
        body(`permissions.${key}`)
            .exists()
            .withMessage(`permission '${key}' is required`)
            .bail()
            .isBoolean()
            .withMessage(`permission '${key}' must be a boolean`)
            .toBoolean(),
    ),

    // Custom validator to check no extra keys in permissions object
    body("permissions").custom((value) => {
        const keys = Object.keys(value);
        const invalidKeys = keys.filter((k) => !permissionsKeys.includes(k));
        if (invalidKeys.length > 0) {
            throw new Error(
                `Invalid permission keys: ${invalidKeys.join(", ")}`,
            );
        }
        return true;
    }),
];

export const DemoteModeratorToUserValidator = () => [
    param("id")
        .notEmpty()
        .withMessage("user id is required")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("user id must be a positive integer")
        .toInt(),
];
