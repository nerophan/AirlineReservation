var express = require('express');
var router = express.Router();
var bookingController = require('./../controllers/booking.controller'),
    accountController = require('./../controllers/account.controller');

router
    .get('/', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res) {
        bookingController.getBookingList(req, res);
    })
    .get('/:id', function (req, res, next) {
        accountController.authenticate(req, res, next);
    }, function (req, res, next) {
        bookingController.get(req, res);
    })
    .post('/', function (req, res, next) {
        bookingController.add(req, res);
    });

module.exports = router;

