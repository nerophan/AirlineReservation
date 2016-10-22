/**
 * Created by hoang on 10/8/2016.
 */
var config = require('./config'),
    chalk = require('chalk'),
    mongoose = require('mongoose');

module.exports.connect = function () {
    mongoose.connect(config.db.uri, function (err) {
        // Log Error
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(err);
        } else {
            // Enabling mongoose debug mode if required
            mongoose.set('debug', config.db.debug);
        }
    });
};

module.exports.disconnect = function () {
    mongoose.disconnect(function (err) {
        console.info(chalk.yellow('Disconnected from MongoDB.'));
    });
};
