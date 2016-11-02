var express = require('express'),
    router = express.Router(),
    flightController = require('./../controllers/flightdetail.controller'),
    accountController = require('./../controllers/account.controller');

router
    .get('/:flightCode', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res) {
        flightController.getDistinctBooking(req, res);
    })
    .post('/', function (req, res) {
        flightController.addSampleData(req, res);
    });

module.exports = router;