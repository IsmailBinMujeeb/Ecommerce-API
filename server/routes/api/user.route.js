import { Router } from "express";

import { BanUserController, FetchAllUsersController, FetchAuthenticatedUserController, FetchUserByIdController, PromoteUserToModeratorController, DemoteModeratorToUser } from "../../controllers/api/user.controller.js";
import { DemoteModeratorToUserValidator, FetchUserByIdValidator, PromoteUserToModeratorValidator } from "../../validators/user.validator.js";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";
import cacheMiddleware from "../../middlewares/cache.middleware.js";

const router = Router();

router.get("/me", authenticationMiddleware, cacheMiddleware(req => `me:${req.user.id}`), FetchAuthenticatedUserController)
router.get("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), cacheMiddleware(`users`), AsyncHandler(FetchAllUsersController))
router.get("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), FetchUserByIdValidator(), validatorMiddleware, cacheMiddleware(req => `user:${req.params.id}`), AsyncHandler(FetchUserByIdController))
router.post("/:id/ban", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_ban_user), AsyncHandler(BanUserController))
router.post("/:id/promote", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), PromoteUserToModeratorValidator(), validatorMiddleware, AsyncHandler(PromoteUserToModeratorController))
router.post("/:id/demote", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), DemoteModeratorToUserValidator(), validatorMiddleware, AsyncHandler(DemoteModeratorToUser))

export default router;