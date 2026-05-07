import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import config from '../../../config/config.js';
import { asyncHandler } from '../../../common/utils/asyncHandler.js';
import { ApiError } from '../../../common/middleware/error.middleware.js';

export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    throw new ApiError('Username already exists', 400);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role }, 
    config.jwtSecret, 
    { expiresIn: '7d' }
  );

  res.json({ 
    token, 
    user: { id: user._id, username: user.username, role: user.role } 
  });
});
