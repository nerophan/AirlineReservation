
var mongoose = require('mongoose'),
    Airport = mongoose.model('Airport'),
    routeController = require('./../controllers/route.controller');

// Use this seed database with samples
module.exports.addSampleData = function (req, res) {
    var airports = [
        {
            country: "Việt Nam",
            code: "BMV",
            name: "Buôn Ma Thuột"
        },
        {
            country: "Việt Nam",
            code: "VCL",
            name: "Chu Lai"
        },
        {
            country: "Việt Nam",
            code: "CAH",
            name: "Cà Mau"
        },
        {
            country: "Việt Nam",
            code: "VCS",
            name: "Côn Đảo"
        },
        {
            country: "Việt Nam",
            code: "VCA",
            name: "Cần Thơ"
        },
        {
            country: "Việt Nam",
            code: "HUI",
            name: "Huế"
        },
        {
            code: "HAN",
            country: "Việt Nam",
            name: "Hà Nội"
        },
        {
            code: "SGN",
            country: "Việt Nam",
            name: "Tp Hồ Chí Minh"
        },
        {
            country: "Việt Nam",
            code: "HPH",
            name: "Hải Phòng"
        },
        {
            country: "Việt Nam",
            code: "CXR",
            name: "Nha Trang"
        },
        {
            country: "Việt Nam",
            code: "PQC",
            name: "Phú Quốc"
        },
        {
            country: "Việt Nam",
            code: "PXU",
            name: "Pleiku"
        },
        {
            country: "Việt Nam",
            code: "UIH",
            name: "Quy Nhơn"
        },
        {
            country: "Việt Nam",
            code: "VKG",
            name: "Rạch Giá"
        },
        {
            country: "Việt Nam",
            code: "THD",
            name: "Thanh Hóa"
        },
        {
            country: "Việt Nam",
            code: "VII",
            name: "Tp Vinh"
        },
        {
            country: "Việt Nam",
            code: "TBB",
            name: "Tuy Hòa"
        },
        {
            country: "Việt Nam",
            code: "DIN",
            name: "Điện Biên"
        },
        {
            country: "Việt Nam",
            code: "DLI",
            name: "Đà Lạt"
        },
        {
            country: "Việt Nam",
            code: "DAD",
            name: "Đà Nẵng"
        },
        {
            country: "Việt Nam",
            code: "VDH",
            name: "Đồng Hới"
        },
        {
            country: "United States",
            code: "ATL",
            name: "Atlanta"
        },
        {
            country: "United States",
            code: "ORD",
            name: "Chicago"
        },
        {
            country: "United States",
            code: "LAX",
            name: "Los Angeles"
        },
        {
            country: "United States",
            code: "JFK",
            name: "New York"
        },
        {
            country: "United States",
            code: "SFO",
            name: "San Francisco"
        },
        {
            country: "UK",
            code: "LHR",
            name: "London"
        },
        {
            code: "MAN",
            country: "UK",
            name: "Manchester"
        },
        {
            code: "LPL",
            country: "UK",
            name: "Liverpool"
        }
    ];

    airports.forEach(function (airport) {
        Airport.create(airport, function (err, data) {
            console.log(data);
        });
    });
};

// Get all airport in database
module.exports.getAllAirports = function (req, res) {

    Airport.find({}, function (err, airports) {
        if (err) {
            res.status(400).end(err.toString());
        } else {
            res.json(airports);
        }
    });
};

// Get all support departure airports
var getDepartureAirports = function (callback) {

    Airport.distinct('country', function (err, countries) {
        if (err) {
            callback(err);
        } else {
            var responseAirports = [];
            var count = 0;

            countries.forEach(function (country, index) {
                Airport.find({country: country}).select('name code -_id').exec(function (err, airports) {
                    responseAirports.push({country: country, airports: airports});

                    if (responseAirports.length == countries.length) {
                        callback(null, responseAirports);
                    }
                });
            });
        }
    });
};

// Get arrival airports from a departure airport
var getArrivalAirports = function (departureAirports, callback) {

    routeController.getRouteFromDepartureAirport(departureAirports, function (err, routes) {
        if (err) {
            callback(err);
        } else {
            if (!routes.length)
                callback(null, []);

            var responseAirports = [];
            var count = 0;
            routes.forEach(function (route, index) {
                console.log(route);

                Airport.findOne({code: route.to}, function (err, airport) {

                    if (err)
                        return callback(err);
                    console.log(airport);

                    for (var i = 0; i < responseAirports.length; i++) {
                        if (responseAirports[i].country == airport.country) {
                            responseAirports[i].airports.push({name: airport.name, code: airport.code});
                            count++;
                            break;
                        }
                    }

                    if (i >= responseAirports.length) {
                        responseAirports.push({
                            country: airport.country,
                            airports: [{name: airport.name, code: airport.code}]
                        });
                        count++;
                    }

                    if (count == routes.length) {
                        callback(null, responseAirports);
                    }
                });
            });
        }
    });
};

// Get departure and arrival airport
module.exports.getAirports = function (req, res) {
    var departureAirport = req.query.depart;

    // If depart airport is included in query parameters then get all arrivial airport from that departure
    if (departureAirport) {
        getArrivalAirports(departureAirport, function (err, airports) {
            if (err) {
                res.status(400).end(err.toString());
            } else {
                res.json(airports);
            }
        });
    } else {
        getDepartureAirports(function (err, airports) {
            if (err) {
                console.log(err);
                res.status(400).end(err.toString());
            } else {
                res.json(airports);
                console.log(airports);
            }

        });
    }
};


// Add new airport
module.exports.add = function (req, res) {
    var airportData = req.body;
    Airport.create(airportData, function (err, airport) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(airport);
        }
    });
};

// Get airport detail
module.exports.getAirportDetail = function (airportCode, callback) {
    Airport.findOne({code: airportCode}, function (err, airport) {
        callback(err, airport);
    });
}
