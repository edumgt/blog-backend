import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express';

import UserModel from '../models/User';
import { AuthRequest } from '../types';

export const register = async (req: AuthRequest, res: Response) => {
  try {
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
      process.env.JWT_SECRET || '',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user.toObject();

    res.status(201).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Registration error',
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        message: 'Incorrect login or password',
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.toObject().passwordHash);

    if (!isValidPassword) {
      res.status(400).json({
        message: 'Incorrect login or password',
      });
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET || '',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user.toObject();

    res.status(200).json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Authorization error',
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }

    const { passwordHash, ...userData } = user.toObject();

    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'No access',
    });
  }
};
