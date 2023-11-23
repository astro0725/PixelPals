const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const db = require("../models");
const User = db.User;

// initialize firebase authentication
const auth = getAuth();

// function to sign up a new user with email and password
async function signUpUser(email, password, username) {
    try {
        // attempts to create a new user with provided email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // extract the user information from the user credentials
        const firebaseUser = userCredential.user;
        await User.create({ username, firebaseUserId: firebaseUser.uid });
        // log the user info
        console.log("User created in Firebase and database:", firebaseUser);
    } catch (error) {
        // logs the error using firebase error codes and messages
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during sign up:", errorCode, errorMessage);
    }
}

// function to sign in an existing user with email and password
async function signInUser(email, password) {
    try {
        // attempts to sign in an existing user with provided email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during sign in:", errorCode, errorMessage);
    }
}

// function to sign out the currently signed-in user
async function signOutUser() {
    try {
        // attempts to sign out the currently signed-in user by getting the auth object from firebase
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during sign out:", errorCode, errorMessage);
    }
}

module.exports = {
    signUpUser,
    signInUser,
    signOutUser
};