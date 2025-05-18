const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../docs/swaggerDef');

const swaggerOptions = {
  swaggerDefinition,
  apis: ['src/modules/*/routes/*.js', 'src/docs/*.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Configure Swagger middleware for Express
 * @param {Express} app - Express app
 */
const setupSwagger = (app) => {
  // Swagger UI setup
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = {
  setupSwagger,
}; 