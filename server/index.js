import app from "./server.js";
import prisma from "./config/prisma.config.js";
import redis from "./config/redis.config.js";

; (
    function () {
        redis.once("ready", async () => {
            const PORT = app.get("port");

            await prisma.$connect()
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        });
    }
)();
