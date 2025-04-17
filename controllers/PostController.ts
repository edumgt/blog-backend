import { Request, Response, NextFunction } from 'express';

import { AuthRequest, GetAllQuery } from '../types';
import { AppError } from '../utils/AppError';
import {
  createPost,
  getAllPosts,
  getLastTagsService,
  getOnePost,
  removePost,
  updatePost,
} from '../services/postService';

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('No access', 401);
    }

    const post = await createPost(req.body, req.userId);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const getAll = async (
  req: Request<{}, {}, {}, GetAllQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const posts = await getAllPosts(req.query.sort, req.query.tag);

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await getOnePost(req.params.id);

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('No access', 401);
    }

    const updated = await updatePost(req.params.id, req.userId, req.body);

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('No access', 401);
    }

    const result = await removePost(req.params.id, req.userId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getLastTags = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await getLastTagsService();

    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};
