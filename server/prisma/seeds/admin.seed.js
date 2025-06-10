import prisma from "../../config/prisma.config.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

(async function () {
    console.log(await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));
    await prisma.user.create({
        data: {
            username: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            display_name: process.env.ADMIN_DISPLAY_NAME,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
            is_email_verified: true,
            role: "ADMIN",
        },
    });
})();
