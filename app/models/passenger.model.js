/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var passengerSchema = new mongoose.Schema({
    bookingCode: String,
    title: String,
    lastName: String,
    firstName: String
});

mongoose.model('Passenger', passengerSchema);