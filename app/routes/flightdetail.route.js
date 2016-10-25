var express = require('express'),
    router = express.Router(),
    flightController = require('./../controllers/flightdetail.controller');

router
    .get('/:flightCode', function (req, res) {
        flightController.getDistinctBooking(req, res);
    })
    .post('/', function (req, res) {
        flightController.addSampleData(req, res);
    });

module.exports = router;