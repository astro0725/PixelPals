const { Post } = require('../models/post.js');

async function createPost(req, res) {
    try {
        const { content } = req.body;
        const firebaseUserId = req.firebaseUserId;

        if (!content) {
            return res.status(400).send({
                message: "Content cannot be empty."
            });
        }

        const newPost = {
            firebaseUserId: firebaseUserId,
            content: content,
            createdAt: new Date()
        };

        const post = await Post.create(newPost);

        res.status(201).send({
            message: "Post created successfully.",
            post: post
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send({
            message: "Some error occurred while creating the post."
        });
    }
};

module.exports = {
    createPost,
};