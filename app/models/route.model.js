/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

var routeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    depart: String,
    arrive: String
});

mongoose.model('Route', flightCodeSchema);
