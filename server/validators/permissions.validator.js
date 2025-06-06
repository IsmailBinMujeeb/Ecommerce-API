import { param, body } from "express-validator";
import { MODERATOR_PERMISSIONS } from "../constants.js";

const permissionsKeys = Object.values(MODERATOR_PERMISSIONS);

export const FetchModeratorPermissionsValidator = () => [
    param("id")
        .notEmpty().withMessage("moderator id is required").bail()
        .isInt({ gt: 0 }).withMessage("moderator id must be a positive integer").bail()
        .toInt()
];

export const UpdateModeratorPermissionsValidator = () => [
    param("id")
        .notEmpty().withMessage("moderator id is required").bail()
        .isInt({ gt: 0 }).withMessage("moderator id must be a positive integer").bail()
        .toInt(),

    body("permissions")
        .notEmpty().withMessage("permissions object is required").bail()
        .isObject().withMessage("permissions must be an object")
        .custom((permissions) => {
            const keys = Object.keys(permissions);
            const extraKeys = keys.filter(key => !permissionsKeys.includes(key));

            if (extraKeys.length > 0) throw new Error(`Invalid permission keys sent: ${extraKeys.join(", ")}`);

            return true;
        }),

    // Validate each permission key is boolean
    ...permissionsKeys.map(key =>
        body(`permissions.${key}`)
            .exists().withMessage(`permission '${key}' is required`).bail()
            .isBoolean().withMessage(`permission '${key}' must be a boolean`).toBoolean()
    ),
];
