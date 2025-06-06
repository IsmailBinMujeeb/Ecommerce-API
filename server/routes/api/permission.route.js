import { Router } from "express";
import AsyncHandler from "../../utils/AsyncHandler.utils.js";
import { FetchModeratorPermissionsController, UpdateModeratorPermissionsController } from "../../controllers/api/permissions.controller.js";
import authenticationMiddleware from "../../middlewares/authentication.middleware.js";
import { UserRole } from "@prisma/client";
import permissionsMiddleware from "../../middlewares/permissions.middleware.js";
import ApiError from "../../utils/ApiError.utils.js";

const router = Router();

router.get(
    "/:id", // Endpoint /api/permission/:id
    authenticationMiddleware, // Middleware to authonticate user
    AsyncHandler(async (req, res, next) => { // Middleware to authorize user

        const user = req.user;

        if (user.role == UserRole.ADMIN) return next();
        if (user.id == req.params?.id) return next();

        throw new ApiError(401, "unauthorized user");
    }),
    AsyncHandler(FetchModeratorPermissionsController), // Controller
);
router.post("/:id", authenticationMiddleware, AsyncHandler(permissionsMiddleware()), AsyncHandler(UpdateModeratorPermissionsController))

export default router;