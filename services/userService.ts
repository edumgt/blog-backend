import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User';
import { RegisterUserInput } from './types';
import { AppError } from '../utils/AppError';

export const registerUser = async (userData: RegisterUserInput) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);

  const doc = new UserModel({
    fullName: userData.fullName,
    email: userData.email,
    avatarUrl: userData.avatarUrl,
    passwordHash: hash,
  });

  const user = await doc.save();

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '30d',
    },
  );

  const { passwordHash, ...cleanUser } = user.toObject();
  return { ...cleanUser, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError('Incorrect login or password', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.toObject().passwordHash);

  if (!isValidPassword) {
    throw new AppError('Incorrect login or password', 401);
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET || '',
    {
      expiresIn: '30d',
    },
  );

  const { passwordHash, ...cleanUser } = user.toObject();

  return {
    ...cleanUser,
    token,
  };
};

export const getUser = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError('User not found', 401);
  }

  const { passwordHash, ...cleanUser } = user.toObject();

  return { ...cleanUser };
};
