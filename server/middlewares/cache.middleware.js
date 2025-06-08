import redis from "../config/redis.config.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";

export default (keyBuilder, ttl = 300) => AsyncHandler(async (req, res, next) => {

    const key = typeof keyBuilder == "function" ? keyBuilder(req) : keyBuilder;

    if (!key) return next();

    const cached = await redis.get(key);

    if (cached) return res.status(200).json(new ApiResponse(200, "data fetched from cached successfully", JSON.parse(cached)));

    const resJson = res.json.bind(res);

    res.json = async (resData) => {
        const data = resData?.data || resData;
        await redis.setex(key, ttl, JSON.stringify(data));
        return resJson(resData);
    }

    return next();

})