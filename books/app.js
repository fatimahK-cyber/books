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

// define the User Model
let userModel = require('./models/user');
let User = userModel.User;



var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



// import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let readRouter = require('./routes/read');



// connect to MongoDB
mongoose.connect(db.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', ()=> {
  console.log('Connected to MongoDB');
})

//set up session management
app.use(session({
  secret:"SomeSecret"
  ,saveUninitialized: false
  ,resave: false
}))

//initialize flash
app.use(flash());

//user authentication
passport.use(User.createStrategy());
//serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//path to public folder and node modules
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', readRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { 
        title: "Error",  // <-- define title here
        message: err.message, 
        error: err 
    });
});



module.exports = app;
