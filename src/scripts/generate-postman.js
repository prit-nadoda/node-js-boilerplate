#!/usr/bin/env node

/**
 * Script to generate Postman collection from API documentation
 * Run with: node src/scripts/generate-postman.js [output-path]
 */

const path = require('path');
const { generatePostmanCollection } = require('../utils/postmanGenerator');

// Get output path from command line args or use default
const outputPath = process.argv[2] || path.join(process.cwd(), 'postman-collection.json');

console.log('Generating Postman collection...');
try {
  const filePath = generatePostmanCollection(outputPath);
  console.log(`✅ Postman collection successfully generated at: ${filePath}`);
  console.log('You can import this file directly into Postman');
} catch (err) {
  console.error('❌ Failed to generate Postman collection:', err.message);
  process.exit(1);
} 