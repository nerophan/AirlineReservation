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

    if (route.from == route.to) {
        res.status(422).send("Invalid route, departure and arrival are the same airport.");
        return;
    }

    Route.find({"from": route.from, "to": route.to}, function (err, data) {
        if (err || data.length > 0) {
            res.status(400).json({"error": "Route existed"});
            return
        } else {
            route.code = route.from + route.to;
            Route.create(route, function (err, route) {
                if (err)
                    res.status(422).send(err);
                else res.json(route);
            });
        }
    });
};
