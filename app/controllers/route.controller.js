var mongoose = require('mongoose'),
    Route = mongoose.model('Route');

module.exports.getRouteFromDepartureAirport = function (departAirport, callback) {
    Route.find({from: departAirport}, function (err, routes) {
        callback(err, routes);
    });
};

module.exports.add = function (req, res) {
    var route = req.body;
    Route.create(route, function (err, route) {
        if (err)
            res.end(err);
        else res.json(route);
    });
};