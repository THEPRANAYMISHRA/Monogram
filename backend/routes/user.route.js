const express = require('express');
const { registerUser, getUser, updateMembership, makeOrder, validateOrder } = require("../controllers/user.controller")
const userRouter = express.Router();

userRouter.post('/', registerUser)
userRouter.post('/find', getUser)
userRouter.patch('/update', updateMembership)
userRouter.post('/order', makeOrder)
userRouter.post('/validate/payment', validateOrder)


module.exports = { userRouter };