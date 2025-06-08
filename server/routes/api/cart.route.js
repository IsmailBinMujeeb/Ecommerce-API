import { Router } from "express";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { addCartController, getUserCartContorller, removeProductFromCartController, updateCartController } from "../../controllers/api/cart.controller.js";
import { addCartValidator, removeProductFromCartValidator, updateCartValidator } from "../../validators/cart.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.get("/", authenticationMiddleware, cacheMiddleware(req => `cart:${req.user.id}`), AsyncHandler(getUserCartContorller));
router.post("/add", authenticationMiddleware, addCartValidator(), validatorMiddleware, AsyncHandler(addCartController));
router.put("/update", authenticationMiddleware, updateCartValidator(), validatorMiddleware, AsyncHandler(updateCartController));
router.delete("/remove", authenticationMiddleware, removeProductFromCartValidator(), validatorMiddleware, AsyncHandler(removeProductFromCartController));

export default router;