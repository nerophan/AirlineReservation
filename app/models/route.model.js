/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

var routeSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    from: String,
    to: String
});

mongoose.model('Route', routeSchema);
