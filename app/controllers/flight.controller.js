var mongoose = require('mongoose'),
    chalk = require('chalk'),
    FlightDetail = mongoose.model('FlightDetail'),
    Flight = mongoose.model('Flight'),
    flightDetailController = require('./flightdetail.controller'),
    airportController = require('./airport.controller'),
    accountController = require('./account.controller');

// Get all flight
module.exports.getAllFlights = function (req, res) {
    Flight.find({}, function (err, flights) {
        if (err)
            res.status(400).send(err);
        else res.json(flights);
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
        callback(err, count.length);
    });
}

// Add new flight
module.exports.addFlight = function (req, res) {

    var currentTime = new Date().getTime();

    var flightInfo = req.body.flight;
    var tickets = req.body.tickets;

    if (!flightInfo.arrive || !flightInfo.depart || !flightInfo.departAt || !flightInfo.arriveAt) {
        res.status(422).send("Invalid data.");
        return;
    }
    ;

    if (flightInfo.departAt - currentTime < 6 * 3600 * 1000) {
        res.status(422).send("The departure time must be larger than current at least 6 hours.");
        return;
    }
    ;


    if (flightInfo.arriveAt <= flightInfo.departAt) {
        res.status(422).send("Arrival time cannot less than or equal departure time");
        return;
    }
    ;

    if (flightInfo.depart === flightInfo.arrive) {
        res.status(422).send("Departure airport and arrival airport must be different.");
        return;
    }

    for (var i = 0; i < tickets.length; i++) {
        if (tickets[i].numberOfSeat <= 0) {
            res.status(422).send("Number of seat must greater than 0");
            return;
        }

        if (tickets[i].price <= 0) {
            res.status(422).send("Price must be greater than 0");
            return;
        }
    }


    generateFlightCode(flightInfo.depart, flightInfo.arrive, function (err, count) {

        var flight = JSON.parse(JSON.stringify(flightInfo));

        if (count > 10 && count < 100)
            count = '0' + count;
        else if (count >= 0 && count < 10)
            count = '00' + count;

        flight.code = flight.depart + flight.arrive + count;

        var responseData = [];

        var c = 0;
        var r = false;
        for (var i = 0; i < tickets.length; i++) {

            flight.price = tickets[i].price;
            flight.class = tickets[i].class;
            flight.priceLevel = tickets[i].priceLevel;
            flight.numberOfSeat = tickets[i].numberOfSeat;

            Flight.create(flight, function (err, flight) {
                if (err && !r) {
                    res.status(422).send(err);
                    r = true;
                }
                else
                    responseData.push(flight);

                if (responseData.length == tickets.length) {
                    //res.json(responseData);
                }
            });
        }

        res.json({success: true});
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

    var currentTime = new Date().getTime();
    if (conditions.dateTime <= currentTime) {
        conditions.dateTime = currentTime + 30 * 6000;
    }

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


function validateSearchQuery(query) {

    if (!query.from || !query.to || !query.depart || !query.passengers) {
        return {
            error: true,
            message: "Invalid search query format."
        }
    }

    if (query.from == query.to) {
        return {
            error: true,
            message: "Departure and arrival airport must be different."
        }
    }

    var departureDate = new Date(query.depart);
    var returnDate = new Date(query.return);


    console.log(departureDate);

    if (departureDate == 'Invalid Date') {
        return {
            error: true,
            message: "Departure date has invalid format. Correct format is yyyy-MM-dd."
        }
    }

    if (query.return && returnDate == 'Invalid Date') {
        return {
            error: true,
            message: "Return date has invalid format. Correct format is yyyy-MM-dd."
        }
    }

    if (!query.passengers || query.passengers <= 0) {
        return {
            error: true,
            message: "The number of passengers must be greater than 0."
        }
    }

    return {
        error: false
    }
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

    var validateResult = validateSearchQuery(req.query);

    if (validateResult.error) {
        res.status(400).send(validateResult.message);
        return;
    }

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

    var validateResult = validateSearchQuery(req.query);

    if (validateResult.error) {
        res.status(400).send(validateResult.message);
    }

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
