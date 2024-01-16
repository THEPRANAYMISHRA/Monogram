const express = require('express');
const { registerUser, updateMembership, makeOrder, validateOrder, getUserDetails, handleWrongAttemptCount } = require("../controllers/user.controller")
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/details', getUserDetails)
userRouter.patch('/update', updateMembership)
userRouter.post('/order', makeOrder)
userRouter.post('/failedAttempt', handleWrongAttemptCount)
userRouter.post('/validate/payment', validateOrder)


module.exports = { userRouter };