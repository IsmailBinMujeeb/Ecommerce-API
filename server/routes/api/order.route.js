import { Router } from "express";

import {
    FetchAllOrdersController,
    FetchOrderController,
    PlaceOrderController,
} from "../../controllers/api/order.controller.js";
import {
    fetchOrderValidator,
    FetchAllOrdersValidator,
    placeOrderValidator,
} from "../../validators/order.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management and placement
 */

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Fetch all orders for the logged-in user
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: Cursor for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of orders to retrieve (default is 10)
 *     responses:
 *       200:
 *         description: Fetcehd users successfully
 *       401:
 *         description: Unauthorized
 */

router.get(
    "/",
    authenticationMiddleware,
    FetchAllOrdersValidator(),
    validatorMiddleware,
    cacheMiddleware(
        (req) =>
            `orders:${req.user.id}:${req.query.cursor || 1}:${req.query.limit || 10}`,
    ),
    AsyncHandler(FetchAllOrdersController),
);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Fetch a specific order by ID
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Fetcehd order
 *       404:
 *         description: Order not found
 *       422:
 *         description: Recieved data is not valid
 */

router.get(
    "/:id",
    fetchOrderValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `order:${req.params.id}`),
    AsyncHandler(FetchOrderController),
);

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Place a new order
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - payment_method
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               payment_method:
 *                 type: string
 *                 example: 'COD'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       422:
 *         description: Recieved data is not valid
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    authenticationMiddleware,
    placeOrderValidator(),
    validatorMiddleware,
    AsyncHandler(PlaceOrderController),
);

export default router;
