import { Types } from 'mongoose';

import CommentModel from '../models/Comment';
import PostModel from '../models/Post';
import { AppError } from '../utils/AppError';

export const createComment = async (postId: string, userId: string, text: string) => {
  const postExists = await PostModel.exists({ _id: postId });

  if (!postExists) {
    throw new AppError('Post not found', 404);
  }

  const comment = new CommentModel({
    text,
    post: new Types.ObjectId(postId),
    user: new Types.ObjectId(userId),
  });

  const savedComment = await comment.save();

  await PostModel.findByIdAndUpdate(postId, {
    $inc: { commentsCount: 1 },
  });

  return savedComment;
};

export const getPostCommentsService = async (postId: string) => {
  const comments = await CommentModel.find({ post: postId })
    .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
    .sort({ createdAt: -1 })
    .exec();

  return comments;
};

export const updateComment = async (commentId: string, userId: string, text: string) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.user.toString() !== userId) {
    throw new AppError('Access denied', 403);
  }

  const updatedComment = await CommentModel.findOneAndUpdate(
    { _id: commentId },
    { text },
    { returnDocument: 'after' },
  );

  return updatedComment;
};

export const removeComment = async (commentId: string, userId: string) => {
  const comment = await CommentModel.findById(commentId);

  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  if (comment.user.toString() !== userId) {
    throw new AppError('Access denied', 403);
  }

  await CommentModel.deleteOne({ _id: commentId });

  await PostModel.findByIdAndUpdate(comment.post, {
    $inc: { commentsCount: -1 },
  });

  return { success: true };
};
