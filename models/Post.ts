import { Schema, Types, model } from 'mongoose';

import { IPost } from '../types';

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default model<IPost>('Post', PostSchema);
