import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";

export default AsyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors.array().map((e) => extractedErrors.push({ [e.path]: e.msg }));

    throw new ApiError(422, "Recieved data is not valid", extractedErrors);
});