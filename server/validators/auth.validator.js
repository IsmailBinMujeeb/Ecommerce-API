import { body, param, cookie } from "express-validator";
import ApiError from "../utils/ApiError.utils.js";

export const UserRegisterValidator = () =>
    [
        body("username").trim().notEmpty().withMessage("username is required"),
        body("email").trim().notEmpty().withMessage("email is required").bail()
        .isEmail().withMessage("invalid email"),
        body("password").trim().notEmpty().withMessage("password is required"),
        body("display_name").trim().notEmpty().withMessage("display_name is required"),
    ]

export const UserLoginValidator = () =>
    [
        body("email").optional().isEmail().withMessage("invalid email"),
        body("username").optional(),
        body("password").trim().notEmpty().withMessage("password is required"),
        body().custom((body) => {
            if (!body.email && !body.username) throw new ApiError(400, "email or username is required");
            return true;
        })
    ]

export const UserLogoutValidator = () =>
    [
        cookie("access_token").trim().notEmpty().withMessage("access_token is missing")
    ]

export const emailVerificationValidator = () =>
    [
        param("token").trim().notEmpty().withMessage("token is required"),
    ]

export const refreshAccessTokenValidator = () =>
    [
        cookie("refresh_token").trim().notEmpty().withMessage("refresh_token is missing")
    ]

export const saveUserAddressValidator = () =>
    [
        body("line1").trim().notEmpty().withMessage("line1 is required"),
        body("line2").optional(),
        body("city").trim().notEmpty().withMessage("city is required"),
        body("state").trim().notEmpty().withMessage("state is required"),
        body("postal").trim().notEmpty().withMessage("postal code is required").isPostalCode("any").withMessage("invalid postal code"),
        body("country").trim().notEmpty().withMessage("country is required"),
    ]