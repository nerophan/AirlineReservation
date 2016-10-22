/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var flightDetailSchema = new mongoose.Schema({
    bookingCode: String,
    flightCode: String,
    date: {
        type: Date,
        default: Date.now
    },
    class: String,
    priceLevel: String
});

mongoose.model('FlightDetail', flightDetailSchema);