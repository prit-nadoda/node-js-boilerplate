# Express Mongoose Boilerplate: AI Development Guide

This guide provides instructions for AI code assistants working with this Express Mongoose Boilerplate.

## Project Structure Overview

```
/
├── src/
│   ├── config/               # Configuration files
│   ├── core/                 # Core functionality
│   ├── docs/                 # API documentation
│   ├── logs/                 # Log files
│   ├── middlewares/          # Global middleware
│   ├── modules/              # Feature modules
│   │   ├── user/             # User module
│   │   ├── auth/             # Auth module
│   │   └── [module-name]/    # Other modules
│   ├── scripts/              # Utility scripts
│   ├── utils/                # Utility functions
│   ├── routes/               # API routes index
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── setup.js              # Test setup
├── .env.example              # Environment variables example
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── jest.config.js            # Jest configuration
└── package.json              # Project dependencies
```

## Architecture & Structure

### Modular Structure
- **Rule**: Organize code by feature/module
- **Location**: Each module under `src/modules/[module-name]/`
- **Implementation**:
  - Create subdirectories for controllers, services, repositories, models, validations, and routes
  - Never mix concerns between modules
  - Example: User module at `src/modules/user/` with all related components

### Controller → Service → Repository Pattern
- **Controller Location**: `src/modules/[module-name]/controller/[module-name].controller.js`
  - Handle HTTP requests/responses only
  - Use ApiResponse classes for formatting responses
  - Call service methods for business logic

- **Service Location**: `src/modules/[module-name]/service/[module-name].service.js`
  - Implement all business logic
  - Call repositories for data access
  - Handle validations and business rules

- **Repository Location**: `src/modules/[module-name]/repository/[module-name].repository.js`
  - Handle all data access operations
  - Implement CRUD operations using models
  - Never expose models directly to services

- **Model Location**: `src/modules/[module-name]/model/[model-name].model.js`
  - Define mongoose schemas and models
  - Implement schema validations, methods, and hooks

## Error Handling

### Error Factory Functions
- **Location**: `src/core/ApiError.js`
- **Implementation**:
  - Use factory functions to create error objects
  - Use predefined error factories (badRequest, notFound, etc.)
  - Include appropriate HTTP status codes
  - Pattern: `throw errors.notFound('Resource not found')`

### Error Middleware
- **Location**: `src/middlewares/error.js`
- **Implementation**:
  - Convert all errors to ApiError format before sending to client
  - Distinguish operational errors from programming errors
  - Log errors appropriately

### Async Handling
- **Location**: `src/utils/catchAsync.js`
- **Implementation**:
  - Always wrap async controller functions with catchAsync utility
  - Pattern: `const controllerMethod = catchAsync(async (req, res) => { ... })`
  - Never use try/catch in controllers when catchAsync is available

## Response Formatting

### Response Factory Functions
- **Location**: `src/core/ApiResponse.js`
- **Implementation**:
  - Use factory functions to create response objects
  - Use `sendResponse` utility to send responses
  - Pattern: `sendResponse(res, responses.success('message', data))`
  - Available responses: success, created, noContent, badRequest, notFound, internalError

### Status Code Usage
- 200: Successful requests (GET, PATCH, PUT)
- 201: Resource creation (POST)
- 204: Successful deletion (DELETE)
- 400-499: Client errors
- 500-599: Server errors

## Authentication & Authorization

### JWT Implementation
- **Location**: `src/modules/auth/service/token.service.js`
- **Implementation**:
  - Use access and refresh token strategy
  - Access tokens: short-lived (15-60 minutes)
  - Refresh tokens: longer-lived (days)
  - Blacklist tokens on logout

### Authorization Middleware
- **Location**: `src/middlewares/auth.js`
- **Implementation**:
  - Use auth middleware for protected routes
  - Use authorize middleware with specific roles for role-based access
  - Pattern: `router.get('/', auth, authorize('admin'), controller.method)`

### Token Storage
- **Location**: For production, implement persistent storage
- **Implementation**:
  - For development, in-memory storage is acceptable

## Validation

