const express = require('express')
const cors = require('cors');
const cron = require('node-cron');
const { connection } = require('./db')
const { postRouter } = require('./routes/post.route');
const { userRouter } = require('./routes/user.route');
const app = express()
app.use(cors())
app.use(express.json({ extended: false }));
app.use(express.json())
app.use(express.static('uploads'))

const { UserModel } = require('./models/user.model');
const { paymentsRouter } = require('./routes/payments');

// Schedule a job to run every day
cron.schedule('0 0 * * *', async () => {
    // Finding users whose last post was more than 24 hours ago
    const usersToReset = await UserModel.find({
        lastPostTimestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        membership: { $in: ['Silver', 'Basic'] },
    });

    // Reseting postsCount for every user
    usersToReset.forEach(async (user) => {
        user.postsCount = 0;
        user.lastPostTimestamp = null;
        await user.save();
    });

    console.log('Post counts reset for users:', usersToReset.map((user) => user._id));
});


app.use("/payment", paymentsRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)
app.get("/health", (req, res) => {
    return res.status(200).send({ "message": "health is fine!" })
})

app.listen(4500, async () => {
    try {
        await connection
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }

    console.log('server is running at 4500');
})