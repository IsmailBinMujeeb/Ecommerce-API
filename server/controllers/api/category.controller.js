import prisma from "../../config/prisma.config.js"
import ApiError from "../../utils/ApiError.utils.js"
import ApiResponse from "../../utils/ApiResponse.utils.js"
import redis from "../../config/redis.config.js"
import { matchedData } from "express-validator"
import { deleteAllRedisKeys } from "../../utils/helper.utils.js"

export const FetchAllCategories = async (req, res) => {

    const query = matchedData(req, { locations: ["query"] });

    const { cursor, limit = 10 } = query;

    const categories = await prisma.category.findMany({
        take: limit,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor }
        }),
        where: {
            isDeleted: false
        },
        orderBy: {
            id: "asc"
        }
    });

    if (!categories.length) throw new ApiError(404, "categories not found");

    let nextCursor = categories.length === limit ? categories[categories.length - 1].id : null;

    return res.status(200).json(new ApiResponse(200, "Fetched all categories successfully", { categories, nextCursor }))
}

export const FetchCategory = async (req, res) => {

    const { id } = req.params;


    const category = await prisma.category.findFirst({
        where: {
            AND: {
                id,
                isDeleted: false
            }
        },
    });

    if (!category) throw new ApiError(404, "category not found");

    return res.status(200).json(new ApiResponse(200, "Fetched category successfully", category));
}
export const CreateCategory = async (req, res) => {

    const { name } = req.body;

    const isCategoryExistWithSameName = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive"
            }
        }
    });

    if (isCategoryExistWithSameName) throw new ApiError(409, "category already exist");

    const newCategory = await prisma.category.create({
        data: {
            name
        }
    });

    if (!newCategory) throw new ApiError(500, "category creation failed");

    await redis.del(`category:${newCategory.id}`)
    deleteAllRedisKeys("categories:*:*");

    return res.status(201).json(new ApiResponse(201, "category created successfully", newCategory));
}
export const UpdateCategory = async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    const isCategoryExist = await prisma.category.findFirst({
        where: {
            AND: {
                id,
                isDeleted: false
            }
        }
    });

    if (!isCategoryExist) throw new ApiError(404, "category not found");

    const isCategoryExistWithSameName = await prisma.category.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive"
            }
        }
    });

    if (isCategoryExistWithSameName) throw new ApiError(409, "category already exist with this name");

    const updateCategory = await prisma.category.update({
        where: {
            id
        },
        data: {
            name
        }
    });

    await redis.del(`category:${updateCategory.id}`)
    deleteAllRedisKeys("categories:*:*")

    await redis.setex(`category:${updateCategory.id}`, 300, JSON.stringify(updateCategory))

    return res.status(200).json(new ApiResponse(200, "cateogry updated successfully", updateCategory));
}
export const DeleteCategory = async (req, res) => {

    const { id } = req.params;

    const isCategoryExist = await prisma.category.findFirst({
        where: {
            AND: {
                id,
                isDeleted: false
            }

        }
    });

    if (!isCategoryExist) throw new ApiError(404, "Category not found");

    const deletedCategory = await prisma.category.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });

    await redis.del(`category:${deletedCategory.id}`);
    deleteAllRedisKeys("categories:*:*")

    return res.status(200).json(new ApiResponse(200, "category deleted successfully", deletedCategory));
}

