const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  mongoose: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/express-boilerplate',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION || '7d',
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION || '10m',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  rateLimit: {
    windowMs: (process.env.RATE_LIMIT_WINDOW_MS || 15) * 60 * 1000, // Default 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  },
};

module.exports = config; 