import { SortOrder } from 'mongoose';

import PostModel from '../models/Post';
import { AppError } from '../utils/AppError';
import { CreatePostInput } from './types';

export const createPost = async (postData: CreatePostInput, userId: string) => {
  const post = new PostModel({
    title: postData.title,
    text: postData.text,
    tags: postData.tags,
    imageUrl: postData.imageUrl,
    user: userId,
  });

  const savedPost = await post.save();

  return savedPost;
};

export const getAllPosts = async (sortParam?: string, tagFilter?: string) => {
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

  return posts;
};

export const getOnePost = async (postId: string) => {
  const post = await PostModel.findOneAndUpdate(
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

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

export const updatePost = async (postId: string, userId: string, updateData: CreatePostInput) => {
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.user.toString() !== userId) {
    throw new AppError('Access denied', 403);
  }

  const updatedPost = await PostModel.findOneAndUpdate(
    { _id: postId },
    {
      title: updateData.title,
      text: updateData.text,
      tags: updateData.tags,
      imageUrl: updateData.imageUrl,
    },
    { returnDocument: 'after' },
  );

  return updatedPost;
};

export const removePost = async (postId: string, userId: string) => {
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.user.toString() !== userId) {
    throw new AppError('Access denied', 403);
  }

  await PostModel.deleteOne({ _id: postId });

  return { success: true };
};

export const getLastTagsService = async () => {
  const posts = await PostModel.find().limit(5).exec();

  const tags = [...new Set(posts.map((post) => post.tags).flat())].slice(0, 5);

  return tags;
};
