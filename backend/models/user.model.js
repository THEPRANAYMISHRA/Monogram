const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    membership: { type: String, required: true, default: "Basic" },
    postsCount: { type: Number, default: 0 },
    lastPostTimestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const UserModel = mongoose.model('users', userSchema)
module.exports = { UserModel };