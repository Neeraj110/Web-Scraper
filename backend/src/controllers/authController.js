import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  bookmarks: user.bookmarks || [],
});

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = signToken(user._id.toString());

  res.status(201).json({
    status: 'success',
    token,
    user: buildAuthResponse(user),
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken(user._id.toString());

  res.json({
    status: 'success',
    token,
    user: buildAuthResponse(user),
  });
});

export { register, login };