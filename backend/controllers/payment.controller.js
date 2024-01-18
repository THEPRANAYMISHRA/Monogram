const { UserModel } = require("../models/user.model");
const Razorpay = require('razorpay');
const crypto = require("crypto");
require("dotenv").config()

const makeOrder = async (req, res) => {
    const { plan } = req.body;
    try {
        const instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

        const options = {
            amount: plan == "Silver" ? 10000 : plan == "Gold" ? 100000 : 0,
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options)
        return res.json(order)
    } catch (err) {
        console.log(err)
        res.status(400).send('Not able to create order. Please try again!');
    }
}

const validateOrder = async (req, res) => {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, userEmail } = req.body;
    try {
        const shasum = crypto.createHmac('sha256', process.env.key_secret);
        shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest === razorpaySignature) {
            console.log("yay! One successful payment");
            const instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret });
            const response = await instance.orders.fetchPayments(razorpayOrderId);
            let planAmount = response.items[0].amount;
            let updateUserObj = await UserModel.findOne({ email: userEmail });
            updateUserObj.membership = planAmount === 10000 ? 'Silver' : planAmount === 100000 ? 'Gold' : "Basic";
            await updateUserObj.save();
            return res.status(200).json({ msg: "Success", orderId: razorpayOrderId, paymentId: razorpayPaymentId });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ "Error": "Error in payment validation" });
    }
};

module.exports = { makeOrder, validateOrder }