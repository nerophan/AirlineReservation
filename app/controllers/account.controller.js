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
        if(err) throw err;

        if(account)
            res.json({message: 'Add success!'});
    });
};

// Login accounts
module.exports.login = function (req, res) {

    console.log(req);

    // Find user
    Account.findOne({username: req.body.username}, function (err, acc) {

        // User not found
        if (err)
            res.status(404).json(err);

        // Wrong username
        if (!acc) {
            res.json({message: 'Authentication failed. Wrong username.'})
        }
        // Wrong password
        else if (req.body.password != acc.password) {
            res.status(403).json({
                success: false,
                message: 'Authentication failed. Wrong password'
            });
        }
        else {

            // Get token
            var token = jwt.sign(acc, config.secretKey);

            // Responde token
            res.status(200).json({
                success: true,
                message: 'Authenticate successful',
                token: token,
                acc: acc.toJSON()
            });
        }
    })
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
                    res.json(err);

                // Sign up success -> login
                accountController.login(req, res);
            })
        }

        // Acc has in database
        else {
            res.json({message: 'This username is not available!'});
        }
    });
};

