/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var flightDetailSchema = new mongoose.Schema({
    madatcho: String,
    machuyenbay: String,
    ngay:{type:Date,default: Date.now},
    hang: String,
    mucgia: String,
    soluong:{type:Number,default:1}
});

mongoose.model('FlightDetail',flightDetailSchema);