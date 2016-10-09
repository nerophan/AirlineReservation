/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var flightDetailSchema = new mongoose.Schema({
    ma: String,
    machuyenbay: String,
    ngay:Date,
    hang: String,
    mucgia: String
});

mongoose.model('FlightDetail',flightDetailSchema);