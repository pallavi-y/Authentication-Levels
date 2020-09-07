//jshint esversion:6

//Requiring the packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const ejs = require("ejs");
const bcrypt = require("bcrypt");

const session = require("express-session");

const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();



app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(session({
  secret: "This is out little secret.",
  resave: false,
  saveUninitialzed: false
}));

//Configuring Passport
app.use(passport.initialize());
app.use(passport.session());


//Connecting to Database
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Schema
const userSchema = new mongoose.Schema( {
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
//initializing passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.render("home");
});

//Login POST and GET
app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

//Register GET and POST
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) {

  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    }
  });
});

//the secrets page, displayed after login.
app.get("/secrets", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
//Logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
//Author :Pallavi
