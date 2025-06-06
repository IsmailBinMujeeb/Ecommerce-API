import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";

export const CreateReviewController = async (req, res) => {

    const user = req.user;
    const { productId, comment, rating } = req.body;

    if (!productId || !rating) throw new ApiError(400, "Missing credentials");
    if (isNaN(productId) || isNaN(rating) || rating > 5 || rating < 1) throw new ApiError(400, "Invalid credentials");

    const isProductExist = await prisma.product.findFirst({
        where: {
            AND: {
                id: productId,
                isDeleted: false
            }
        }
    });

    if (!isProductExist) throw new ApiError(404, "product not found");

    const isReviewExist = await prisma.review.findUnique({
        where: {
            userId_productId: {
                userId: user.id,
                productId
            }
        }
    });

    if (isReviewExist) throw new ApiError(409, "review already exist");

    const newReveiw = await prisma.review.create({
        data: {
            userId: user.id,
            rating,
            comment,
            productId
        }
    });

    if (!newReveiw) throw new ApiError(500, "review creation failed");

    return res.status(201).json(new ApiResponse(201, "review created successfully", newReveiw));

}

export const FetchAllReviewsForAProductController = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) throw new ApiError(400, "invalid product id");

    const isProductExist = await prisma.product.findFirst({
        where: {
            AND: {
                id: Number(id),
                isDeleted: false
            }
        }
    });

    if (!isProductExist) throw new ApiError(404, "product not found");

    const reviews = await prisma.review.findMany({
        where: {
            productId: Number(id),
        }
    });

    return res.status(200).json(new ApiResponse(200, "Fetched all reviews successfully", reviews));
}