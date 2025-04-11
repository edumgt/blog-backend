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
  body('title', 'Post title must be at least 3 characters').isLength({ min: 3 }).isString(),
  body('text', 'Post text must be at least 5 characters').isLength({ min: 5 }).isString(),
  body('tags', 'Invalid tag format').optional().isArray(),
  body('imageUrl', 'Invalid image URL').optional().isString(),
];

export const commentCreateValidation = [
  body('text', 'Comment text must be at least 1 character').isLength({ min: 1 }).isString(),
];
