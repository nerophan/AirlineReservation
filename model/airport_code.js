/**
 * Created by hoang on 10/9/2016.
 */
var mongoose = require('mongoose');

var airportSchema = new mongoose.Schema({
    ma: {type:String, uppercase: true, minlength:3,maxlength:3,trim:true},
    tensanbay: {type:String,trim:true},
    tendiadiem: {type:String,trim:true}
});

mongoose.model('Airport',airportSchema);