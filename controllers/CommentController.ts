import { Request, Response } from 'express';

import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import { AuthRequest } from '../types.js';

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({ post: postId })
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to load comments' });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.id;

    const postExists = await PostModel.exists({ _id: postId });
    if (!postExists) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comment = new CommentModel({
      text: req.body.text,
      post: postId,
      user: req.userId,
    });

    const savedComment = await comment.save();

    await PostModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;

    const doc = await CommentModel.findById(commentId);
    if (!doc) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (doc.user.toString() !== req.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { text: req.body.text },
      { returnDocument: 'after' },
    );

    res.status(200).json(updatedComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;

    const doc = await CommentModel.findById(commentId);

    if (!doc) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (doc.user.toString() !== req.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await CommentModel.deleteOne({
      _id: commentId,
    });

    await PostModel.findByIdAndUpdate(doc.post, {
      $inc: { commentsCount: -1 },
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
