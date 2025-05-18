const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = require('../docs/swaggerDef');
const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Generate Postman collection from Swagger documentation
 * @param {string} outputPath - Path to save the Postman collection
 */
const generatePostmanCollection = (outputPath = './postman-collection.json') => {
  try {
    // Generate Swagger spec
    const swaggerOptions = {
      swaggerDefinition,
      apis: ['src/modules/*/routes/*.js', 'src/docs/*.yml'],
    };
    
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    const baseUrl = `http://localhost:${config.port}${config.apiPrefix}`;
    
    // Create Postman collection structure
    const postmanCollection = {
      info: {
        name: `${swaggerSpec.info.title} API Collection`,
        description: swaggerSpec.info.description,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        version: swaggerSpec.info.version,
      },
      item: [],
      variable: [
        {
          key: 'baseUrl',
          value: baseUrl,
          type: 'string',
        },
      ],
    };
    
    // Group by tags
    const pathsByTag = {};
    
    // Process all API paths
    Object.keys(swaggerSpec.paths).forEach((path) => {
      const pathItem = swaggerSpec.paths[path];
      
      // Process all HTTP methods (GET, POST, etc.)
      Object.keys(pathItem).forEach((method) => {
        const operation = pathItem[method];
        const tags = operation.tags || ['default'];
        
        // Add to tags group
        tags.forEach((tag) => {
          if (!pathsByTag[tag]) {
            pathsByTag[tag] = [];
          }
          
          // Create request body if present
          let body = null;
          if (operation.requestBody && operation.requestBody.content['application/json']) {
            const schema = operation.requestBody.content['application/json'].schema;
            body = {
              mode: 'raw',
              raw: JSON.stringify(createExampleFromSchema(schema), null, 2),
              options: {
                raw: {
                  language: 'json',
                },
              },
            };
          }
          
          // Create URL parameters
          const url = {
            raw: `{{baseUrl}}${path}`,
            host: ['{{baseUrl}}'],
            path: path.split('/').filter((p) => p),
          };
          
          // Add path parameters
          const pathParams = operation.parameters?.filter((p) => p.in === 'path') || [];
          pathParams.forEach((param) => {
            url.path = url.path.map((p) => 
              p.startsWith(':') || p.startsWith('{') ? `:${param.name}` : p
            );
          });
          
          // Add query parameters
          const queryParams = operation.parameters?.filter((p) => p.in === 'query') || [];
          if (queryParams.length > 0) {
            url.query = queryParams.map((param) => ({
              key: param.name,
              value: param.example || '',
              description: param.description || '',
            }));
          }
          
          // Create headers
          const headers = [];
          if (operation.security && operation.security.length > 0) {
            headers.push({
              key: 'Authorization',
              value: 'Bearer {{token}}',
              type: 'text',
            });
          }
          
          // Create request item
          const item = {
            name: operation.summary || path,
            request: {
              method: method.toUpperCase(),
              header: headers,
              url,
              description: operation.description || '',
            },
          };
          
          // Add body if it exists
          if (body) {
            item.request.body = body;
          }
          
          pathsByTag[tag].push(item);
        });
      });
    });
    
    // Convert tag groups to Postman folders
    Object.keys(pathsByTag).forEach((tag) => {
      postmanCollection.item.push({
        name: tag,
        item: pathsByTag[tag],
      });
    });
    
    // Write to file
    fs.writeFileSync(
      outputPath,
      JSON.stringify(postmanCollection, null, 2)
    );
    
    logger.info(`Postman collection generated at ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error('Error generating Postman collection:', error);
    throw error;
  }
};

/**
 * Create example object from schema
 * @param {Object} schema - JSON Schema object
 * @returns {Object} Example object
 */
function createExampleFromSchema(schema) {
  if (schema.example) {
    return schema.example;
  }
  
  if (schema.type === 'object') {
    const result = {};
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        result[key] = createExampleFromSchema(schema.properties[key]);
      });
    }
    return result;
  }
  
  if (schema.type === 'array') {
    return [createExampleFromSchema(schema.items)];
  }
  
  // Handle primitive types
  switch (schema.type) {
    case 'string':
      return schema.format === 'email' ? 'user@example.com' : 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return null;
  }
}

module.exports = { generatePostmanCollection }; 