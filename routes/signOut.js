const express = require('express');
const router = express.Router();
const { signOutUser } = require('../controllers/userAuth');

router.post('/', async (req, res) => {
    try {
        await signOutUser();
        res.status(200).send('User signed out successfully');
        res.render('/signIn');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;