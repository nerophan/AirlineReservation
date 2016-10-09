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

var bookSchema = new mongoose.Schema({
    ma: String,
    thoigiandatcho: {type:Date,default: Date.now},
    tongtien: Number,
    trangthai: Number
});

var flightDetailSchema = new mongoose.Schema({
    ma: String,
    machuyenbay: String,
    ngay:Date,
    hang: String,
    mucgia: String
});

var passengerSchema = new mongoose.Schema({
    ma: String,
    danhxung: String,
    ho: String,
    ten: String
});

mongoose.model('Fight',flightSchema);
mongoose.model('Book',bookSchema);
mongoose.model('FlightDetail',flightDetailSchema);
mongoose.model('Passenger',passengerSchema);
