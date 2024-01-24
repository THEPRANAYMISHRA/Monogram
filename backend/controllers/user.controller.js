const { UserModel } = require("../models/user.model");
const Razorpay = require('razorpay');
const crypto = require("crypto");
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
require("dotenv").config()
const { BlockedUserModel } = require("../models/blocked.users");



const registerUser = async (req, res) => {
    try {
        const { name, email, imageurl } = req.body;

        const userAlreadyExist = await UserModel.findOne({ email });

        if (userAlreadyExist) {
            return res.json({ message: "Email already exists" });
        }
        const newUser = new UserModel({ name, email, imageurl });
        await newUser.save();
        return res.status(201).json({ message: "Account created" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { tokenEmail, email } = req.body;

        const blockedUser = await BlockedUserModel.findOne({ tokenEmail });
        if (blockedUser) {
            return res.status(403).json({ error: 'Account is blocked. Please try again later.' });
        }

        let user;
        // differentiating between owner and other user using the token email
        if (tokenEmail !== email) {
            user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found. Please check your credentials.' });
            } else {
                let modifiedUser;
                if (user.profilePrivacy === "Nobody") {
                    modifiedUser = { name: user.name, email: user.email, membership: user.membership, followersCount: user.followersCount };
                } else if (user.profilePrivacy !== "Everyone" && !user.followers[tokenEmail]) {
                    modifiedUser = { name: user.name, email: user.email, membership: user.membership, followersCount: user.followersCount };
                }
                return res.status(200).json(modifiedUser);
            }
        } else {
            user = await UserModel.findOne({ email });
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error('Error during getUserDetails:', error);
        return res.status(500).json({ error: 'Failed to get user details.' });
    }
};


const updateUserDetails = async (req, res) => {
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

        // Update the fields that are passed in the request body
        for (let key in req.body) {
            if (key !== "email" && key !== 'membership') {
                user[key] = req.body[key];
            }
        }
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error during update:', error);
        return res.status(500).json({ error: 'Failed to update user details.' });
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
                sendNotificationEmail(email, 'Three consecutive failed login attempts to your account');
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
            html: `<b>${message}</b>
            <p>
            If you did not make this request please change the password immediately and contact support.
            </p>`
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

module.exports = { registerUser, getUserDetails, updateMembership, handleWrongAttemptCount, updateUserDetails };