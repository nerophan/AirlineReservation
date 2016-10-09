/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var passengerSchema = new mongoose.Schema({
    ma: String,
    danhxung: String,
    ho: String,
    ten: String
});

mongoose.model('Passenger',passengerSchema);