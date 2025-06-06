import { Router } from "express";
import { CreateReviewController, FetchAllReviewsForAProductController } from "../../controllers/api/review.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.post("/", authenticationMiddleware, AsyncHandler(CreateReviewController));
router.get("/:id", AsyncHandler(FetchAllReviewsForAProductController));

export default router;