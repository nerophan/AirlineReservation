/**
 * Created by apismantis on 01/11/2016.
 */
var async = require('async');

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('./../config/config'),
    Account = mongoose.model('Account'),
    accountController = require('./../controllers/account.controller');

module.exports.addSampleData = function (req, res) {
    var accounts = [
        {
            username: 'admin',
            password: 'admin',
            admin: true
        },
        {
            username: 'user',
            password: '123456',
            admin: false
        }];

    Account.create(accounts, function (err, account) {
        if (err) throw err;

        if (account)
            res.json({message: 'Add success!'});
    });
};

// Login account
module.exports.login = function (req, res) {

    console.log(req);

    // Find user
    Account.findOne({username: req.body.username}, function (err, acc) {

        // User not found
        if (err)
            res.status(401).json({success: false, message: "An error has occurred: " + err.message});

        // Wrong username
        if (!acc) {
            res.status(401).json({success: false, message: 'Authentication failed. Wrong username.'})
        }
        // Wrong password
        else if (req.body.password != acc.password) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. Wrong password'
            });
        }
        else {

            // Get token
            var token = jwt.sign(acc, config.secretKey, {expiresIn: 60 * 60 * 24});

            // Response token
            res.json({
                success: true,
                message: 'Authentication successful',
                token: token,
                acc: acc.toJSON()
            });
        }
    })
};

// Authenticate with the token provide by client
module.exports.authenticate = function (req, res, next) {

    var token = req.params.token || req.query.token || req.headers.token;
    console.log("JWT: " + token);

    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: "Authentication failed. Detail: " + err.message
                });
            } else {
                console.log(decoded.acc);
                req.user = decoded.acc;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Missing token or in incorrect format."
        });
    }
};

// Sign up accounts
module.exports.signUp = function (req, res) {

    // Find user
    Account.findOne({username: req.body.username}, function (err, acc) {
        if (err) {
            res.json(err);
        }

        // User not found
        if (!acc) {
            // Add new account to database
            var newAcc = new Account({username: req.body.username, password: req.body.password});
            newAcc.save(function (err, data) {
                if (err)
                    res.json({success: false, message: "An error has occurred: " + err.message});

                // Sign up success -> login
                accountController.login(req, res);
            })
        }

        // Acc has in database
        else {
            res.json({success: false, message: 'This username is not available!'});
        }
    });
};



