const mongoose = require('mongoose');

const Post = mongoose.model('Post', {
  title: {
    type: String
  }
});

module.exports = Post;