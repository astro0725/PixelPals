const express = require('express');
const router = express.Router();

// Import individual route modules
const signInRoutes = require('./signIn');
const signUpRoutes = require('./signUp');
const signOutRoutes = require('./signOut');
const profileRoutes = require('./profile');

// Use the imported routes
router.use('/signin', signInRoutes);
router.use('/signup', signUpRoutes);
router.use('/signout', signOutRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
