var express = require('express');
var router = express.Router();
var User = require('../models/user').User;

/* GET users listing (placeholder). */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Users' });
});

module.exports = router;
