import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use(uploadRoutes);

app.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
