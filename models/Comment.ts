import { model, Schema, Types } from 'mongoose';

import { IComment } from '../types';

const CommentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IComment>('Comment', CommentSchema);
