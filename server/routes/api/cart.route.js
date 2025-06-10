import { Router } from "express";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import {
    addCartController,
    getUserCartContorller,
    removeProductFromCartController,
    updateCartController,
} from "../../controllers/api/cart.controller.js";
import {
    addCartValidator,
    removeProductFromCartValidator,
    updateCartValidator,
} from "../../validators/cart.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User shopping cart operations
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */

router.get(
    "/",
    authenticationMiddleware,
    cacheMiddleware((req) => `cart:${req.user.id}`),
    AsyncHandler(getUserCartContorller),
);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       422:
 *         description: Recieved data is not valid
 */

router.post(
    "/add",
    authenticationMiddleware,
    addCartValidator(),
    validatorMiddleware,
    AsyncHandler(addCartController),
);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update product quantity in the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               cartId:
 *                 type: integer
 *                 example: 5
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

router.put(
    "/update",
    authenticationMiddleware,
    updateCartValidator(),
    validatorMiddleware,
    AsyncHandler(updateCartController),
);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 3
 *               cartId:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       422:
 *         description: Recieved data is not valid
 *       401:
 *         description: Unauthorized
 */

router.delete(
    "/remove",
    authenticationMiddleware,
    removeProductFromCartValidator(),
    validatorMiddleware,
    AsyncHandler(removeProductFromCartController),
);

export default router;
