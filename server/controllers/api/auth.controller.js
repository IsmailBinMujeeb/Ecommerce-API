import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import bcrypt from "bcrypt";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import { sendEmail, emailVerificationMailgenContent } from "../../utils/Mail.utils.js";
import { generateTemporaryTokens } from "../../utils/helper.utils.js"
import jwt from "jsonwebtoken";
import crypto from "crypto"

export const UserRegisterController = async (req, res) => {

    const { username, email, password, display_name } = req.body;

    if (!username || !email || !password || !display_name) throw new ApiError(400, "missing credentials");

    const isUserExist = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    })

    if (isUserExist) throw new ApiError(401, "user already exists");

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: await bcrypt.hash(password, 10),
            display_name
        }
    });

    if (!newUser) throw new ApiError(500, "failed to create user");

    const { unhashedToken, hashedToken, tokenExpiry } = generateTemporaryTokens();

    sendEmail(newUser.email, "Welcome to GoShop", emailVerificationMailgenContent(newUser.username, `${process.env.CLIENT_BASE_URL}/api/user/verify-email/${unhashedToken}`));

    const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: newUser.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    await prisma.user.update({
        where: {
            id: newUser.id
        },
        data: {
            refresh_token: refreshToken,
            email_verification_token: hashedToken,
            email_verification_token_expiry: new Date(tokenExpiry)
        }
    });

    await prisma.cart.create({
        data: {
            userId: newUser.id
        }
    });

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15 // 15 minutes
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });

    return res.status(201).json(ApiResponse.UserResponse(201, "user created successfully", newUser));

}

export const UserLoginController = async (req, res) => {

    const { email, username, password } = req.body;
    if ((!email && !username) || !password) throw new ApiError(400, "missing credentials");

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (!user) throw new ApiError(404, "user not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new ApiError(401, "invalid password");

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: refreshToken
        }
    })

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15 // 15 minutes
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });

    return res.status(200).json(ApiResponse.UserResponse(200, "user logged in successfully", user));
}

export const UserLogoutController = async (req, res) => {

    const incommingAccessToken = req.cookies.access_token;

    const access_token = jwt.verify(incommingAccessToken, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            throw new ApiError(401, "invalid access token");
        }
        return decoded;
    });

    if (!access_token) throw new ApiError(401, "invalid access token");

    const user = await prisma.user.findUnique({
        where: {
            id: access_token.userId
        }
    });

    if (!user) throw new ApiError(404, "user not found");

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refresh_token: null
        }
    });
    return res.status(200).json(ApiResponse.UserResponse(200, "user logged out successfully"));
}

export const getLoginUserController = async (req, res) => {

    const id = req.user.id;

    const user = await prisma.user.findFirst({
        where: {
            id
        },
        include: {
            address: true,
        }
    });

    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(ApiResponse.UserResponse(200, "User fetched successfully", user));
}

export const emailVerificationController = async (req, res) => {

    const unhashedToken = req.params.token;

    if (!unhashedToken) throw new ApiError(400, "missing token");

    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            email_verification_token: hashedToken,
            email_verification_token_expiry: {
                gte: new Date(Date.now())
            }
        }
    });

    if (!user) throw new ApiError(404, "user not found or token expired");

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            is_email_verified: true,
            email_verification_token: null,
            email_verification_token_expiry: null
        }
    });

    return res.status(200).json(ApiResponse.UserResponse(200, "email verified successfully", updatedUser));

}

export const refreshAccessToken = async (req, res) => {

    const incomming_refresh_token = req.cookies?.refresh_token;

    if (!incomming_refresh_token) throw new ApiError(401, "unautherized request");

    const decoded = jwt.verify(incomming_refresh_token, process.env.JWT_REFRESH_SECRET, (err, result) => {
        
        if (err) throw new ApiError(401, "refresh token expired or used");
        return result;     
    });

    const user = await prisma.user.findFirst({
        where: {
            id: decoded.userId
        },
        select: {
            id: true,
            refresh_token: true
        }
    });

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (user.refresh_token != incomming_refresh_token) throw new ApiError(401, "Invalid refresh token");

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: refreshToken,
        }
    });

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15 // 15 minutes
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    });

    return res.status(200).json(new ApiResponse(200, "tokens regenerated successfully", { access_token: accessToken, refreshAccessToken: refreshToken }));
}

export const saveUserAddressController = async (req, res) => {

    const { line1, line2, city, state, postal, country } = req.body;
    const userId = req.user.id;
    
    if (!line1 || !city || !state || !postal || !country) throw new ApiError(400, "Missing credentials");

    const newAddress = await prisma.address.create({
        data: {
            line1,
            line2,
            state,
            city,
            country,
            postal,
            userId
        }
    });

    if (!newAddress) throw new ApiError(500, "address creation failed");

    return res.status(201).json(new ApiResponse(201, "address created", newAddress));
}

export const getUserAddressController = async (req, res) => {

    const userId = req.user.id;

    const address = await prisma.address.findFirst({
        where: {
            userId
        }
    });

    if (!address) throw new ApiError(404, "address not found");

    return res.status(200).json(new ApiResponse(200, "Address fetched successfuly", address));
}