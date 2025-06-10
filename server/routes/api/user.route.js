import { Router } from "express";

import {
    BanUserController,
    FetchAllUsersController,
    FetchAuthenticatedUserController,
    FetchUserByIdController,
    PromoteUserToModeratorController,
    DemoteModeratorToUser,
} from "../../controllers/api/user.controller.js";
import {
    DemoteModeratorToUserValidator,
    FetchAllUserValidator,
    FetchUserByIdValidator,
    BanUserValidator,
    PromoteUserToModeratorValidator,
} from "../../validators/user.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and moderation endpoints
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Authenticated user's information
 *       401:
 *         description: Unauthorized
 */

router.get(
    "/me",
    authenticationMiddleware,
    cacheMiddleware((req) => `me:${req.user.id}`),
    AsyncHandler(FetchAuthenticatedUserController),
);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users (Moderator only)
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: Pagination cursor
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to fetch
 *     responses:
 *       200:
 *         description: Fetched all users successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.get(
    "/",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info),
    FetchAllUserValidator(),
    validatorMiddleware,
    cacheMiddleware(
        (req) => `users:${req.query.cursor || 1}:${req.query.limit || 10}`,
    ),
    AsyncHandler(FetchAllUsersController),
);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a specific user by ID (Moderator only)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fetched user successfully
 *       404:
 *         description: User not found
 */

router.get(
    "/:id",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info),
    FetchUserByIdValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `user:${req.params.id}`),
    AsyncHandler(FetchUserByIdController),
);

/**
 * @swagger
 * /api/user/{id}/ban:
 *   post:
 *     summary: Ban a user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to ban
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: time for banning
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ttb:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: User banned successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.post(
    "/:id/ban",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_ban_user),
    BanUserValidator(),
    validatorMiddleware,
    AsyncHandler(BanUserController),
);

/**
 * @swagger
 * /api/user/{id}/promote:
 *   post:
 *     summary: Promote a user to moderator
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to promote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User promoted successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.post(
    "/:id/promote",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user),
    PromoteUserToModeratorValidator(),
    validatorMiddleware,
    AsyncHandler(PromoteUserToModeratorController),
);

/**
 * @swagger
 * /api/user/{id}/demote:
 *   post:
 *     summary: Demote a moderator to regular user (Moderator only)
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Moderator ID to demote
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Moderator demoted successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.post(
    "/:id/demote",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user),
    DemoteModeratorToUserValidator(),
    validatorMiddleware,
    AsyncHandler(DemoteModeratorToUser),
);

export default router;
