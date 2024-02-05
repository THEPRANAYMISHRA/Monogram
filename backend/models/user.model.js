const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePhoto: { type: String, default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png" },
    coverPhoto: { type: String, default: "https://www.survivorsuk.org/wp-content/uploads/2017/01/no-image.jpg" },
    membership: { type: String, required: true, default: "Basic" },
    profilePrivacy: {
        type: String,
        enum: ['Everyone', 'Nobody', 'Followers'],
        default: 'Everyone'
    },
    followers: [{ type: String }],
    followersCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    lastPostTimestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const UserModel = mongoose.model('users', userSchema)
module.exports = { UserModel };