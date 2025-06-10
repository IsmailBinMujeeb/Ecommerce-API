import swagger from "swagger-jsdoc";

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
                url: process.env.SERVER_BASE_URL,
            },
        ],
    }
})