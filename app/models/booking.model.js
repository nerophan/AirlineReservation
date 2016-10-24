/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
    code: {
        type: String,
        uppercase: true,
        minlength: 6,
        maxlength: 6,
        unique: true
    },
    bookedAt: {
        type: Number,
        default: new Date().getTime()
    },
    price: Number,
    status: {
        type: Number,
        default: 0
    }
});

mongoose.model('Booking', bookingSchema);