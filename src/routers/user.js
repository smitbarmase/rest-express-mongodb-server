const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// POST - Create a user.
router.post('/createUser', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// GET - Get profile.
router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

// GET - Get user by id.
router.get('/users/:id', auth, (req, res) => {
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
router.patch('/users/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid updates.' });
  }

  try {
    const user = await User.findById(req.params.id);
    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);

  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE - Delete user by id.
router.delete('/users/:id', auth, (req, res) => {
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