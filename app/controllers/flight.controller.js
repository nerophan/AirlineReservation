var mongoose = require('mongoose'),
    chalk = require('chalk'),
    FlightDetail = mongoose.model('FlightDetail'),
    Flight = mongoose.model('Flight'),
    flightDetailController = require('./flightdetail.controller'),
    airportController = require('./airport.controller');

// Get all flight
module.exports.getAllFlights = function (req, res) {
    Flight.find({}, function (err, flights) {
        res.json(flights);
    });
};

// Add sample flight data
module.exports.addSampleData = function (req, res) {
    var flights = [
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 5,
            price: 100000,
            departAt: "2016-10-25T13:04:51.247Z",
            arriveAt: "2016-10-25T13:06:30.247Z"
        },
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "F",
            numberOfSeat: 2,
            price: 10000,
            departAt: "2016-10-25T13:04:51.247Z",
            arriveAt: "2016-10-25T13:06:30.247Z"
        },
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "C",
            priceLevel: "G",
            numberOfSeat: 10,
            price: 500000,
            departAt: "2016-10-25T13:04:51.247Z",
            arriveAt: "2016-10-25T13:06:30.247Z"
        },
        {
            code: "BL327",
            depart: "TBB",
            arrive: "SGN",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 100,
            price: 100000,
            departAt: "2016-10-26T13:04:51.247Z",
            arriveAt: "2016-10-26T13:06:45.247Z"
        }
    ];

    flights.forEach(function (flight) {
        flight.departAt = Date.parse(flight.departAt);
        flight.arriveAt = Date.parse(flight.arriveAt);
        var f = new Flight(flight);
        f.save(function (err, f) {
            if (err)
                console.log(err);
            else console.log(f);
        });
    });

    res.end('Add successful');
};

// Clear all flight data in database
module.exports.clearFlightData = function (req, res) {
    Flight.find({}).remove(function (err, data) {
        if (err) {
            console.log(chalk.red(err));
        } else {
            console.log(chalk.green('Clear data successfully'));
            res.end('Clear data successfully');
            console.log(data);
        }
    });
};

function generateFlightCode(departureAirport, arrivalAirport, callback) {
    Flight.find({depart: departureAirport, arrive: arrivalAirport}).distinct('code').exec(function (err, count) {
        console.log(count);
        callback(err, count.length);
    });
}

// Add new flight
module.exports.addFlight = function (req, res) {

    var flightInfo = req.body.flight;
    var tickets = req.body.tickets;

    console.log(tickets);

    generateFlightCode(flightInfo.depart, flightInfo.arrive, function (err, count) {

        var flight = JSON.parse(JSON.stringify(flightInfo));

        if (count > 10 && count < 100)
            count = '0' + count;
        else if (count >= 0 && count < 10)
            count = '00' + count;

        flight.code = flight.depart + flight.arrive + count;

        for (var i = 0; i < tickets.length; i++) {

            flight.price = tickets[i].price;
            flight.class = tickets[i].class;
            flight.priceLevel = tickets[i].priceLevel;
            flight.numberOfSeat = tickets[i].numberOfSeat;

            console.log(flight);
            Flight.create(flight, function (err, rs) {
                if (err)
                    console.log(err);
            });
        }

        res.end('End');
    });
};

// Remove flight from databae
module.exports.deleteFlight = function (req, res) {
    var id = req.params.id;

    // Remove flight
    Flight.remove({_id: id}, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.end('Flight is removed successfully');
        }
    });

    // Remove other related data (passenger, booking...)
    //...
};

