const { PostModel } = require("../models/post.model");
const { CommentModel } = require('../models/comment.model');
const axios = require('axios');

const postContent = async (req, res) => {
    try {
        const { title, author } = req.body;
        const newPost = await PostModel.create({
            title,
            imageUrl: `https://monogram.onrender.com/${req.file.filename}`,
            author,
        });
        res.status(200).send({ message: 'Post uploaded' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Post couldn't be uploaded" });
    }
};

const getPost = async (req, res) => {
    const limit = 3;
    const currentPage = req.query.page || 1;
    const skip = (Number(currentPage) - 1) * limit;

    try {
        const posts = await PostModel
            .find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .populate('comments')
            .exec();

        const totalPosts = await PostModel.countDocuments();

        res.status(200).send({
            data: posts,
            totalPosts,
            currentPage,
            totalPages: Math.ceil(totalPosts / limit),
        });
    } catch (error) {
        console.error("while fetching posts ", error);
        res.status(500).send({ message: error.message });
    }
};

const getNews = async (req, res) => {
    try {
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=technology&sortBy=latest&limit=5&apiKey=${process.env.news_api}`
        );
        res.status(200).send({ data: response.data });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
};

const createComment = async (req, res) => {
    const { postId, commentText } = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(400).send({ msg: 'No such post found' });
        } else {
            const newComment = await CommentModel.create({ comment: commentText });
            post.comments.push(newComment["_id"]);
            await post.save();
            res.status(201).send({ msg: "comment is added" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: error.message });
    }
};

module.exports = { postContent, getPost, createComment, getNews };
