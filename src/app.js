const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status');
const config = require('./config/config');
const { setupSwagger } = require('./config/swagger');
const { errorConverter, errorHandler } = require('./middlewares/error');
const routes = require('./routes');
const logger = require('./config/logger');
const { NotFoundError } = require('./core/ApiError');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  // Don't crash the app in development
  if (config.env === 'production') {
    process.exit(1);
  }
});

const app = express();

// Set request logging
if (config.env !== 'test') {
  app.use(morgan(config.logs.format, { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(httpStatus.OK).send({ status: 'ok' });
});

// API routes
app.use(config.apiPrefix, routes);

// Swagger docs
setupSwagger(app);

// 404 handler - convert to ApiError
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// Convert errors to ApiError, if needed
app.use(errorConverter);

// Handle errors
app.use(errorHandler);

module.exports = app;
