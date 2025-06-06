import prisma from "../../config/prisma.config.js"
import ApiError from "../../utils/ApiError.utils.js"
import ApiResponse from "../../utils/ApiResponse.utils.js"

export const FetchAllCategories = async (req, res) => {

    const categories = await prisma.category.findMany({
        where: {
            isDeleted: false
        }
    })

    return res.status(200).json(new ApiResponse(200, "Fetched all categories successfully", categories))
}

export const FetchCategory = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) throw new ApiError(400, "invalid category id");

    const category = await prisma.category.findUnique({
        where: {
            AND: {
                id: Number(id),
                isDeleted: false
            }
        },
    });

    if (!category) throw new ApiError(404, "category not found");

    return res.status(200).json(new ApiResponse(200, "Fetched category successfully", category));
}
export const CreateCategory = async (req, res) => {

    const { name } = req.body;

    if (!name) throw new ApiError(400, "missing category name");

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

    return res.status(201).json(new ApiResponse(201, "category created successfully", newCategory));
}
export const UpdateCategory = async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    if (!id || isNaN(id)) throw new ApiError(400, "invalid category id");

    if (!name) throw new ApiError(400, "category updated name missing");

    const isCategoryExist = await prisma.category.findFirst({
        where: {
            AND: {
                id: Number(id),
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
            id: Number(id),
        },
        data: {
            name
        }
    });

    return res.status(200).json(new ApiResponse(200, "cateogry updated successfully", updateCategory));
}
export const DeleteCategory = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(id)) throw new ApiError(400, "invalid category id");

    const isCategoryExist = await prisma.category.findFirst({
        where: {
            AND: {
                id: Number(id),
                isDeleted: false
            }

        }
    });

    if (!isCategoryExist) throw new ApiError(404, "Category not found");

    const deletedCategory = await prisma.category.update({
        where: {
            id: Number(id)
        },
        data: {
            isDeleted: true
        }
    });

    return res.status(200).json(new ApiResponse(200, "category deleted successfully", deletedCategory));
}

