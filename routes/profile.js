const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

router.get('/profile', async (req, res) => {
    try {
        const sessionCookie = req.cookies.session || "";
        const userData = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
        console.log("Logged in:", userData.email);
        res.render("profile");
    } catch (error) {
        res.redirect("/signup");
    }
});

module.exports = router;