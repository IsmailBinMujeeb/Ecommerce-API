# Ecommerce-API

A RESTful API for an e-commerce application, built with Node.js and Express. This backend provides endpoints for managing products, users, orders, authentication, and more.

## Features

- User authentication and authorization (JWT-based)
- Product management (CRUD)
- Order management
- User management
- Secure password handling
- Payload validation
- Error handling and validation
- Modular route and controller structure
- Custome Errors and Response
- Caching & rate limiting
- Email Verification

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (with Prisma)
- MongoDB (with Mongoose)
- Redis (with ioRedis)
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- dotenv for environment variable management
- BullMQ for email verification queues

## Getting Started

### Prerequisites

1. Node.js (v14 or higher)
2. npm or yarn
3. PostgreSQL instance (local or cloud)
4. MongoDB instance (local or cloud)
5. Redis instance (local or cloud)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/IsmailBinMujeeb/Ecommerce-API.git
    cd Ecommerce-API/server
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```
3. Setup environment variables:

    - Create a .env file in the root of the server directory.
    - Add the following variables:
        ```env
        PORT=3000
        CLIENT_BASE_URL=
        SERVER_BASE_URL=

        JWT_ACCESS_SECRET=
        JWT_REFRESH_SECRET=
        ACCESS_TOKEN_EXPIRY=
        REFRESH_TOKEN_EXPIRY=

        MAILTRAP_SMTP_HOST=
        MAILTRAP_SMTP_USER=
        MAILTRAP_SMTP_PASS=
        MAILTRAP_SMTP_PORT=

        ADMIN_USERNAME=
        ADMIN_PASSWORD=
        ADMIN_DISPLAY_NAME=
        ADMIN_EMAIL=

        REDIS_URI=

        NODE_ENV=

        DATABASE_URL=
        ```

4. Start the development server:

    ```bash
    npm run dev
    ```
The server should now be running on `http://localhost:3000` or what ever port you set.


> Note: For full API documentation, see the /api/docs folder or refer to the source code.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

---