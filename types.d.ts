import { Request, Document } from 'express';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  title: string;
  text: string;
  tags?: string[];
  viewsCount: number;
  commentsCount: number;
  user: Types.ObjectId | IUser;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  text: string;
  post: Types.ObjectId | IPost;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
