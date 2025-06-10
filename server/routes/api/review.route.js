import { Router } from "express";
import {
    CreateReviewController,
    FetchAllReviewsForAProductController,
} from "../../controllers/api/review.controller.js";
import {
    CreateReviewValidator,
    FetchAllReviewsForProductValidator,
} from "../../validators/review.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.post(
    "/",
    authenticationMiddleware,
    CreateReviewValidator(),
    validatorMiddleware,
    AsyncHandler(CreateReviewController),
);
router.get(
    "/:id",
    FetchAllReviewsForProductValidator(),
    validatorMiddleware,
    cacheMiddleware((req) => `reviews:${req.params.id}`),
    AsyncHandler(FetchAllReviewsForAProductController),
);

export default router;
