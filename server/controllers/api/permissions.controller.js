import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";

export const FetchModeratorPermissionsController = async (req, res) => {

    const { id } = req.params;

    if (!id, isNaN(id)) throw new ApiError(400, "invalid moderator id");

    const permissions = await prisma.permission.findUnique({
        where: {
            moderatorId: Number(id),
        }
    });

    if (!permissions) throw new ApiError(404, "permissions not found");

    return res.status(200).json(new ApiResponse(200, "fetched permission successfully", permissions));
}

export const UpdateModeratorPermissionsController = async (req, res) => {

    const { id } = req.params;
    const { permissions } = req.body;

    if (!id || isNaN(id) || typeof permissions !== "object") throw new ApiError(400, "invalid id or permissions");

    for (const [_, value] of Object.entries(permissions)) {
        if (typeof value !== "boolean") throw new ApiError(400, `invalid permission "${value}"`)
    }

    const isPermissionExist = await prisma.permission.findUnique({
        where:{
            moderatorId: Number(id),
        }
    });

    if (!isPermissionExist) throw new ApiError(404, "Permissions not found");

    const updatedPermissions = await prisma.permission.update({
        where: {
            moderatorId: Number(id)
        },
        data: {
            ...permissions
        }
    });

    if (!updatedPermissions) throw new ApiError(500, "permission update failed");

    return res.status(200).json(new ApiResponse(200, "permissions updated successfully", updatedPermissions))
}