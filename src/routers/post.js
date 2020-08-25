const express = require('express');
const Post = require('../models/post');

const router = new express.Router();

// POST - Create a post.
router.post('/createPost', (req, res) => {
  const post = new Post(req.body);
  post.save().then(() => {
    res.status(201).send(post);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// GET - Get list of all posts.
router.get('/posts', (req, res) => {
  Post.find({}).then((posts) => {
    res.send(posts);
  }).catch(() => {
    res.status(500).send();
  });
});

// GET - Get post by id.
router.get('/posts/:id', (req, res) => {
  const _id = req.params.id;
  Post.findById(_id).then((post) => {
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  }).catch(() => {
    res.status(500).send();
  });
});

// PATCH - Update post by id.
router.patch('/posts/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid updates.' });
  }

  try {
    const post = await Post.findById(req.params.id);
    updates.forEach((update) => post[update] = req.body[update]);
    await post.save();

    if (!post) {
      return res.status(404).send();
    }

    res.send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE - Delete post by id.
router.delete('/posts/:id', (req, res) => {
  const _id = req.params.id;
  Post.findByIdAndDelete(_id).then((post) => {
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

module.exports = router;