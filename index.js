import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({
        message: 'Incorrect login or password',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Incorrect login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Authorization error',
    });
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Registration error',
    });
  }
});

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'No access',
    });
  }
});

app.listen(3000, () => {
  console.log('Server OK');
});
