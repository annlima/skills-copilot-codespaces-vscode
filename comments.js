// Create web sever for comment
//====================================
//Import module
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

//Handle request
router.get('/', commentController.getComment);
router.post('/', auth, commentController.postComment);
router.put('/:id', auth, commentController.putComment);
router.delete('/:id', auth, commentController.deleteComment);
