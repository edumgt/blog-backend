import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
      .sort({ createdAt: -1 })
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error fetching posts',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    ).populate({ path: 'user', select: ['fullName', 'avatarUrl'] });
    if (!doc) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error fetching post',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating post',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findById(postId);

    if (!doc) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (doc.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await PostModel.deleteOne({ _id: postId });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error deletion post',
    });
  }
};
