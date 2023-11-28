const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth.js');
const postsController = require('./posts');

router.post('/', firebaseAuth, postsController.createPost);

module.exports = router;
