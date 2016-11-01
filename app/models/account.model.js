/**
 * Created by apismantis on 01/11/2016.
 */

var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    admin:  {
        type: Boolean,
        default: false
    }
});

mongoose.model('Account', accountSchema);
