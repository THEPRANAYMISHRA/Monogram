const { UserModel } = require("../models/user.model");
const Razorpay = require('razorpay');
const crypto = require("crypto");


const registerUser = async (req, res) => {
    const { name, email } = req.body;
    try {
        let userAlreadyExist = await UserModel.findOne({ email: email })
        if (userAlreadyExist) {
            return res.status(403).send({ "message": "email already exist" })
        } else {
            let newUser = new UserModel({
                name: name, email: email
            })
            await newUser.save()
            return res.status(201).send({ "message": "user created" })
        }
    } catch (error) {
        return res.status(400).send({ "error": error })
    }
}

const getUser = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await UserModel.findOne({ email: email })
        return res.status(200).send({ "user": user })
    } catch (error) {
        console.log(error)
        return res.status(400).send({ "message": "User doesn't exist" })
    }
}

const updateMembership = async (req, res) => {
    const { email, plan } = req.body;
    try {

        const user = await UserModel.findOneAndUpdate(
            { email: email },
            { membership: plan },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        return res.status(200).send({ user: user });

    } catch (error) {
        console.log(error)
        return res.status(400).send({ "message": "User doesn't exist" })
    }
}

const makeOrder = async (req, res) => {
    const instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
        payment_capture: 1
    };
    try {
        const response = await instance.orders.create(options)
        return res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
        console.log(err)
        res.status(400).send('Not able to create order. Please try again!');
    }
}

const validateOrder = async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    try {
        const sha = crypto.createHmac('sha256', process.env.key_secret);
        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const digest = sha.digest('hex');

        if (digest === razorpay_signature) {
            return res.status(200).json({ msg: "Success", orderId: razorpay_order_id, paymentId: razorpay_payment_id });
        } else {
            return res.status(400).json({ msg: "Transaction is not legit!" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ "Error": "Error in payment validation" })
    }
}





module.exports = { registerUser, getUser, updateMembership, makeOrder, validateOrder }