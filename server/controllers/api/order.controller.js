import prisma from "../../config/prisma.config.js";
import { PaymentMethod, PaymentStatus, OrderStatus } from "@prisma/client"
import { VALID_PAYMENT_METHODS } from "../../constants.js";
import ApiError from "../../utils/ApiError.utils.js";
import ApiResponse from "../../utils/ApiResponse.utils.js";
import redis from "../../config/redis.config.js";
import { deleteAllRedisKeys } from "../../utils/helper.utils.js";
import { matchedData } from "express-validator";

export const FetchAllOrdersController = async (req, res) => {

    const user = req.user;
    const query = matchedData(req, { locations: ["query"] });

    const { cursor, limit = 10 } = query;

    const orders = await prisma.order.findMany({
        take: limit,
        ...(cursor && {
            skip: cursor === 1 ? 0 : 1,
            cursor: { id: cursor }
        }),
        where: {
            userId: user.id,
        },
        include: {
            items: true,
            payment: true
        },
        orderBy: {
            id: "asc"
        }
    });

    if (!orders.length) throw new ApiError(404, "orders not found");

    let nextCursor = orders.length === limit ? orders[orders.length - 1].id : null;

    return res.status(200).json(new ApiResponse(200, "fetched all orders successfully", { orders, nextCursor }))
}

export const FetchOrderController = async (req, res) => {

    const { id } = req.params;

    const order = await prisma.order.findUnique({
        where: {
            id
        },

        include: {
            items: true,
            payment: true,
        }
    });

    if (!order) throw new ApiError(404, "order not found");

    return res.status(200).json(new ApiResponse(200, "fetcehd order successfully", order));
}

export const PlaceOrderController = async (req, res) => {

    const user = req.user;

    const { items, payment_method } = req.body;

    // Collect all product ids and check if they exist
    const productIds = items.map(item => item.productId);
    const dbProducts = await prisma.product.findMany({
        where: {
            AND: {
                id: { in: productIds },
                isDeleted: false
            },
        }
    });
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    const orderItems = [];
    let total = 0;

    for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product || product.product_stock < item.quantity)
            throw new ApiError(409, `Insufficient stock for product id ${product?.id}`);

        const discount = 1 - (product.product_offer / 100);
        total += (product.product_price * discount) * item.quantity;

        orderItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.product_price
        });
    }

    const [newOrder] = await prisma.$transaction([
        prisma.order.create({
            data: {
                total,
                status: OrderStatus.PENDING,
                userId: user.id,
                items: { create: orderItems },
                payment: {
                    create: {
                        amount: total,
                        method: payment_method,
                        status: PaymentStatus.INITIATED
                    }
                }
            },
            include: {
                items: true,
                payment: true
            }
        }),

        ...orderItems.map(item =>
            prisma.product.update({
                where: { id: item.productId, isDeleted: false },
                data: {
                    product_stock: { decrement: item.quantity }
                }
            })
        )
    ]);

    deleteAllRedisKeys(`orders:${user.id}:*:*`);

    await redis.setex(`order:${newOrder.id}`, 300, JSON.stringify(newOrder))

    return res.status(200).json(new ApiResponse(200, "order placed successfully", newOrder));
}