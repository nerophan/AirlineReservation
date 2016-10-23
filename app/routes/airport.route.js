var express = require('express'),
    router = express.Router(),
    airportController = require('./../controllers/airport.controller');

router
    .get('/', function (req, res) {
        airportController.getDepartureAirports(req, res);
    })
    .post('/', function (req, res) {
        airportController.addSampleData(req, res);
    });


module.exports = router;
