import { Router } from "express";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { addCartController, getUserCartContorller, removeProductFromCartController, updateCartController } from "../../controllers/api/cart.controller.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", authenticationMiddleware, AsyncHandler(getUserCartContorller));
router.post("/add", authenticationMiddleware, AsyncHandler(addCartController));
router.put("/update", authenticationMiddleware, AsyncHandler(updateCartController));
router.delete("/remove", authenticationMiddleware, AsyncHandler(removeProductFromCartController));

export default router;