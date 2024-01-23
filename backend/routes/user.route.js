const express = require('express');
const { registerUser, updateMembership, getUserDetails, handleWrongAttemptCount, updateUserDetails } = require("../controllers/user.controller")
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/details', getUserDetails)
userRouter.patch('/update/details', updateUserDetails)
userRouter.patch('/update/membership', updateMembership)
userRouter.post('/failedAttempt', handleWrongAttemptCount)


module.exports = { userRouter };