
var express = require('express'),
    router = express.Router(),
    airportController = require('./../controllers/airport.controller'),
    accountController = require('./../controllers/account.controller');

router
    .get('/', function (req, res) {
        airportController.getAirports(req, res);
    })
    .post('/', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res) {
        airportController.addSampleData(req, res);
    })
    .get('/:airportCode', function (req, res) {
        airportController.getAirportDetail(req.params.airportCode, function (err, airportDetail) {
            res.json(airportDetail);
        })
    });

module.exports = router;
