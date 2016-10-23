var express = require('express'),
    router = express.Router(),
    flightController = require('./../controllers/flightdetail.controller');

router
    .post('/', function (req, res) {
        flightController.addSampleData(req, res);
    });

module.exports = router;