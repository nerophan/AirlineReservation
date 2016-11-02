var express = require('express');
var router = express.Router();
var flightController = require('./../controllers/flight.controller'),
    accountController = require('./../controllers/account.controller');

router
    .get('/', function(req, res, next) {
        flightController.getAllFlights(req, res);
    })
    .post('/', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res, next) {
        flightController.addFlight(req, res);
    })
    .delete ('/', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res, next) {
        flightController.clearFlightData(req, res);
    })
    .get('/search', function (req, res, next) {
      flightController.getFlights(req, res);
    })
    .get('/list', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res) {
        flightController.getDistinctFlights(req, res);
    });

module.exports = router;
