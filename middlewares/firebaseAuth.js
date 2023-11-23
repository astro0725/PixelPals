const { auth } = require('firebase-admin');

const firebaseAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header.
        // The token is expected to be in the format: "Bearer [token]"
        const token = req.headers.authorization.split('Bearer ')[1];
        // Verify the token using Firebase Admin SDK.
        // This will throw an error if the token is invalid or expired.
        const decodedToken = await auth().verifyIdToken(token);
        // Attach the user's Firebase UID to the request object.
        // This makes them accessible in subsequent middleware and route handlers
        req.firebaseUserId = decodedToken.uid;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

module.exports = firebaseAuth;