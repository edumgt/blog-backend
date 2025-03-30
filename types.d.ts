import { Request } from 'express';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
}

export interface IPost {
  title: string;
  text: string;
  tags?: Array;
  viewsCount?: number;
  user: mongoose.Schema.Types.ObjectId;
  imageUrl?: string;
}
