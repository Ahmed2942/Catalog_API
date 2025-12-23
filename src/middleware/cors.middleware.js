const cors = require('cors');

/**
 * CORS Middleware Configuration
 * 
 * Why separate file?
 * - Centralized CORS configuration
 * - Easy to modify allowed origins
 * - Can add different CORS configs for different routes
 * - Reusable across projects
 * 
 * CORS (Cross-Origin Resource Sharing):
 * - Allows frontend apps from different domains to call this API
 * - Without CORS: Browser blocks requests from different origins
 * - With CORS: Specify which origins are allowed
 */

const corsOptions = {
  // Allow requests from these origins
  origin: process.env.CORS_ORIGIN || '*', // '*' = allow all (dev only!)
  
  // Allow these HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  
  // Allow these headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Cache preflight requests for 1 hour
  maxAge: 3600,
};

/**
 * Why these options?
 * 
 * origin: '*' in development is convenient
 * - Production: Set specific domains in .env
 * - Example: CORS_ORIGIN=https://myapp.com,https://admin.myapp.com
 * 
 * credentials: true
 * - Allows sending cookies/auth tokens
 * - Required for authenticated requests
 * 
 * maxAge: 3600
 * - Browser caches preflight (OPTIONS) requests
 * - Reduces number of requests
 */

module.exports = cors(corsOptions);