const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  subject: { type: String },
  description: { type: String },
  createAt: { type: Date, default: Date.now() },
  comments: [{
    message: { type: String },
    commmentor: { type: String },
    createAt: { type: Date, default: Date.now() }
  }]
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;