import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';

import PostModel from '../models/Post';
import { AuthRequest, GetAllQuery } from '../types';

export const getAll = async (req: Request<{}, {}, {}, GetAllQuery>, res: Response) => {
  try {
    const sortParam = req.query.sort;
    const tagFilter = req.query.tag;

    const sortBy: { [key: string]: SortOrder } =
      sortParam === 'popular' ? { viewsCount: -1 } : { createdAt: -1 };

    const query: Record<string, any> = {};
    if (tagFilter) {
      query.tags = tagFilter;
    }

    const posts = await PostModel.find(query)
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
      .sort(sortBy)
      .exec();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error fetching posts',
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
      .exec();
    if (!doc) {
      res.status(404).json({
        message: 'Post not found',
      });
      return;
    }
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error fetching post',
    });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating post',
    });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findById(postId);

    if (!doc) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (doc.user.toString() !== req.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await PostModel.deleteOne({ _id: postId });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error deleting post',
    });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findById(postId);
    if (!doc) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (doc.user.toString() !== req.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      },
      { returnDocument: 'after' },
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error updating post',
    });
  }
};

export const getLastTags = async (_: Request, res: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = [...new Set(posts.map((obj) => obj.tags).flat())].slice(0, 5);

    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error fetching tags',
    });
  }
};
