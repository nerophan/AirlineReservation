var express = require('express');
var router = express.Router();
var bookingController = require('./../controllers/booking.controller');

router
    .get('/', function (req, res) {
        bookingController.getBookingList(res, res)
    })
    .get('/:id', function(req, res, next) {
        bookingController.get(req,res);
    })
    .post('/', function (req, res, next) {
        bookingController.add(req,res);
    });

module.exports = router;

