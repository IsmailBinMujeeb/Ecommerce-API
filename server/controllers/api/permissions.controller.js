import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import redis from "../../config/redis.config.js";

export const FetchModeratorPermissionsController = async (req, res) => {

    const { id } = req.params;

    const permissions = await prisma.permission.findUnique({
        where: {
            moderatorId: id,
        }
    });

    if (!permissions) throw new ApiError(404, "permissions not found");

    return res.status(200).json(new ApiResponse(200, "fetched permission successfully", permissions));
}

export const UpdateModeratorPermissionsController = async (req, res) => {

    const { id } = req.params;
    const { permissions } = req.body;

    for (const [_, value] of Object.entries(permissions)) {
        if (typeof value !== "boolean") throw new ApiError(400, `invalid permission "${value}"`)
    }

    const isPermissionExist = await prisma.permission.findUnique({
        where:{
            moderatorId: id,
        }
    });

    if (!isPermissionExist) throw new ApiError(404, "Permissions not found");

    const updatedPermissions = await prisma.permission.update({
        where: {
            moderatorId: id
        },
        data: {
            ...permissions
        }
    });

    if (!updatedPermissions) throw new ApiError(500, "permission update failed");

    await redis.del(`permission:${updatedPermissions.moderatorId}`);
    await redis.setex(`permission:${updatedPermissions.moderatorId}`, 300, JSON.stringify(updatedPermissions));

    return res.status(200).json(new ApiResponse(200, "permissions updated successfully", updatedPermissions))
}