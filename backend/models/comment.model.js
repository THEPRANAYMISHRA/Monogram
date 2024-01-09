const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment: { type: String, required: true },
    author: { type: String, required: true, default: "unknown@user.com" },
    date: { type: Date, default: Date.now },
})

const CommentModel = mongoose.model('comments', commentSchema)
module.exports = { CommentModel };