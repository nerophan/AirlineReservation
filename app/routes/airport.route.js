/**
 * Created by hoang on 10/23/2016.
 */
var express = require('express');
var router = express.Router();
var airportController = require('./../controllers/airport.controller');

router
    .get('/', function(req, res, next) {
        airportController.get(req,res);
    })
    .post('/', function (req, res, next) {
        airportController.add(req,res);
    });

module.exports = router;