### Schema-based Validation
- **Location**: `src/modules/[module-name]/validation/[module-name].validation.js`
- **Implementation**:
  - Define Joi schemas for all requests (body, query, params)
  - Use validation middleware with all routes
  - Pattern: `router.post('/', validate(validateSchema), controller.method)`

### Custom Validators
- **Location**: `src/utils/validation.js`
- **Implementation**:
  - Create reusable custom validators for common patterns (ObjectId, passwords)
  - Use throughout validation schemas

## Data Models

### Schema Definition
- **Location**: `src/modules/[module-name]/model/[model-name].model.js`
- **Implementation**:
  - Define clear validation rules in the schema
  - Use schema methods for object-related functionality
  - Use schema statics for class-related functionality
  - Example: `userSchema.methods.isPasswordMatch = async function(password) {...}`

### Pre/Post Hooks
- **Location**: Within model files
- **Implementation**:
  - Use pre-save hooks for transformations before saving
  - Password hashing must happen in pre-save hook
  - Hide sensitive fields using transform or private: true
  - Example: `userSchema.pre('save', async function(next) {...}`

## API Documentation

### Swagger/OpenAPI
- **Location**: 
  - Definition: `src/docs/swaggerDef.js`
  - Config: `src/config/swagger.js`
  - JSDoc: Within route files
- **Implementation**:
  - Document all endpoints with JSDoc comments in route files
  - Group endpoints by tags for better organization
  - Define schemas for request/response objects
  - Include examples

### Postman Collection Generation
- **Location**:
  - Generator: `src/utils/postmanGenerator.js`
  - Script: `src/scripts/generate-postman.js`
  - API Endpoint: GET `/api/v1/api-docs/postman`
- **Implementation**:
  - Automatically generate Postman collection from Swagger documentation
  - Update collection when API changes
  - Access via:
    - Command line: `npm run postman`
    - API endpoint: `/api/v1/api-docs/postman` (for direct download)

## Testing

### Unit Testing
- **Location**: `tests/unit/[category]/[file].test.js`
- **Implementation**:
  - Test each component in isolation
  - Mock dependencies for unit tests
  - Focus on testing business logic in services

### Integration Testing
- **Location**: `tests/integration/[feature].test.js`
- **Implementation**:
  - Use mongodb-memory-server for database tests
  - Test the complete request flow
  - Verify response structure and status codes

### Test Organization
- **Location**: Within test files
- **Implementation**:
  - Group tests by feature/module
  - Use describe blocks for logical grouping
  - Use clear test descriptions

## Middleware

### Global Middleware
- **Location**: Applied in `src/app.js`
- **Implementation**:
  - Apply security headers (helmet)
  - Enable CORS with appropriate configuration
  - Implement rate limiting for all routes
  - Use compression for response bodies

### Custom Middleware
- **Location**: `src/middlewares/`
- **Implementation**:
  - Create middleware for specific concerns
  - Keep middleware functions small and focused

## Configuration

### Environment-based Config
- **Location**: `src/config/config.js`
- **Implementation**:
  - Load config from .env files
  - Provide sensible defaults
  - Validate required environment variables
  - Group related config variables

## Logging

### Structured Logging
- **Location**: `src/config/logger.js`
- **Implementation**:
  - Use winston for logging
  - Configure different transports based on environment
  - Log appropriate levels (error, warn, info)
  - Include timestamps and request IDs

## Coding Style

### Formatting and Linting
- **Location**: `.eslintrc.json` and `.prettierrc`
- **Implementation**:
  - Follow ESLint and Prettier configurations
  - Use consistent naming conventions
  - Document code with JSDoc comments
  - Keep functions small and focused

## Adding New Features

### Adding a New Module
1. Create full directory structure under `src/modules/[module-name]/`
   ```
   src/modules/product/
   ├── controller/
   ├── model/
   ├── repository/
   ├── service/
   ├── validation/
   └── routes/
   ```

