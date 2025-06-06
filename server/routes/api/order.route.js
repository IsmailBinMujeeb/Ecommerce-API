import { Router } from "express";

import { FetchAllOrdersController, FetchOrderController, PlaceOrderController } from "../../controllers/api/order.controller.js";
import { fetchOrderValidator, placeOrderValidator } from "../../validators/order.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", authenticationMiddleware, AsyncHandler(FetchAllOrdersController));
router.get("/:id", fetchOrderValidator(), validatorMiddleware, AsyncHandler(FetchOrderController));
router.post("/", authenticationMiddleware, placeOrderValidator(), validatorMiddleware, AsyncHandler(PlaceOrderController));

export default router;