/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    ma: String,
    thoigiandatcho: {type:Date,default: Date.now},
    tongtien: Number,
    trangthai: {type:Number, default:0}
});

mongoose.model('Book',bookSchema);