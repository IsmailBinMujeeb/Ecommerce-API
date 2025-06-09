import prisma from "../../config/prisma.config.js"
import redis from "../../config/redis.config.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import { matchedData } from "express-validator";
import { deleteAllRedisKeys } from "../../utils/helper.utils.js";

export const FetchAllProductsController = async (req, res) => {

    const query = matchedData(req, { locations: ["query"] });
    const { cursor, limit = 10 } = query;

    const products = await prisma.product.findMany({
        take: limit,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor }
        }),
        where: {
            isDeleted: false
        },
        include: {
            category: true,
        },
        orderBy: {
            id: "asc"
        }
    });

    if (!products.length) throw new ApiError(404, "products not found");

    const nextCursor = products.length === limit ? products[products.length - 1].id : null;

    return res.status(200).json(new ApiResponse(200, "fetched all producrs successfully", { products, nextCursor }));
}

export const FetchProductController = async (req, res) => {

    const { id } = req.params;

    const product = await prisma.product.findFirst({
        where: {
            AND: {
                id,
                isDeleted: false
            }
        },
        include: {
            category: true,
            reviews: true
        }
    });

    if (!product) throw new ApiError(404, "Product not found");

    return res.status(200).json(new ApiResponse(200, "fetched product successfully", product));
}

export const CreateProductController = async (req, res) => {

    const { product_name, product_description, product_offer, product_price, product_stock, categoryId } = req.body;

    const newProduct = await prisma.product.create({
        data: {
            product_name,
            product_offer,
            product_price,
            product_description,
            product_stock: product_stock,
            categoryId: categoryId
        }
    });

    if (!newProduct) throw new ApiError(500, "product creation failed");

    await redis.setex(`product:${newProduct.id}`, 300, JSON.stringify(newProduct));
    deleteAllRedisKeys(`products:*:*`)

    return res.status(201).json(new ApiResponse(201, "product created successfully", newProduct));
}

export const UpdateProductController = async (req, res) => {

    const { id } = req.params;
    const { product_name, product_description, product_offer, product_price } = req.body;

    const isProductExist = await prisma.product.findUnique({
        where: {
            AND: {
                id,
                isDeleted: false
            }
        }
    });

    if (!isProductExist) throw new ApiError(404, "product not found");

    const updatedProduct = await prisma.product.update({
        where: {
            id
        },
        data: {
            product_description,
            product_name,
            product_offer,
            product_price
        }
    });

    if (!updatedProduct) throw new ApiError(500, "product update failed");

    await redis.del(`product:${id}`);
    await redis.setex(`product:${id}`, 300, JSON.stringify(updatedProduct));
    deleteAllRedisKeys(`products:*:*`)

    return res.status(200).json(new ApiResponse(200, "product update successfully", updatedProduct));
}

export const DeleteProductController = async (req, res) => {

    const { id } = req.params;

    const isProductExist = await prisma.product.findFirst({
        where: {
            AND: {
                id,
                isDeleted: false
            }
        }
    });

    if (!isProductExist) throw new ApiError(404, "product not found");

    const deletedProduct = await prisma.product.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });

    if (!deletedProduct) throw new ApiError(500, "product deletion failed");

    await redis.del(`product:${id}`);
    deleteAllRedisKeys(`products:*:*`)

    return res.status(200).json(new ApiResponse(200, "product deleted successfully", deletedProduct))
}