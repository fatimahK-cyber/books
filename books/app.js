// main modules required for the project
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// modules for mongoose and mongoDB connection
let mongoose = require('mongoose');
let db = require('./config/db');

// modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors');
let GoogleStrategy = require('passport-google-oauth20').Strategy;

// define the User Model
let userModel = require('./models/user');
let User = userModel.User;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// connect to MongoDB
mongoose.connect(db.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB');
});

//set up session management
app.use(
  session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false
  })
);

//initialize flash
app.use(flash());

//user authentication (Local)
passport.use(User.createStrategy());
//serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "1097298382137-eh0disj30snshngabsh09dorot84kv1n.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://books-q5q7.onrender.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            username: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub OAuth Strategy - updated for Mongoose 7
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: 'Ov23likleZOaiDIzII8q',
    clientSecret: 'b0d9a6debc2beb4e2ec8afd89ff90fa7b9cadc4c',
    callbackURL: 'https://books-q5q7.onrender.com/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // GitHub may not return email
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;

      // Check if user exists
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        // If email is required in schema, you must provide a placeholder or make field optional
        user = new User({
          username: profile.username,
          displayName: profile.displayName || profile.username,
          githubId: profile.id,
          email: email || `${profile.username}@github.com` // placeholder if no email
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));



//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());

//path to public folder and node modules
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let readRouter = require('./routes/read');

//routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', readRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', {
    title: "Error",
    message: err.message,
    error: err
  });
});

module.exports = app;
