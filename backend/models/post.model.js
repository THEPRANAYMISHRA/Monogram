const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String },
    email: { type: String, required: true },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }],
    date: { type: Date, default: Date.now },
})

const PostModel = mongoose.model('posts', postSchema)
module.exports = { PostModel };