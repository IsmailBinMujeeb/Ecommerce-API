import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import { UserRole } from "@prisma/client";
import redis from "../../config/redis.config.js";
import { matchedData } from "express-validator";
import { deleteAllRedisKeys } from "../../utils/helper.utils.js";

export const FetchAuthenticatedUserController = async (req, res) => {
    const id = req.user.id;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },

        include: {
            address: true,
            cart: true,
            orders: true,
            permissions: true,
            reviews: true,
        },
    });

    if (!user) throw new ApiError(404, "user not found");

    const isUserBanned = await redis.get(`ban:${id}`);

    return res
        .status(200)
        .json(
            ApiResponse.UserResponse(200, "fetched user data successfully", {
                ...user,
                isUserBanned: Boolean(isUserBanned),
            }),
        );
};

export const FetchAllUsersController = async (req, res) => {
    const query = matchedData(req, { locations: ["query"] });
    const { cursor, limit = 10 } = query;

    const users = await prisma.user.findMany({
        take: limit,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor },
        }),
        orderBy: {
            id: "asc",
        },
    });

    if (!users.length) throw new ApiError(404, "users not found");

    const bannedKeys = users.map((user) => `ban:${user.id}`);
    const bannedStatuses = await redis.mget(bannedKeys);

    const usersWithIsBannedField = users.map((user, index) => ({
        ...user,
        isBanned: bannedStatuses[index] !== null,
    }));

    const nextCursor =
        users.length === limit ? users[users.length - 1].id : null;

    return res
        .status(200)
        .json(
            ApiResponse.UserResponse(200, "fetched all users successfully", {
                users: usersWithIsBannedField,
                nextCursor,
            }),
        );
};

export const FetchUserByIdController = async (req, res) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) throw new ApiError(404, "user not found");

    return res
        .status(200)
        .json(ApiResponse.UserResponse(200, "fetched user successfully", user));
};

export const BanUserController = async (req, res) => {
    const { id } = req.params;
    const { ttb = 34560 } = req.query;

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (!isUserExist) throw new ApiError(404, "user not found");

    const isUserBanned = await redis.get(`ban:${id}`);

    if (isUserBanned) throw new ApiError(409, "user already banned");

    await redis.setex(`ban:${id}`, 90, id);

    await redis.del(`me:${id}`);
    await redis.del(`user:${id}`);
    deleteAllRedisKeys(`users:*:*`);

    return res
        .status(200)
        .json(new ApiResponse(200, "user banned successfully", { id, ttb }));
};

export const PromoteUserToModeratorController = async (req, res) => {
    const { permissions } = req.body;
    const { id } = req.params;

    for (const [_, value] of Object.entries(permissions)) {
        if (typeof value !== "boolean")
            throw new ApiError(400, `invalid permission "${value}"`);
    }

    const isUserExistOrAlreadyPromoted = await prisma.user.findFirst({
        where: {
            AND: {
                id,
                role: UserRole.USER,
            },
        },
    });

    if (!isUserExistOrAlreadyPromoted)
        throw new ApiError(400, "user not exist or already promoted");

    const user = await prisma.user.update({
        where: {
            id,
        },

        data: {
            role: UserRole.MODE,
            permissions: {
                connectOrCreate: {
                    create: {
                        ...permissions,
                    },
                    where: {
                        moderatorId: id,
                    },
                },
            },
        },
    });

    if (!user) throw new ApiError(500, "user promotion failed");

    await redis.del(`me:${user.id}`);
    await redis.del(`user:${user.id}`);
    deleteAllRedisKeys(`users:*:*`);

    return res
        .status(200)
        .json(
            ApiResponse.UserResponse(200, "user promoted successfully", user),
        );
};

export const DemoteModeratorToUser = async (req, res) => {
    const { id } = req.params;

    const isUserExistOrAlreadyANormalUser = await prisma.user.findFirst({
        where: {
            AND: {
                id,
                role: UserRole.MODE,
            },
        },
    });

    if (!isUserExistOrAlreadyANormalUser)
        throw new ApiError(409, "user already exist or not a moderator");

    const user = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role: UserRole.USER,
            permissions: undefined,
        },
    });

    if (!user) throw new ApiError(500, "user demotion failed");

    await redis.del(`me:${user.id}`);
    await redis.del(`user:${user.id}`);
    deleteAllRedisKeys(`users:*:*`);

    return res
        .status(200)
        .json(ApiResponse.UserResponse(200, "user demoted successfully", user));
};
