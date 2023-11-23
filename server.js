const firebase = require('firebase/app');
const auth = require('firebase/auth');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ defaultLayout: "main" });

const app = express();
// Create an express application with port number from environment variable or default 3001
const PORT = process.env.PORT || 3001;
// initialize firebase
const firebaseConfig = {
  apiKey: "AIzaSyCiZF1VwaJ8d18jp6nJtC2AQnboz1AerYg",
  authDomain: "pixel-pals-fdb7e.firebaseapp.com",
  databaseURL: "https://pixel-pals-fdb7e-default-rtdb.firebaseio.com",
  projectId: "pixel-pals-fdb7e",
  storageBucket: "pixel-pals-fdb7e.appspot.com",
  messagingSenderId: "308630756272",
  appId: "1:308630756272:web:1f7f9e0703c0803b449475",
  measurementId: "G-X42F0TX02X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Configure Handlebars as the view engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// serve the files out of ./public as our main files
app.use(express.static("public"));
// use the body parser middleware to parse the body of incoming requests
app.use(bodyParser.json());
// use the cookie parser middleware to parse cookies
app.use(cookieParser());
// use routes to serve window locations
const routes = require("./routes/index");
app.use('/', routes)
// partial registration
hbs.handlebars.registerPartial('header', './views/partials/header.handlebars');
hbs.handlebars.registerPartial('sidebar', './views/partials/sidebar.handlebars');
// start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
