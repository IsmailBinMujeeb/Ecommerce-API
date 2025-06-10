import { Router } from "express";

import {
    FetchAllCategories,
    CreateCategory,
    DeleteCategory,
    FetchCategory,
    UpdateCategory,
} from "../../controllers/api/category.controller.js";
import {
    categoryIdParamValidator,
    FetchAllCategoriesValidator,
    createCategoryValidator,
    updateCategoryValidator,
    FetchCategoryValidator,
} from "../../validators/category.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management and browsing
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Fetch all categories
 *     tags:
 *       - Category
 *     parameters:
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *         description: Cursor for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to return (default is 10)
 *     responses:
 *       200:
 *         description: Fetched categories
 *       400:
 *         description: Invalid query parameters
 */

router.get(
    "/",
    FetchAllCategoriesValidator(),
    validatorMiddleware,
    cacheMiddleware(
        (req) => `categories:${req.query.cursor || 1}:${req.query.limit || 10}`,
    ),
    AsyncHandler(FetchAllCategories),
);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Fetch a single category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Fetched Category
 *       404:
 *         description: Category not found
 */

router.get(
    "/:id",
    FetchCategoryValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `category:${req.params.id}`),
    AsyncHandler(FetchCategory),
);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *       422:
 *         description: Recieved data is not valid
 */

router.post(
    "/",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category),
    createCategoryValidator(),
    validatorMiddleware,
    AsyncHandler(CreateCategory),
);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               productId:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */

router.put(
    "/:id",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category),
    categoryIdParamValidator(),
    updateCategoryValidator(),
    validatorMiddleware,
    AsyncHandler(UpdateCategory),
);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       422:
 *         description: Recieved data is not valid
 */

router.delete(
    "/:id",
    authenticationMiddleware,
    permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category),
    categoryIdParamValidator(),
    validatorMiddleware,
    AsyncHandler(DeleteCategory),
);

export default router;
