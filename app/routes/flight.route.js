var express = require('express');
var router = express.Router();
var flightController = require('./../controllers/flight.controller');

router
    .get('/', function(req, res, next) {
        flightController.getAllFlights(req, res);
    })
    .post('/', function (req, res, next) {
        flightController.addFlights(req, res);
    })
    .delete ('/', function (req, res, next) {
        flightController.clearFlightData(req, res);
    })
    .get('/search', function (req, res, next) {
      flightController.getFlights(req, res);
    });

module.exports = router;
