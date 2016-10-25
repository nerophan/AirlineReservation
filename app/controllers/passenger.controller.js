var mongoose = require('mongoose'),
    FlightDetail = mongoose.model('FlightDetail');
    Booking = mongoose.model('Booking');

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
        },
    ];

    passengers.forEach(function (p) {
        var passenger = new Passenger(p);
        passenger.save(function (err, data) {
            if (err)
                res.json(err);
        });
    });

};

var passenger = {};

passenger.get = function(req,res){
    var flightCode = req.query.flight;
    var bookingCode = req.query.booking;
    
    if(flightCode != null){
        Booking.find({})
    }else{
        
    }
}

 module.exports = passenger;
