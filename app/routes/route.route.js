
var express = require('express'),
    router = express.Router(),
    routeController = require('./../controllers/route.controller'),
    accountController = require('./../controllers/account.controller');

router
    .get('/', function (req, res) {
        routeController.getAllRoute(req, res);
    })
    .post('/', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res) {
        routeController.add(req, res);
    });

module.exports = router;
