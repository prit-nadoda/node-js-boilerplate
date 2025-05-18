const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { connectDB } = require('./config/db');

/**
 * Start Express server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
      logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err);
      
      // Close server and exit process
      server.close(() => {
        process.exit(1);
      });
    });
    
    // Handle SIGTERM signal (e.g., from a process manager like PM2)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated!');
      });
    });
    
    return server;
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
