var mongoose = require('mongoose'),
    Route = mongoose.model('Route');

module.exports.getRouteFromDepartureAirport = function (departAirport, callback) {
    Route.find({from: departAirport}, function (err, routes) {
        callback(err, routes);
    });
};

module.exports.getAllRoute = function (req, res) {
    Route.find({}, function (err, routes) {
        if (err)
            res.end(err);
        else res.json(routes);
    });
};

module.exports.add = function (req, res) {
    var route = req.body;
    console.log(route);
    Route.create(route, function (err, route) {
        if (err)
            res.send(err);
        else res.json(route);
    });
};
