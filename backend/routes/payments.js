const express = require('express');
const { makeOrder, validateOrder } = require("../controllers/payment.controller")
const paymentsRouter = express.Router();

paymentsRouter.post('/order', makeOrder)
paymentsRouter.post('/validate', validateOrder)


module.exports = { paymentsRouter };