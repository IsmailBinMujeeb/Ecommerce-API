import { Router } from "express";
import {
    CreateReviewController,
    FetchAllReviewsForAProductController,
} from "../../controllers/api/review.controller.js";
import {
    CreateReviewValidator,
    FetchAllReviewsForProductValidator,
} from "../../validators/review.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: APIs to manage product reviews
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a product review
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 4
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great product, good quality!"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       422:
 *         description: Recieve data is not valid
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    authenticationMiddleware,
    CreateReviewValidator(),
    validatorMiddleware,
    AsyncHandler(CreateReviewController),
);

/**
 * @swagger
 * /api/review/{id}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags:
 *       - Review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fetcehd all products successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product or reviews not found
 *       422:
 *         description: Recieved data is not valid
 */

router.get(
    "/:id",
    FetchAllReviewsForProductValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `reviews:${req.params.id}`),
    AsyncHandler(FetchAllReviewsForAProductController),
);

export default router;
