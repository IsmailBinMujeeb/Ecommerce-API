import { Router } from "express";

import { FetchAllCategories, CreateCategory, DeleteCategory, FetchCategory, UpdateCategory } from "../../controllers/api/category.controller.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", AsyncHandlerUtils(FetchAllCategories));
router.get("/:id", AsyncHandlerUtils(FetchCategory));
router.post("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), AsyncHandlerUtils(CreateCategory));
router.put("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), AsyncHandlerUtils(UpdateCategory));
router.delete("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_category), AsyncHandlerUtils(DeleteCategory));

export default router;