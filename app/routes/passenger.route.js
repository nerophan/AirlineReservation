var express = require('express'),
    router = express.Router(),
    passengerController = require('./../controllers/passenger.controller');

router
    .post('/', function(req, res) {
        passengerController.addSampleData(req, res);
    });

module.exports = router;
