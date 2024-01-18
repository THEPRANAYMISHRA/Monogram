const express = require('express');
const { registerUser, updateMembership, getUserDetails, handleWrongAttemptCount } = require("../controllers/user.controller")
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/details', getUserDetails)
userRouter.patch('/update', updateMembership)
userRouter.post('/failedAttempt', handleWrongAttemptCount)


module.exports = { userRouter };