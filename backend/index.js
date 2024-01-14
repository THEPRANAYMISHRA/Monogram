const express = require('express')
const cors = require('cors');
const { connection } = require('./db')
const { postRouter } = require('./routes/post.route');
const { userRouter } = require('./routes/user.route');
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))

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