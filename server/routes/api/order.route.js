import { Router } from "express";

import { FetchAllOrdersController, FetchOrderController, PlaceOrderController } from "../../controllers/api/order.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", authenticationMiddleware, AsyncHandler(FetchAllOrdersController));
router.get("/:id", AsyncHandler(FetchOrderController));
router.post("/", authenticationMiddleware, AsyncHandler(PlaceOrderController));

export default router;