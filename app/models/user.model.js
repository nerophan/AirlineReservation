/**
 * Created by apismantis on 01/11/2016.
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean
});

mongoose.model('User', userSchema);
