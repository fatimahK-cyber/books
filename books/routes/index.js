var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Readist' });
});

router.get('/', function(req, res, next) {
  res.render('add', { title: 'Add Book' });
});

router.get('/', function(req, res, next) {
  res.render('books', { title: 'My Books' });
});

module.exports = router;
