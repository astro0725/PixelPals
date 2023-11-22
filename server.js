const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ defaultLayout: "main" });
const firebase = require("firebase/app");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const firebaseApp = firebase.initializeApp(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pixel-pals-fdb7e-default-rtdb.firebaseio.com",
});

// Create a CSRF middleware that will add a CSRF token to all requests
const csrfMiddleware = csrf({ cookie: true });

// Create an express application with port number from environment variable or default 3001
const PORT = process.env.PORT || 3001;
const app = express();

// Configure Handlebars as the view engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// serve the files out of ./public as our main files
app.use(express.static("public"));

// use the body parser middleware to parse the body of incoming requests
app.use(bodyParser.json());
// use the cookie parser middleware to parse cookies
app.use(cookieParser());
// use the CSRF middleware to add CSRF tokens to requests
app.use(csrfMiddleware);

// routing middleware that directs all requests to the appropriate route
// middleware to generate cookie with XSRF token
// next() is called to continue to the next middleware
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});
// login route that renders the login page
app.get("/login", async (req, res) => {
  try {
    res.render("loginPage");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to login");
  }
});
// signup route that renders the signup page
app.get("/signup", async (req, res) => {
  try {
    res.render("signupPage");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load signup page");
  }
});
// profile route that renders the profile page
app.get("/profile", async function (req, res) {
  try {
    const sessionCookie = req.cookies.session || "";

    const userData = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */);
    console.log("Logged in:", userData.email);
    res.render("profilePage");
  } catch (error) {
    res.redirect("/login");
  }
});
// index route that renders the feed page
app.get("/", async (req, res) => {
  try {
    res.render("feed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.get("/search", async (req, res) => {
  try {
    res.render("search");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// route that creates new user session cookies
app.post("/sessionLogin", async (req, res) => {
  try {
    const idToken = req.body.idToken.toString();
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // create the session cookie
    // uses the Firebase Admin SDK to verify the ID token and decode its claims
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    // set cookie policy for session cookie
    // cookie expires after 5 days and is only in the backend
    const options = { maxAge: expiresIn, httpOnly: true };
    res.cookie("session", sessionCookie, options);
    res.end(JSON.stringify({ status: "success" }));
  } catch (error) {
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

app.get("/sessionLogout", async (req, res) => {
  try {
    res.clearCookie("session");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to logout");
  }
});

app.get("/searchPopulate", async (req, res) => {
  try {
    const users = await fetchRandomUsers(5);
    const posts = await fetchRandomPosts(10);

    res.json({ users, posts });
  } catch (error) {
    res.status(500).send("Error fetching initial data");
  }
});

// partial registration
hbs.handlebars.registerPartial("header", "./views/partials/header.handlebars");
hbs.handlebars.registerPartial("footer", "./views/partials/sidebar.handlebars");
hbs.handlebars.registerPartial(
  "createPost",
  "./views/partials/createPost.handlebars"
);
hbs.handlebars.registerPartial("search", "./views/partials/search.handlebars");
// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
