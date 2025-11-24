// Import express, router, passport, and database connections
var express = require('express');
var router = express.Router();
var passport = require('passport');

let db = require('../config/db');
let userModel = require('../models/user');
let User = userModel.User;

// Home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Readist' });
});

// Add page
router.get('/add', function(req, res, next) {
  res.render('add', { title: 'add' });
});

// Login page
router.get('/login', function(req,res,next){
  if(!req.user)
  {
    res.render('authentication/login',
      {
      title:'Login',
      message: req.flash('loginMessage')
      }
    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Login form submit
router.post('/login', function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err);
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError');
      return res.redirect('/login');
    }
    req.login(user,(err)=>{
    if(err)
    {
      return next(err);
    }
    return res.redirect("/books")
    })
  })(req,res,next)
});

// Register page
router.get('/register', function(req,res,next){
  if(!req.user)
  {
    res.render('authentication/register',
      {
      title:'Register',
      message: req.flash('registerMessage')
      }
    )
  }
  else
  {
    return res.redirect("/")
  }
});

// Register form submit
router.post('/register', function(req,res,next){
  let newUser = new User({
    username: req.body.username,
    email:req.body.email,
    displayName: req.body.displayName
  })
  User.register(newUser, req.body.password, (err)=>{
    if(err)
    {
      console.log("Error:Inserting the new user");
      if(err.name=="UserExistingError")
      {
        req.flash('registerMessage','Registration Error:User already Exist');
      }
      return res.render('authentication/register',
        {
          title:'Register',
          message:req.flash('registerMessage')
        }
      )
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect("/books");
      })
    }
  })
});

// Logout
router.get('/logout',function(req,res,next){
req.logout(function(err)
{
  if(err)
  {
    return next(err)
  }
})
res.redirect("/");
})

module.exports = router;
