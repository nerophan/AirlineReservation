var mongoose = require('mongoose'),
    FlightDetail = mongoose.model('FlightDetail'),
    Booking = mongoose.model('Booking'),
    Passenger = mongoose.model('Passenger');

module.exports.countPassengerByFlight = function (flightDetail, callback) {
    Passenger.find({bookingCode: flightDetail.bookingCode}).count(function (err, count) {
        callback(err, count);
    });
};

module.exports.addSampleData = function (req, res) {
    var passengers = [
        {
            bookingCode: "ABCXYZ",
            title: "MR",
            lastName: "Nguyen Phu",
            firstName: "Ke"
        },
        {
            bookingCode: "ABC000",
            title: "MR",
            lastName: "Bui Giao",
            firstName: "Linh"
        }
    ];

    passengers.forEach(function (p) {
        var passenger = new Passenger(p);
        passenger.save(function (err, data) {
            if (err)
                res.json(err);
        });
    });

};

module.exports.get = function (req, res) {
    var flightCode = req.query.flight;
    var bookingCode = req.query.booking;
    if (flightCode == null && bookingCode == null) {
        res.status(400).json({"error": "Query string should contain flight code or booking code"});
        return;
    }
    if (flightCode != null && bookingCode != null) {
        res.status(400).json({"error": "Query string should contain only flight code or booking code, not both"});
        return;
    }
    var returnData = [];

    if (flightCode != null) {
        FlightDetail.find({"flightCode": flightCode}, '-_id bookingCode', function (err, data) {
            if (err || data.length == 0) {
                res.status(400).json({"error": "flight cannot be found"});
                return;
            }
            var filtedData = data.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });

            filtedData.forEach(function (item, index) {
                Passenger.find({"bookingCode": item.bookingCode}, function (err, data) {
                    if (err) {

                    } else {
                        data.forEach(function (item) {
                            returnData.push(item);
                        });
                        if (index >= filtedData.length - 1) {
                            res.status(200).json(returnData);
                        }
                    }
                });
            });
        });
    }

    if (bookingCode != null) {
        Passenger.find({"bookingCode": bookingCode}, function (err, data) {
            if (err) {
                res.status(400).json({"error": "Booking code is not found"});
                return;
            } else {
                res.status(200).json(data);
            }
        });
    }
};
