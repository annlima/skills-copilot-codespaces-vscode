// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Comment } = require('../models/comment');
const { Post } = require('../models/post');
const { User } = require('../models/user');
const { ensureAuthenticated } = require('../config/auth');

// Create a comment
router.post(
  '/create/:id',
  ensureAuthenticated,
  body('content').not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).redirect('/posts/' + req.params.id);
    } else {
      try {
        const post = await Post.findById(req.params.id);
        if (!post) {
          res.status(404).redirect('/posts');
        } else {
          const user = await User.findById(req.user.id);
          if (!user) {
            res.status(404).redirect('/posts');
          } else {
            const comment = new Comment({
              content: req.body.content,
              post: post._id,
              user: user._id,
            });
            await comment.save();
            post.comments.push(comment._id);
            await post.save();
            res.redirect('/posts/' + req.params.id);
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).redirect('/posts');
      }
    }
  }
);