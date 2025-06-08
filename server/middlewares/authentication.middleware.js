import ApiError from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.config.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";
import redis from "../config/redis.config.js";

export default AsyncHandler(async (req, res, next) => {

    const incomming_access_token = req.cookies.access_token;

    if (!incomming_access_token) throw new ApiError(400, "missing access token");

    const decoded = jwt.verify(incomming_access_token, process.env.JWT_ACCESS_SECRET, (err, result) => {

        if (err) throw new ApiError(401, "Invalid access token");

        return result;
    });

    if (!decoded) throw new ApiError(401, "Invalid access token");

    const isUserBanned = await redis.get(`ban:${decoded.userId}`);
    if (isUserBanned) throw new ApiError(400, "user is banned");

    const user = await prisma.user.findFirst({
        where: {
            id: decoded.userId
        },
        select: {
            id: true,
            email: true,
            username: true,
            display_name: true,
            role: true,
            permissions: true
        },
    });

    if (!user) throw new ApiError(404, "User doesn't exist");

    req.user = user;
    next();
})