2. Implementation order:
   - Define model schema first (`model/product.model.js`)
   - Implement repository with CRUD operations (`repository/product.repository.js`)
   - Add service with business logic (`service/product.service.js`)
   - Create controller with route handlers (`controller/product.controller.js`)
   - Define validation schemas (`validation/product.validation.js`)
   - Set up routes with validation and auth middleware (`routes/product.routes.js`)

3. Update main routes index at `src/routes/index.js`
   ```javascript
   const productRoutes = require('../modules/product/routes/product.routes');
   // ...
   router.use('/products', productRoutes);
   ```

4. Add tests:
   - Unit tests: `tests/unit/modules/product/`
   - Integration tests: `tests/integration/product.test.js`

### Adding a New Endpoint to Existing Module
1. Add validation schema in `src/modules/[module-name]/validation/[module-name].validation.js`
2. Implement repository method if needed
3. Add service method with business logic
4. Create controller method
5. Add route with appropriate middleware in `src/modules/[module-name]/routes/[module-name].routes.js`

### Modifying Existing Functionality
1. Update schema if changing model
2. Modify repository methods
3. Update service logic
4. Adjust controller if needed
5. Update validation schemas
6. Update tests

## Security Practices

### Input Validation
- Validate all user inputs using Joi schemas
- Sanitize data to prevent injection attacks
- Use strict mode for schemas

### Authentication
- Secure all sensitive routes with auth middleware
- Implement proper token validation
- Use HTTPS in production

### Data Protection
- Hash passwords with bcrypt in the user model
- Never store sensitive data in plain text
- Protect against common vulnerabilities (XSS, CSRF)

## Importing Guidelines

### Core Components
```javascript
const { ApiError } = require('../../../core/ApiError');
```

### Module Components
```javascript
// Inside user service
const userRepository = require('../repository/user.repository');
```

### Cross-Module Dependencies
```javascript
// Inside auth service
const userService = require('../../user/service/user.service');
```

### Utilities and Config
```javascript
const config = require('../../../config/config');
const catchAsync = require('../../../utils/catchAsync');
```

## File Location Reference By Category

### Configuration Files
- **Environment Config**: `src/config/config.js`
- **Database Connection**: `src/config/db.js`
- **Logger Config**: `src/config/logger.js`
- **Swagger Config**: `src/config/swagger.js`

### Core Components
- **Error Classes**: `src/core/ApiError.js`
- **Response Classes**: `src/core/ApiResponse.js`

### Middleware
- **Error Middleware**: `src/middlewares/error.js`
- **Auth Middleware**: `src/middlewares/auth.js`
- **Validation Middleware**: `src/middlewares/validate.js`

### Routes
- **Main Routes Index**: `src/routes/index.js`
- **Module Routes**: `src/modules/[module-name]/routes/[module-name].routes.js`

### Utility Functions
- **Async Handler**: `src/utils/catchAsync.js`
- **Validation Helpers**: `src/utils/validation.js`
- **Postman Generator**: `src/utils/postmanGenerator.js`

### Documentation
- **Swagger Definition**: `src/docs/swaggerDef.js`

### Scripts
- **Postman Generation**: `src/scripts/generate-postman.js`

### Application Setup
- **Express App**: `src/app.js`
- **Server Startup**: `src/server.js`

### Testing Structure
- **Unit Tests**: `tests/unit/[category]/[file].test.js`
- **Integration Tests**: `tests/integration/[feature].test.js`
- **Test Setup**: `tests/setup.js`

## Component Relationship Map

- **Request Flow**:
  `Routes → Controller → Service → Repository → Model`

- **Response Flow**:
  `Model → Repository → Service → Controller → ApiResponse → Client`

- **Error Flow**:
  `Any Component → ApiError → Error Middleware → Client`

## Repository Pattern

### Repository Functions
- **Location**: `src/modules/[module-name]/repository/[module-name].repository.js`
- **Implementation**:
  - Export an object with CRUD functions
  - Handle all data access operations
  - Implement error handling using error factories
  - Pattern: `const repository = { create, findById, update, delete }`

---

By following these rules and instructions, all code added to the Express Mongoose Boilerplate will maintain the established patterns, ensuring a consistent, maintainable, and secure codebase. 