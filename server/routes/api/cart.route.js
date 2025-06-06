import { Router } from "express";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { addCartController, getUserCartContorller, removeProductFromCartController, updateCartController } from "../../controllers/api/cart.controller.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", authenticationMiddleware, AsyncHandlerUtils(getUserCartContorller));
router.post("/add", authenticationMiddleware, AsyncHandlerUtils(addCartController));
router.put("/update", authenticationMiddleware, AsyncHandlerUtils(updateCartController));
router.delete("/remove", authenticationMiddleware, AsyncHandlerUtils(removeProductFromCartController));

export default router;