import ApiResponse from "./ApiResponse.utils.js";
import env from "../config/env.js";

export default (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        if (env.NODE_ENV !== "production") console.error(error);
        return res
            .status(error.statusCode || 500)
            .json(
                new ApiResponse(
                    error.statusCode || 500,
                    error.message || "Internal Server Error",
                    [],
                    error.errors,
                ),
            );
    }
};
