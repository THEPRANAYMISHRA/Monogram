const express = require('express');
const multer = require('multer');
const { postContent, getPost, createComment } = require('../controllers/post.controller');
const { checkPostingLimit } = require('../middleware/postCountCheck');
const postRouter = express.Router();

postRouter.post('/', checkPostingLimit, postContent);
postRouter.get('/', getPost);
postRouter.post('/comment', createComment)


module.exports = { postRouter };