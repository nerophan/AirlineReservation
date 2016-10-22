var express = require('express');
var router = express.Router();
var flightController = require('./flight.controller');

router.get('/flights', function(req, res, next) {
    flightController.getFlights(req, res)
});

module.exports = router;
