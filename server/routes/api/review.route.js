import { Router } from "express";
import { CreateReviewController, FetchAllReviewsForAProductController } from "../../controllers/api/review.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.post("/", authenticationMiddleware, AsyncHandlerUtils(CreateReviewController));
router.get("/:id", AsyncHandlerUtils(FetchAllReviewsForAProductController));

export default router;