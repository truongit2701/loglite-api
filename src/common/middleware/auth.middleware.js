import jwt from 'jsonwebtoken';
import config from '../../config/config.js';
import { ApiError } from './error.middleware.js';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(new ApiError('No token provided, please login', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError('Invalid or expired token', 401));
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new ApiError('Access denied: Admin privileges required', 403));
  }
};
