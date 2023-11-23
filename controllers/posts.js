const { Post } = require("../models/post");
const multer = require('multer');
const path = require('path');

// multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Set the destination for file uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// define a function to filter file types that are allowed for upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4/;
    const isAccepted = allowedTypes.test(file.mimetype) || allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isAccepted) {
        return cb(null, true); // accept the file
    } else {
        cb(new Error('Unsupported file type!'), false); // reject the file
    }
};

// configure multer with storage, file filter, and size limits
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit for file size
    }
});

// defining post logic for creating a post
const createPost = async (req, res) => {
    try {
        const firebaseUserId = req.firebaseUserId;
        const { body } = req.body;
        const imageUrl = req.files['image'] ? req.files['image'][0].path : null;
        const videoUrl = req.files['video'] ? req.files['video'][0].path : null;
        const newPost = await Post.create({
            body,
            imageUrl,
            videoUrl,
            firebaseUserId: firebaseUserId
            });
        res.json(newPost);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Validation error', error: error.message });
        } else {
            return res.status(500).json({ message: 'Error creating post', error: error.message });
        }
    }
};

// define a function for deleting a post
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const firebaseUserId = req.firebaseUserId 

        // First, find the post to check if it exists and belongs to the user
        const post = await Post.findOne({
            where: {
                id: postId,
                firebaseUserId: firebaseUserId
            }
        });

        if (!post) {
            // No post found
            return res.status(404).json({ message: 'No post found with this id' });
        }
        // Post exists and belongs to the current user, proceed with deletion
        await post.destroy();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostsByUser = async (req, res) => {
    try {
        const firebaseUserId = req.firebaseUserId;
        const posts = await Post.findAll({ 
            where: { firebaseUserId }, 
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    upload,
    createPost,
    deletePost,
    getPostsByUser,
};