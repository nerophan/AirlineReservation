/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

var flightCodeSchema = new mongoose.Schema({
    ma:String,
    noidi:String,
    noiden:String
});

mongoose.model('FlightCode',flightCodeSchema);
