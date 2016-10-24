/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
    code: String,
    depart: String,
    arrive: String,
    departAt: {
        type: Number,
        default: new Date().getTime()
    },
    arriveAt: {
        type: Number,
        default: new Date().getTime() + 3 * 3600 * 1000
    },
    class: String,
    priceLevel: String,
    numberOfSeat: Number,
    price: Number
});
// var flightSchema = new mongoose.Schema({
//     planeId: String,
//     datetime: {
//         type: Date,
//         default: new Date().getTime()
//     },
// });

mongoose.model('Flight', flightSchema);
