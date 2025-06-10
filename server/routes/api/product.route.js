import { Router } from "express";

import {
    CreateProductController,
    DeleteProductController,
    FetchAllProductsController,
    FetchProductController,
    UpdateProductController,
} from "../../controllers/api/product.controller.js";
import {
    CreateProductValidator,
    DeleteProductValidator,
    FetchProductValidator,
    FetchAllProductsValidator,
    UpdateProductValidator,
} from "../../validators/product.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management for moderators and product discovery for users
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Fetch all products
 *     tags:
 *       - Product
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
 *         description: Number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: Fetched all products successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.get(
    "/",
    FetchAllProductsValidator(),
    authenticationMiddleware,
    cacheMiddleware(
        (req) => `products:${req.query.cursor || 0}:${req.query.limit || 10}`,
    ),
    AsyncHandler(FetchAllProductsController),
);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Fetch a single product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       422:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 */

router.get(
    "/:id",
    FetchProductValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `product:${req.params.id}`),
    AsyncHandler(FetchProductController),
);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_name
 *               - product_price
 *               - product_description
 *               - product_offer
 *               - product_stock
 *               - categoryId
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "T-shirt"
 *               product_description:
 *                 type: string
 *                 example: "Comfortable cotton shirt"
 *               product_price:
 *                 type: number
 *                 example: 19.99
 *               product_offer:
 *                 type: number
 *                 example: 20
 *               product_stock:
 *                 type: integer
 *                 example: 1000
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Product created successfully
 *       422:
 *         description: Recieved data is not valid
 *       401:
 *         description: Unauthorized
 */

router.post(
    "/",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product),
    CreateProductValidator(),
    validatorMiddleware,
    AsyncHandler(CreateProductController),
);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: "Updated T-shirt"
 *               product_price:
 *                 type: number
 *                 example: 24.99
 *               product_offer:
 *                 type: number
 *                 example: 25
 *               product_description:
 *                 type: string
 *                 example: "Now with more colors"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       422:
 *         description: Recieved data is not valid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

router.put(
    "/:id",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product),
    UpdateProductValidator(),
    validatorMiddleware,
    AsyncHandler(UpdateProductController),
);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Recieved data is not valid
 *       404:
 *         description: Product not found
 */

router.delete(
    "/:id",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product),
    DeleteProductValidator(),
    validatorMiddleware,
    AsyncHandler(DeleteProductController),
);

export default router;
