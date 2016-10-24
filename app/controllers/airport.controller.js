/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');

require('../models/airport.model');
require('../models/route.model');

var Airport = mongoose.model('Airport');
var Route = mongoose.model('Route');

var airport = {};

airport.get = function (req, res) {
    //var airportId = req.params.id;
    var airportId = req.query.dep;
    var result = {};

    if (airportId == null) {
        Airport.find().exec(function(err,data){
            console.log(data);
        });
    } else {
        var toAirportList = new Array();
        Route.find({'depart': airportId}, '-_id arrive', function (err, data) {
            if (err) {
                console.log('No arrival airport found');
                return;
            }
            for (var i = 0; i < data.length; i++) {
                toAirportList.push(data[i].noiden);
            }
            Airport.find({'ma': {$in: toAirportList}}, function (err, data) {
                if (err) {
                    res.status(404).send({"error": "Error finding departure airport"});
                } else {
                    res.status(200).json(data);
                }
            })
        });
    }
};

airport.add = function (req, res) {
    var data = req.body;
    Airport.create(data, function (err, rs) {
        if (err) {
            res.status(400).send(err);
        } else {
            airport.get(req, res);
        }
    });
}

airport.addFlightCode = function (req, res) {
    var fromAirportId = req.params.id;
    var data = req.body;
    data.noidi = fromAirportId;
    Route.create(data, function (err, rs) {
        if (err) {
            res.status(403).send({"Error":"Error adding arrival"});
        } else {
            airport.get(req, res);
        }
    });
};

module.exports = airport;
