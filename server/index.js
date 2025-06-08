import app from "./server.js";
import redis from "./config/redis.config.js";

;(
    function () {

        redis.once("ready", () => {
            const PORT = app.get('port');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        });
    }
)();