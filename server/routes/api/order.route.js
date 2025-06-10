import { Router } from "express";

import {
    FetchAllOrdersController,
    FetchOrderController,
    PlaceOrderController,
} from "../../controllers/api/order.controller.js";
import {
    fetchOrderValidator,
    FetchAllOrdersValidator,
    placeOrderValidator,
} from "../../validators/order.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.get(
    "/",
    authenticationMiddleware,
    FetchAllOrdersValidator(),
    validatorMiddleware,
    cacheMiddleware(
        (req) =>
            `orders:${req.user.id}:${req.query.cursor || 1}:${req.query.limit || 10}`,
    ),
    AsyncHandler(FetchAllOrdersController),
);
router.get(
    "/:id",
    fetchOrderValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `order:${req.params.id}`),
    AsyncHandler(FetchOrderController),
);
router.post(
    "/",
    authenticationMiddleware,
    placeOrderValidator(),
    validatorMiddleware,
    AsyncHandler(PlaceOrderController),
);

export default router;
