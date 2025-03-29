import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  body('fullName', 'Invalid name').isLength({ min: 2 }),
  body('avatarUrl', 'Invalid avatar URL').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Enter post title').isLength({ min: 3 }).isString(),
  body('text', 'Enter post text').isLength({ min: 5 }).isString(),
  body('tags', 'Invalid tag format').optional().isString(),
  body('imageUrl', 'Invalid image URL').optional().isString(),
];
