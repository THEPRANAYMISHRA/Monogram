const mongoose = require('mongoose')

const blockedUserSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
})

blockedUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

const BlockedUserModel = mongoose.model('blockedusers', blockedUserSchema)
module.exports = { BlockedUserModel };