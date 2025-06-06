import { Router } from "express";

import { CreateProductController, DeleteProductController, FetchAllProductsController, FetchProductController, UpdateProductController } from "../../controllers/api/product.controller.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";

const router = Router();

router.get("/", AsyncHandler(FetchAllProductsController));
router.get("/:id", AsyncHandler(FetchProductController));
router.post("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), AsyncHandler(CreateProductController));
router.put("/:id",  authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), AsyncHandler(UpdateProductController));
router.delete("/:id",  authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), AsyncHandler(DeleteProductController));

export default router;