var express = require('express'),
    router = express.Router(),
    bookingController = require('./../controllers/booking.controller');

router
    .post('/', function (req, res) {
        bookingController.addSampleBooking(req, res);
    });

module.exports = router;



