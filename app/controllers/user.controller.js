/**
 * Created by apismantis on 01/11/2016.
 */

var mongoose = require('mongoose');
var config = require('./../config/config');
var User = require('./../models/user.model');

module.exports.authenticate = function (req, res) {
    // Find user
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        // Authenticate error
        if (err) throw err;

        // Wrong password
        if (!user) {
            res.json({success: false, message: 'Authentication failed. Wrong password'});
        }
        else {

            // Get token
            var token = jwt.sign(user, config.secretKey, {
                expiresInMinutes: 1440
            });

            // Responde token
            res.json({
                success: true,
                message: 'Authenticate successful',
                token: token
            });
        }
    })
};

