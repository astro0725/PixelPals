const express = require('express');
const router = express.Router();
const { addGame } = require('../models');
const firebaseAuth = require('../middlewares/firebaseAuth');

router.post('/add-game', firebaseAuth, async (req, res) => {
// router logic here
});

module.exports = router;