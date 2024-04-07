// middleware/checkRole.js

/**
 * Middleware to check user role.
 * @param {string} requiredRole - The role required to access the route.
 * @returns Middleware function that checks if the logged-in user has the required role.
 */
const checkRole = (requiredRole) => (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).send({ error: 'Access denied. Insufficient permissions.' });
    }
  };
  
  module.exports = checkRole;
  