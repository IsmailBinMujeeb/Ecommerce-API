import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

import userRouter from "./routes/api/user.route.js";
import cartRouter from "./routes/api/cart.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

export default app;