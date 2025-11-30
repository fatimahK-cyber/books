var express = require('express');
var router = express.Router();
const passport = require('passport');
let userModel = require('../models/user');
let User = userModel.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    displayName: req.user ? req.user.displayName : "" 
  });
});

/* GET Add page. */
router.get('/add', function(req, res, next) {
  res.render('add', { 
    title: 'Add',
    displayName: req.user ? req.user.displayName : "" 
  });
});

// ---------------- Local Auth ---------------- //

// Login page
router.get('/login', function(req, res, next) {
  if (!req.user) {
    res.render('authentication/login', {
      title: 'Login',
      message: req.flash('loginMessage')
    });
  } else {
    return res.redirect('/');
  }
});

// Login form submit
router.post('/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('loginMessage', 'AuthenticationError');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/books');
    });
  })(req, res, next);
});

// Register page
router.get('/register', function(req, res, next) {
  if (!req.user) {
    res.render('authentication/register', {
      title: 'Register',
      message: req.flash('registerMessage')
    });
  } else {
    return res.redirect('/');
  }
});

// Register form submit
router.post('/register', function(req, res, next) {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log("Registration error:", err);
      let message = err.name === "UserExistsError"
        ? "Registration Error: User already exists"
        : "Registration Error: " + err.message;

      req.flash('registerMessage', message);
      return res.render('authentication/register', {
        title: 'Register',
        message: req.flash('registerMessage')
      });
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/books');
    });
  });
});

// Logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

// ---------------- Google OAuth ---------------- //

// Start Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    // Successful login
    res.redirect('/books');
  }
);

module.exports = router;
