import { Router } from "express";

import { CreateProductController, DeleteProductController, FetchAllProductsController, FetchProductController, UpdateProductController } from "../../controllers/api/product.controller.js";
import { CreateProductValidator, DeleteProductValidator, FetchProductValidator, FetchAllProductsValidator, UpdateProductValidator } from "../../validators/product.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.get("/", FetchAllProductsValidator(), authenticationMiddleware, cacheMiddleware(req => `products:${req.query.cursor || 0}:${req.query.limit || 10}`), AsyncHandler(FetchAllProductsController));
router.get("/:id", FetchProductValidator(), validatorMiddleware, cacheMiddleware(req => `product:${req.params.id}`), AsyncHandler(FetchProductController));
router.post("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), CreateProductValidator(), validatorMiddleware, AsyncHandler(CreateProductController));
router.put("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), UpdateProductValidator(), validatorMiddleware, AsyncHandler(UpdateProductController));
router.delete("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_perform_crud_on_product), DeleteProductValidator(), validatorMiddleware, AsyncHandler(DeleteProductController));

export default router;