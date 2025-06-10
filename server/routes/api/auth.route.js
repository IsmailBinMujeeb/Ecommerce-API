import { Router } from "express";
import {
    UserRegisterController,
    UserLoginController,
    UserLogoutController,
    emailVerificationController,
    refreshAccessToken,
    saveUserAddressController,
    getUserAddressController,
} from "../../controllers/api/auth.controller.js";
import {
    UserLoginValidator,
    UserLogoutValidator,
    UserRegisterValidator,
    emailVerificationValidator,
    refreshAccessTokenValidator,
    saveUserAddressValidator,
} from "../../validators/auth.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - display_name
 *               - email
 *               - username
 *               - password
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               username:
 *                 type: string
 *                 example: jhondoe
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exist
 *       422:
 *         description: Recieved data is not valid
 *       500:
 *         description: failed to create user
 */

router.post(
    "/register",
    UserRegisterValidator(),
    validatorMiddleware,
    AsyncHandler(UserRegisterController),
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: user logged in successfully
 *       401:
 *         description: Invalid password
 *       404:
 *          description: User not found
 *       422:
 *          description: Recieved data is not valid
 */

router.post(
    "/login",
    UserLoginValidator(),
    validatorMiddleware,
    AsyncHandler(UserLoginController),
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logout successful
 *       401:
 *         description: Invalid access token
 *       404:
 *         description: User not found
 */

router.post(
    "/logout",
    UserLogoutValidator(),
    validatorMiddleware,
    AsyncHandler(UserLogoutController),
);

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email with a token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       404:
 *         description: User not found or token expired
 *       422:
 *         description: Recieved data is not valid
 */

router.get(
    "/verify-email/:token",
    emailVerificationValidator(),
    validatorMiddleware,
    AsyncHandler(emailVerificationController),
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: some-refresh-token-string
 *     responses:
 *       200:
 *         description: Tokens regerated successfully
 *       401:
 *         description: Refresh token expired or used
 */

router.post(
    "/refresh-token",
    refreshAccessTokenValidator(),
    validatorMiddleware,
    AsyncHandler(refreshAccessToken),
);

/**
 * @swagger
 * /api/auth/address:
 *   post:
 *     summary: Save or update user address
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - line1
 *               - city
 *               - state
 *               - postal
 *               - country
 *             properties:
 *               line1:
 *                 type: string
 *                 example: 123 Main
 *               line2:
 *                 type: string
 *                 example: 567 Main
 *               city:
 *                 type: string
 *                 example: mumbai
 *               state:
 *                 type: string
 *                 example: maharashtra
 *               postal:
 *                 type: string
 *                 example: 400037
 *               country:
 *                 type: string
 *                 example: india
 *     responses:
 *       200:
 *         description: Address saved successfully
 *       400:
 *         description: Missing access token
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User doesn't exist
 */

router.post(
    "/address",
    saveUserAddressValidator(),
    authenticationMiddleware,
    validatorMiddleware,
    AsyncHandler(saveUserAddressController),
);

/**
 * @swagger
 * /api/auth/address:
 *   get:
 *     summary: Get user's saved address
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */

router.get(
    "/address",
    authenticationMiddleware,
    AsyncHandler(getUserAddressController),
);

export default router;
