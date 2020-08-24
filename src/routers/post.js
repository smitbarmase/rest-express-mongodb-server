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
router.patch('/posts/:id', (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid updates.' });
  }

  const _id = req.params.id;
  // Here in options parameter, setting new to true will return new updated post.
  Post.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }).then((post) => {
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  }).catch((error) => {
    res.status(400).send(error);
  });
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