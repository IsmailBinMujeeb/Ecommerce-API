import prisma from "../../config/prisma.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";

export const getUserCartContorller = async (req, res) => {

    const userId = req.user.id;

    const cart = await prisma.cart.findUnique({
        where: {
            userId
        },
        include: {
            items: {
                include: {
                    product: true,
                }
            }
        }
    });

    if (!cart) throw new ApiError(404, "Cart not found");

    return res.status(200).json(new ApiResponse(200, "cart fetched successfully", cart));
}

export const addCartController = async (req, res) => {

    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) throw new ApiError(400, "missing product id")

    const cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    });

    if (!cart) throw new ApiError(404, "cart not found");

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });

    if (!product) throw new ApiError(404, "product not found");

    const newCardItem = await prisma.cartProduct.create({
        data: {
            cartId: cart.id,
            productId: product.id,
            quantity,
        }
    });

    if (!newCardItem) throw new ApiError(500, "add product into card failed");

    res.status(200).json(new ApiResponse(200, "item added to cart"));
}

export const updateCartController = async (req, res) => {

    const { cartId, productId, quantity } = req.body;

    if (!cartId || !productId || !quantity) throw new ApiError(400, "Missing cart or product id");

    const item = await prisma.cartProduct.update({
        where: {
            AND: {
                cartId,
                productId
            }
        },
        data: {
            quantity
        }
    });

    if (!item) throw new ApiError(500, "updation failed for item");

    return res.status(200).json(new ApiResponse(200, "quantity updated", { quantity }));
}

export const removeProductFromCartController = async (req, res) => {

    const { cartId, productId } = req.body;

    const item = await prisma.cartProduct.delete({
        where: {
            cartId_productId: {
                cartId,
                productId
            }
        }
    });

    if (!item) throw new ApiError(404, "item not found");

    return res.status(200).json(new ApiResponse(200, "item removed from cart", item))
}