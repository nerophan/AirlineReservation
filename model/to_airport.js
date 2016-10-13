/**
 * Created by hoang on 10/12/2016.
 */

var mongoose = require('mongoose');

var toAirportSchema = new mongoose.Schema({
    masanbaydi:{type:String, uppercase: true, minlength:3,maxlength:3,trim:true},
    nhom: String,
    ma: {type:String, uppercase: true, minlength:3,maxlength:3,trim:true},
    ten: {type:String,trim:true}
});

mongoose.model('ToAirport',toAirportSchema);