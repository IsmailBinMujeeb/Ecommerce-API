import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swagger from "./config/swagger.config.js";
import env from "./config/env.js";

import authRouter from "./routes/api/auth.route.js";
import userRouter from "./routes/api/user.route.js";
import cartRouter from "./routes/api/cart.route.js";
import productRouter from "./routes/api/product.route.js";
import categoryRouter from "./routes/api/category.route.js";
import orderRouter from "./routes/api/order.route.js";
import reviewRouter from "./routes/api/review.route.js";
import permissionsRouter from "./routes/api/permission.route.js";

const app = express();
const PORT = env.PORT || 3000;

app.set("port", PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/permission", permissionsRouter);

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swagger, { customSiteTitle: "GoShop APIs", }))

export default app;
