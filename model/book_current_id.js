/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose');

var bookCurrentIdSchema = new mongoose.Schema({
    currentId: {type:String,uppercase: true,minlength:6,maxlength:6}
});

mongoose.model('BookCurrentId',bookCurrentIdSchema);