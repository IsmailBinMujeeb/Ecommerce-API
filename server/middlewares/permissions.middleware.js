import ApiError from "../utils/ApiError.utils.js";
import AsyncHandlerUtils from "../utils/AsyncHandler.utils.js";

export default (permissionsToBeTrue) => {
    return AsyncHandlerUtils(async (req, res, next) => {
        const user = req.user;

        if (user.role == "USER") throw new ApiError(401, "unautherized user");
        else if (user.role == "ADMIN") return next();

        if (Array.isArray(permissionsToBeTrue)) {
            permissionsToBeTrue.map((item) => {
                if (user.permissions[item] !== true)
                    throw new ApiError(401, "unautherized user");
            });
            next();
        } else {
            if (user.permissions[permissionsToBeTrue] !== true)
                throw new ApiError(401, "unautherized user");
            next();
        }

        throw new ApiError(401, "unautherized user");
    });
};
