const express = require('express');
const multer = require('multer');
const { postContent, getPost, createComment } = require('../controllers/post.controller');
const postRouter = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileNameArray = file?.originalname.split('.')
        const extension = fileNameArray[fileNameArray.length - 1]
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
    }
})

const upload = multer({ storage: storage })
postRouter.post('/', upload.single('image'), postContent)
postRouter.get('/', getPost);
postRouter.post('/comment', createComment)


module.exports = { postRouter };