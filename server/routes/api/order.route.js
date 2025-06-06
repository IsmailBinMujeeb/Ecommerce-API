import { Router } from "express";

import { FetchAllOrdersController, FetchOrderController, PlaceOrderController } from "../../controllers/api/order.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", authenticationMiddleware, AsyncHandlerUtils(FetchAllOrdersController));
router.get("/:id", AsyncHandlerUtils(FetchOrderController));
router.post("/", authenticationMiddleware, AsyncHandlerUtils(PlaceOrderController));

export default router;