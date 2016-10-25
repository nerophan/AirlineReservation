var express = require('express'),
    router = express.Router(),
    passengerController = require('./../controllers/passenger.controller');

router
    .get('/', function(req, res) {
        passengerController.get(req,res);
    });

module.exports = router;
