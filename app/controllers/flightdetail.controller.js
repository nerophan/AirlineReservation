var mongoose = require('mongoose'),
    FlightDetail = mongoose.model('FlightDetail'),
    passengerController = require('./../controllers/passenger.controller'),
    bookingController = require('./../controllers/booking.controller');


var flightDetail = {};

// Add samples dummy data
flightDetail.addSampleData = function (req, res) {
    var dummyData = [
        {
            bookingCode: "ABCXYZ",
            flightCode: "BL326",
            date: new Date().getTime(),
            class: "Y",
            priceLevel: "E"
        }
    ];

    dummyData.forEach(function (detail, index) {
        var d = new FlightDetail(detail);
        d.save(function (err, data) {
            if (err)
                res.json(err);
        });

        if (index == dummyData.length - 1) {
            res.end('Data added.');
        }
    });
};

// Count available slot on a flight with specific flight code, call & price level
flightDetail.countAvailableSlot = function(flight, callback) {

    FlightDetail.find({
        flightCode: flight.code,
        class: flight.class,
        priceLevel: flight.priceLevel
    }, function (err, details) {
        if (err) {
            console.log(err);
            return callback(err, 0);
        }

        // If there is no booking response full seat
        if (details.length === 0) {
            return callback(err, flight.numberOfSeat);
        }

        // Count total number of passenger in each booking
        var booked = 0;
        var i = 0;
        details.forEach(function (detail, index) {
            passengerController.countPassengerByFlight(detail, function (err, count) {
                booked += count;

                if (++i == details.length) {
                    callback(err, flight.numberOfSeat - booked);
                }
            });
        });
    });
};

flightDetail.get = function(bookId,assignedValue){
    assignedValue = assignedValue | null;
    if(assignedValue == null) {
        FlightDetail.find({"madatcho": bookId}, 'machuyenbay ngay hang mucgia', function (err, data) {
            if (err) {
                return null;
            } else {
                return data;
            }
        });
    }else{
        FlightDetail.find({"madatcho": bookId}, 'machuyenbay ngay hang mucgia', function (err, data) {
            if (err) {
                assignedValue = null;
            } else {
                assignedValue = data;
            }
        });
    }
};

flightDetail.add = function(newFlightDetail){
    FlightDetail.create(newFlightDetail,function(err,data){
        if(err) return false;
        return true;
    })
}

flightDetail.getDistinctBooking = function (req, res) {
    var flightCode = req.params.flightCode;
    console.log(flightCode);

    FlightDetail.find({flightCode: flightCode}).distinct('bookingCode').exec(function (err, bookingCodes) {

        if (bookingCodes.length == 0)
            res.json([]);

        var responseData = [];
        for (var i = 0; i < bookingCodes.length; i++) {
            bookingController.getBookingDetail(bookingCodes[i], function (err, bookingDetail) {
                if (bookingDetail) {

                    responseData.push({
                        code: bookingDetail.code,
                        price: bookingDetail.price,
                        status: bookingDetail.status,
                        bookedAt: new Date(bookingDetail.bookedAt),
                    });

                    if (responseData.length == bookingCodes.length) {
                        res.json(responseData);
                    }
                }
            });
        }
    });
}
module.exports = flightDetail;
