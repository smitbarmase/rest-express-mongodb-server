const mongoose = require('mongoose');
const User = require('./user');

const Post = mongoose.model('Post', {
  title: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = Post;