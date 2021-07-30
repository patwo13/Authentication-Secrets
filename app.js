//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

//define user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

//define user model
const User = new mongoose.model("User", userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });

  user.save(function(err){
    if(!err){
      console.log("Successfully registerd");
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
        else{
          console.log("Incorrect username or password");
        }
      }
      else{
        console.log("Incorrect username or password");
      }
    }else{
      console.log("User not exist");
    }
  })
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});
