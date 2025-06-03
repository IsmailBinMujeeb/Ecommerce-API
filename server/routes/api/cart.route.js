import { Router } from "express";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { addCartController, getUserCartContorller, removeProductFromCartController, updateCartController } from "../../controllers/api/cart.controller.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";

const router = Router();

router.get("/", AsyncHandlerUtils(authenticationMiddleware), AsyncHandlerUtils(getUserCartContorller));
router.post("/add", AsyncHandlerUtils(authenticationMiddleware), AsyncHandlerUtils(addCartController));
router.put("/update", AsyncHandlerUtils(authenticationMiddleware), AsyncHandlerUtils(updateCartController));
router.delete("/remove", AsyncHandlerUtils(authenticationMiddleware), AsyncHandlerUtils(removeProductFromCartController));

export default router;