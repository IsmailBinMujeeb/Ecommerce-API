import { Router } from "express";

import { FetchAllCategories, CreateCategory, DeleteCategory, FetchCategory, UpdateCategory } from "../../controllers/api/category.controller.js";
import { categoryIdParamValidator, FetchAllCategoriesValidator, createCategoryValidator, updateCategoryValidator, FetchCategoryValidator } from "../../validators/category.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.get("/", FetchAllCategoriesValidator(), validatorMiddleware, cacheMiddleware(req => `categories:${req.query.cursor || 1}:${req.query.limit || 10}`), AsyncHandler(FetchAllCategories));
router.get("/:id", FetchCategoryValidator(), validatorMiddleware, cacheMiddleware(req => `category:${req.params.id}`), AsyncHandler(FetchCategory));
router.post("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), createCategoryValidator(), validatorMiddleware, AsyncHandler(CreateCategory));
router.put("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), categoryIdParamValidator(), updateCategoryValidator(), validatorMiddleware, AsyncHandler(UpdateCategory));
router.delete("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), categoryIdParamValidator(), validatorMiddleware, AsyncHandler(DeleteCategory));

export default router;