var mongoose = require('mongoose'),
    Route = mongoose.model('Route');

module.exports.getRouteFromDepartureAirport = function (departAirport, callback) {
    Route.find({from: departAirport}, function (err, routes) {
        callback(err, routes);
    });
};