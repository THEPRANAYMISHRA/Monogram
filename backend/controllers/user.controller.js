const { UserModel } = require("../models/user.model");
const Razorpay = require('razorpay');
const crypto = require("crypto");
const nodemailer = require('nodemailer')
require("dotenv").config()
const { BlockedUserModel } = require("../models/blocked.users");


const registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        const userAlreadyExist = await UserModel.findOne({ email });

        if (userAlreadyExist) {
            return res.status(409).json({ message: "Email already exists" });
        }
        const newUser = new UserModel({ name, email });
        await newUser.save();
        return res.status(201).json({ message: "Account created" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { email } = req.body;

        const blockedUser = await BlockedUserModel.findOne({ email });
        if (blockedUser) {
            return res.status(403).json({ error: 'Account is blocked. Please try again later.' });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please check your credentials.' });
        }
        return res.status(200).json({
            email: user.email
        })
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


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

const blockedUsers = {};

const handleWrongAttemptCount = async (req, res) => {
    try {
        let { email } = req.body;

        console.log(blockedUsers)

        if (!blockedUsers[email]) {
            blockedUsers[email] = { attempts: 1 };
        } else {
            blockedUsers[email].attempts++;

            // for failed attempts
            if (blockedUsers[email].attempts >= 3) {
                sendNotificationEmail(email, 'Consecutive failed login attempts');
            }

            // for five
            if (blockedUsers[email].attempts >= 5) {
                await blockUser(email);
                delete blockedUsers[email];
                sendNotificationEmail(email, 'Account blocked due to five consecutive failed login attempts');
                return res.status(403).json({ message: 'Account is blocked. Please try again later.' });
            }
        }

    } catch (error) {
        console.error('Error handling wrong attempt count:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

function sendNotificationEmail(email, message) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.nodeEmail,
                pass: process.env.nodemailer
            }
        });

        const mailOptions = {
            from: 'monogram@alert',
            to: email,
            subject: 'Security Alert',
            text: 'Attempt to login',
            html: `<b>${message}</b>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}

async function blockUser(email) {
    try {
        let newBlockedUser = new BlockedUserModel({ email });
        await newBlockedUser.save();
        return newBlockedUser;
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
}

module.exports = { registerUser, getUserDetails, updateMembership, makeOrder, validateOrder, handleWrongAttemptCount };