import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import tagsRoutes from './routes/tagsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use(uploadRoutes);
app.use(tagsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server running on port ${PORT}`);
});
