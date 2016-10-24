/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

var airportSchema = new mongoose.Schema({
    country: String,
    code: {
        type: String,
        uppercase: true,
        minlength: 3,
        maxlength: 3,
        trim: true,
        unique: true
    },
    name: {
        type: String,
        trim: true
    }
});

mongoose.model('Airport', airportSchema);