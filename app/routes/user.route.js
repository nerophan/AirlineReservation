var express = require('express');
var router = express.Router();
var userController = require('./../controllers/user.controller');

router.post('/authenticate', function (req, res) {
  userController.authenticate(req, res);
});

module.exports = router;
