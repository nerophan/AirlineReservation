/**
 * Created by hoang on 10/12/2016.
 */

var mongoose = require('mongoose');

var fromAirportSchema = new mongoose.Schema({
    nhom: String,
    ma: {type:String, uppercase: true, minlength:3,maxlength:3,trim:true},
    ten: {type:String,trim:true}
});

mongoose.model('FromAirport',fromAirportSchema);