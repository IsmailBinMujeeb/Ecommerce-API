import { Router } from "express";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import {
    FetchModeratorPermissionsController,
    UpdateModeratorPermissionsController,
} from "../../controllers/api/permissions.controller.js";
import {
    FetchModeratorPermissionsValidator,
    UpdateModeratorPermissionsValidator,
} from "../../validators/permissions.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { UserRole } from "@prisma/client";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import ApiError from "../../utils/ApiError.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: Manage and retrieve user permissions
 */

/**
 * @swagger
 * /api/permission/{id}:
 *   get:
 *     summary: Get permissions for a specific user
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Fetcehd permissions successfully
 *       401:
 *         description: Unauthorized access
 *       422:
 *         description: Recieved data not found
 *       404:
 *         description: Permissions not found
 */

router.get(
    "/:id", // Endpoint /api/permission/:id
    authenticationMiddleware, // Middleware to authonticate user
    AsyncHandler(async (req, res, next) => {
        // Middleware to authorize user

        const user = req.user;

        if (user.role == UserRole.ADMIN) return next();
        if (user.id == req.params?.id) return next();

        throw new ApiError(401, "unauthorized user");
    }),
    FetchModeratorPermissionsValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `permission:${req.id}`),
    AsyncHandler(FetchModeratorPermissionsController), // Controller
);

/**
 * @swagger
 * /api/permission/{id}:
 *   post:
 *     summary: Update permissions for a specific moderator
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Moderator user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               can_view_products: true
 *               can_view_categories: true
 *               can_view_payments: false
 *               can_view_orders: false
 *               can_view_user_info: true
 *               can_view_review: true
 *               can_view_admin_dashboard: false
 *
 *               can_manage_personal_cart: false
 *               can_place_orders: false
 *               can_write_reviews: false

 *               can_moderate_reviews: false
 *               can_moderate_products: false

 *               can_perform_crud_on_product: false
 *               can_perform_crud_on_category: false

 *               can_ban_user: false
 *               can_promote_user: false
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       422:
 *         description: Recieved data is not valid
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/:id",
    authenticationMiddleware,
    AsyncHandler(permissionsMiddleware()),
    UpdateModeratorPermissionsValidator(),
    validatorMiddleware,
    AsyncHandler(UpdateModeratorPermissionsController),
);

export default router;
