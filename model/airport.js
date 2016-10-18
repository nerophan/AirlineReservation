/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

var airportSchema = new mongoose.Schema({
    nhom: String,
    ma: {type:String, uppercase: true, minlength:3,maxlength:3,trim:true},
    ten: {type:String,trim:true}
});

mongoose.model('Airport',airportSchema);