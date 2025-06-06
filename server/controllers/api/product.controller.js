import prisma from "../../config/prisma.config.js"
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";

export const FetchAllProductsController = async (req, res) => {

    const products = await prisma.product.findMany({
        where: {
            isDeleted: false
        },
        include: {
            category: true,
        }
    });

    return res.status(200).json(new ApiResponse(200, "fetched all producrs successfully", products));
}

export const FetchProductController = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) throw new ApiError(400, "invalid product id");

    const product = await prisma.product.findFirst({
        where: {
            AND: {
                id: Number(id),
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

    if (!product_name || !product_offer || !product_price || !product_stock || !categoryId) throw new ApiError(400, "missing product details");

    const newProduct = await prisma.product.create({
        data: {
            product_name,
            product_offer,
            product_price,
            product_description,
            product_stock: Number(product_stock),
            categoryId: Number(categoryId)
        }
    });

    if (!newProduct) throw new ApiError(500, "product creation failed");

    return res.status(201).json(new ApiResponse(201, "product created successfully", newProduct));
}

export const UpdateProductController = async (req, res) => {

    const { id } = req.params;
    const { product_name, product_description, product_offer, product_price } = req.body;

    if (!product_name || !product_description || !product_offer || !product_price) throw new ApiError(400, "missing product details");
    if (!id || isNaN(id)) throw new ApiError(400, "invalid product id");

    const isProductExist = await prisma.product.findUnique({
        where: {
            AND: {
                id: Number(id),
                isDeleted: false
            }
        }
    });

    if (!isProductExist) throw new ApiError(404, "product not found");

    const updatedProduct = await prisma.product.update({
        where: {
            id: Number(id)
        },
        data: {
            product_description,
            product_name,
            product_offer,
            product_price
        }
    });

    if (!updatedProduct) throw new ApiError(500, "product update failed");

    return res.status(200).json(new ApiResponse(200, "product update successfully", updatedProduct));
}

export const DeleteProductController = async (req, res) => {

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

    const deletedProduct = await prisma.product.update({
        where: {
            id: Number(id)
        },
        data: {
            isDeleted: true
        }
    });

    if (!deletedProduct) throw new ApiError(500, "product deletion failed");

    return res.status(200).json(new ApiResponse(200, "product deleted successfully", deletedProduct))
}