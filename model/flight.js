/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
    ma:String,
    noidi:String,
    noiden:String,
    ngaygio: {type:Date,default: Date.now},
    hang: String,
    mucgia: String,
    soluongghe: Number,
    giaban: Number
});

mongoose.model('Flight',flightSchema);