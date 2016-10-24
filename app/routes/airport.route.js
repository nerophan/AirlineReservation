
var express = require('express'),
    router = express.Router(),
    airportController = require('./../controllers/airport.controller');

router
    .get('/', function (req, res) {
        airportController.getAirports(req, res);
    })
    .post('/', function (req, res) {
        airportController.add(req, res);
    })
    .get('/:airportCode', function (req, res) {
        airportController.getAirportDetail(req.params.airportCode, function (err, airportDetail) {
            res.json(airportDetail);
        })
    });

module.exports = router;
