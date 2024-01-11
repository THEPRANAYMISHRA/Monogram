const { PostModel } = require("../models/post.model");
const { CommentModel } = require('../models/comment.model');

const postContent = async (req, res) => {
    try {
        const { title, author } = req.body;
        const newPost = await PostModel({
            title: title,
            imageUrl: `https://monogram.onrender.com/${req.file.filename}`,
            author: author
        })
        await newPost.save();
        res.status(200).send({ message: 'Post uploaded' });
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: "Post couldn't be uploaded" });
    }
}


const getPost = async (req, res) => {
    const limit = 3;
    const currentPage = req.query.page || 1;
    const skip = (Number(currentPage) - 1) * limit;

    try {
        const posts = await PostModel.aggregate([
            { $sort: { date: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalPosts = posts.length;

        // Populate comments after the aggregation
        await PostModel.populate(posts, {
            path: 'comments'
        });

        return res.status(200).send({ data: posts, totalPosts, currentPage, totalPages: Math.ceil(totalPosts / limit) });
    } catch (error) {
        console.log("while fetching posts ", error);
        return res.status(500).send({ message: error });
    }
}

const getNews = async (req, res) => {
    try {
        let res = await axios.get(
            `https://newsapi.org/v2/everything?q=technology&sortBy=latest&limit=5&apiKey=${process.env.news_api}`
        );
        return res.status(200).send({ "data": res })
    } catch (error) {
        console.log(error);
        return res.status(400).send({ "erorr": error })
    }
}

const createComment = async (req, res) => {
    const { postId, commentText } = req.body;
    try {
        let post = await PostModel.findById(postId)
        if (!post) {
            return res.status(400).send({ "msg": 'No such post found' });
        } else {
            let newComment = new CommentModel({ comment: commentText }); // Corrected this line
            await post.comments.push(newComment["_id"])
            await post.save()
            await newComment.save();
            return res.status(201).send({ "msg": "comment is added" });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ "msg": error.message });
    }
}

module.exports = { postContent, getPost, createComment, getNews }