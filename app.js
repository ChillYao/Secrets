//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//Serving static files in Express
app.use(express.static("public"));

//把view engine设为ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

//用 "views/home" 装饰 '/'
app.get('/', function (req, res){
  res.render("home");
});

//用 "views/login" 装饰 '/'
app.get('/login', function (req, res){
  res.render("login");
});

//用 "views/login" 装饰 '/'
app.get('/register', function (req, res){
  res.render("register");
});

//接收用户名密码
app.post('/register', function (req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function (err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post('/login', function (req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if (foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });

});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
