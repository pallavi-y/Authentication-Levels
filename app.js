//jshint esversion:6
const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const ejs= require("ejs");
const app = express();

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true});
const userSchema= {
  username:String,
  password:String
};

const User= mongoose.model("User",userSchema);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const username= req.body.username;
  const password= req.body.password;

  const newUser= new User({
    username:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else
    console.log(err);
  });
});
app.listen(3000,function()
{
  console.log("Server started on port 3000");
});
