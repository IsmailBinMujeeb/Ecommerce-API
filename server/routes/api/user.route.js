import { Router } from "express";

import {BanUserController, FetchAllUsersController, FetchAuthenticatedUserController, FetchUserByIdController, PromoteUserToModeratorController, DemoteModeratorToUser} from "../../controllers/api/user.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import { MODERATOR_PERMISSIONS } from "../../constants.js";

const router = Router();

router.get("/me", authenticationMiddleware, FetchAuthenticatedUserController)
router.get("/", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), AsyncHandler(FetchAllUsersController) )
router.get("/:id", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_view_user_info), AsyncHandler(FetchUserByIdController))
router.post("/:id/ban", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_ban_user), AsyncHandler(BanUserController))
router.post("/:id/promote", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), AsyncHandler(PromoteUserToModeratorController))
router.post("/:id/demote", authenticationMiddleware, permissionsMiddleware(MODERATOR_PERMISSIONS.can_promote_user), AsyncHandler(DemoteModeratorToUser))

export default router;