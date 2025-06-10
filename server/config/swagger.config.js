import swagger from "swagger-jsdoc";
import env from "./env.js";

export default swagger({
    apis: ["./routes/api/*.js"], swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'GoShop API',
            version: '1.0.0',
            description: 'GoShop swagger UI APIs documentation.',
        },
        servers: [
            {
                url: env.SERVER_BASE_URL,
            },
        ],
    }
})