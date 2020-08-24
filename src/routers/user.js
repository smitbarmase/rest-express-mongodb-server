const express = require('express');
const User = require('../models/user');

const router = new express.Router();

// POST - Create a user.
router.post('/createUser', (req, res) => {
  const user = new User(req.body);
  user.save().then(() => {
    res.status(201).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// GET - Get list of all users.
router.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch(() => {
    res.status(500).send();
  });
});

// GET - Get user by id.
router.get('/users/:id', (req, res) => {
  const _id = req.params.id;
  User.findById(_id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  }).catch(() => {
    res.status(500).send();
  });
});

// PATCH - Update user by id.
router.patch('/users/:id', (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid updates.' });
  }

  const _id = req.params.id;
  // Here in options parameter, setting new to true will return new updated user.
  User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// DELETE - Delete user by id.
router.delete('/users/:id', (req, res) => {
  const _id = req.params.id;
  User.findByIdAndDelete(_id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

module.exports = router;