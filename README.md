# Express Mongoose Boilerplate

A production-ready Node.js backend boilerplate using Express and Mongoose with a modular service-oriented architecture (SOA).

## Features

- **Clean Architecture**: Controller → Service → Repository pattern with clear separation of concerns
- **Modular Structure**: Organized by feature/module (user, auth, etc.)
- **Error Handling**: Centralized custom error handling with ApiError class
- **Config Management**: Environment-based configuration with dotenv
- **Authentication**: JWT-based auth with access/refresh tokens and token rotation
- **API Formatting**: Consistent response format with ApiResponse wrapper
- **Validation**: Request validation with Joi
- **Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest setup with supertest and mongodb-memory-server
- **Error Handling**: Async error handling with catchAsync utility
- **API Versioning**: Routes organized under /api/v1/
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston logger integration

## Project Structure

```
src/
├── config/             # App configuration files
├── core/               # Core modules like error handling, response formatting
├── middlewares/        # Custom middleware functions
├── modules/            # Feature modules (user, auth, etc.)
│   ├── user/           # User module
│   │   ├── controller/ # User controllers
│   │   ├── service/    # User services
│   │   ├── model/      # User Mongoose models
│   │   ├── repository/ # User data repositories
│   │   ├── validation/ # User input validation
│   │   └── routes/     # User routes
│   └── auth/           # Auth module with similar structure
├── utils/              # Utility functions
└── server.js           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## Testing

```
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Linting and Formatting

```
# Lint code
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

## License

MIT
