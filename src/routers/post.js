const express = require('express');
const Post = require('../models/post');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new express.Router();

// POST - Create a post.
router.post('/posts', auth, async (req, res) => {
  const post = new Post({
    ...req.body,
    owner: req.user._id
  });
  try {
    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET - Get list of all posts by user id.
router.get('/users/:id/posts', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    await user.populate({
      path: 'posts',
      // ?key=value - For filtering
      //match: { key: value}
      options: {
        // ?limit=10&skip=0 - For pagination
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: {
          // ?sortBy=createdAt_desc - For sorting
          // createdAt: 1 (for ascending) or -1 (for descending)
        }
      }
    }).execPopulate();
    res.send(user.posts);
  } catch (e) {
    res.status(500).send();
  }
});

// GET - Get any post by id.
router.get('/posts/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (e) {
    res.status(500).send();
  }
});

// PATCH - Update post by id and it should be me.
router.patch('/posts/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid updates.' });
  }

  try {
    const post = await Post.findOne({ _id: req.params.id, owner: req.user._id });

    if (!post) {
      return res.status(404).send();
    }

    updates.forEach((update) => post[update] = req.body[update]);
    await post.save();

    res.send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE - Delete post by id and it should be me.
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;