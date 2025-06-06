import { Router } from "express";

import {BanUserController, FetchAllUsersController, FetchAuthenticatedUserController, FetchUserByIdController, PromoteUserToModeratorController, DemoteModeratorToUser} from "../../controllers/api/user.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandlerUtils from "../../utils/AsyncHandler.utils.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";

const router = Router();

router.get("/me", AsyncHandlerUtils(authenticationMiddleware), FetchAuthenticatedUserController)
router.get("/", AsyncHandlerUtils(authenticationMiddleware), permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), AsyncHandlerUtils(FetchAllUsersController) )
router.get("/:id", AsyncHandlerUtils(authenticationMiddleware), permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), AsyncHandlerUtils(FetchUserByIdController))
router.post("/:id/ban", AsyncHandlerUtils(authenticationMiddleware), permissionsMiddleware(MODERATOR_PERMISSIONS.can_ban_user), AsyncHandlerUtils(BanUserController))
router.post("/:id/promote", AsyncHandlerUtils(authenticationMiddleware), permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), AsyncHandlerUtils(PromoteUserToModeratorController))
router.post("/:id/demote", AsyncHandlerUtils(authenticationMiddleware), permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), AsyncHandlerUtils(DemoteModeratorToUser))

export default router;