var findDepartureFlight = function (conditions, callback) {
    Flight.find({
        depart: conditions.depart,
        arrive: conditions.arrive,
        departAt: {
            $gte: conditions.dateTime,
            $lte: conditions.maxDateTime
        }
    }, function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

var findReturnFlight = function (conditions, callback) {
    Flight.find({
        depart: conditions.depart,
        arrive: conditions.arrive,
        datetime: {
            $gte: conditions.dateTime,
            $lte: conditions.maxDateTime
        }
    }, function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

// Flight search route
// If query.return date != null then it is round trip flight,
module.exports.getFlights = function (req, res) {
    if (req.query.return)
        this.getRoundTripFlights(req, res);
    else
        this.getOneWayFlights(req, res);
};

function getConditionFromQuery(query, returnFlight) {
    var conditions = {};

    if (returnFlight) {
        conditions.depart = query.to;
        conditions.arrive = query.from;
    } else {
        conditions.depart = query.from;
        conditions.arrive = query.to;
    }

    if (returnFlight) {
        conditions.dateTime = Date.parse(query.return);
    } else {
        conditions.dateTime = Date.parse(query.depart);
    }

    conditions.maxDateTime = conditions.dateTime + 1 * 24 * 3600 * 1000;
    conditions.numberOfPassenger = query.passengers;

    return conditions;
}

function filterFlight(conditions, callback) {
    // Find flight
    findDepartureFlight(conditions, function (err, flights) {
        if (err)
            return callback(err);

        if (flights.length == 0)
            return callback(null, []);

        // Loop through flights and check available slot
        var responseFlights = [];
        var countFlight = 0;

        flights.forEach(function (flight) {

            flightDetailController.countAvailableSlot(flight, function (err, availableSlot) {
                flight.numberOfSeat = availableSlot;
                if (availableSlot >= conditions.numberOfPassenger) {
                    responseFlights.push(flight);
                }

                // Response after the last item
                if (++countFlight == flights.length) {
                    callback(null, responseFlights);
                }
            });
        });
    });
}

// Get one-way flights by query
module.exports.getOneWayFlights = function (req, res) {
    console.log('One-way');

    // Get query parameters
    var conditions = getConditionFromQuery(req.query);

    var departureAirport = null;
    var arriveAirport = null;

    airportController.getAirportDetail(conditions.depart, function (err, airport) {
        departureAirport = {code: airport.code, name: airport.name};
        console.log(departureAirport);
    });

    airportController.getAirportDetail(conditions.arrive, function (err, airport) {
        arriveAirport = {code: airport.code, name: airport.name};
        console.log(arriveAirport);
    });

    // Filter flights and response
    filterFlight(conditions, function (err, flights) {
        if (err) {
            res.status(400).end('Oops! Something went wrong...');
            console.log(err);
        } else {
            var responseFlights = [];
            for (var i = 0; i < flights.length; i++) {
                responseFlights.push(JSON.parse(JSON.stringify(flights[i])));
                responseFlights[i].depart = departureAirport;
                responseFlights[i].arrive = arriveAirport;
            }

            res.json(responseFlights);
        }
    });
};

// Get round-trip flight by query
module.exports.getRoundTripFlights = function (req, res) {
    console.log('Round-trip');

    var responsed = false;
    var responseFlights = {};

    // Get query parameters
    var departureConditions = getConditionFromQuery(req.query);

    var departureAirport = null;
    var arriveAirport = null;

    airportController.getAirportDetail(departureConditions.depart, function (err, airport) {
        departureAirport = {code: airport.code, name: airport.name};
        console.log(departureAirport);
    });

    airportController.getAirportDetail(departureConditions.arrive, function (err, airport) {
        arriveAirport = {code: airport.code, name: airport.name};
        console.log(arriveAirport);
    });

    // Filter departure flights
    filterFlight(departureConditions, function (err, flights) {
        if (err && !responsed) {
            res.status(400).end('Oops! Something went wrong...');
            responsed = true;
        } else {
            responseFlights.depart = [];
            for (var i = 0; i < flights.length; i++) {
                responseFlights.depart.push(JSON.parse(JSON.stringify(flights[i])));
                responseFlights.depart[i].depart = departureAirport;
                responseFlights.depart[i].arrive = arriveAirport;
            }

            if (responseFlights.return) {
                res.json(responseFlights);
            }
        }
    });

    // Get return flight condition
    var arrivalConditions = getConditionFromQuery(req.query, true);

    // Filter return flights
    filterFlight(arrivalConditions, function (err, flights) {
        if (err && !responsed) {
            res.status(400).end('Oops! Something went wrong...');
            responsed = true;
        } else {
            responseFlights.return = [];

            for (var i = 0; i < flights.length; i++) {
                responseFlights.return.push(JSON.parse(JSON.stringify(flights[i])));
                responseFlights.return[i].depart = arriveAirport;
                responseFlights.return[i].arrive = departureAirport;
            }
            if (responseFlights.depart) {
                res.json(responseFlights);
            }
        }
    });
};

module.exports.getDistinctFlights = function (req, res) {
    Flight.find({}).distinct('code').exec(function (err, flights) {
        var response = [];
        for (var i = 0; i < flights.length; i++) {
            Flight.findOne({code: flights[i]}, function (err, flight) {
                var f = {code: flight.code, departAt: new Date(flight.departAt)};

                airportController.getAirportDetail(flight.arrive, function (err, airport) {
                    f.arrive = {code: airport.code, name: airport.name};
                    if (f.depart) {
                        response.push(f);
                        if (response.length == flights.length) {
                            res.json(response);
                        }
                    }
                });

                airportController.getAirportDetail(flight.depart, function (err, airport) {
                    f.depart = {code: airport.code, name: airport.name};
                    if (f.arrive) {
                        response.push(f);
                        if (response.length == flights.length) {
                            res.json(response);
                        }
                    }
                });
            })
        }
    })
};
