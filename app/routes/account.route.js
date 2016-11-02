var express = require('express');
var router = express.Router();
var accountController = require('./../controllers/account.controller.js');


router
    .post('/add-sample-data', function (req, res) {
        accountController.addSampleData(req, res);
    })
    .post('/login', function (req, res) {
        accountController.login(req, res);
    })
    .post('/sign-up', function (req, res) {
        accountController.signUp(req, res);
    })
    .post('/auth', function (req, res, next) {
        accountController.authenticate(req, res, next);
    });

module.exports = router;
