/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose'),
    FlightDetail = mongoose.model('FlightDetail');

var flightDetail = {};

flightDetail.countAvailableSlot = function(flight, callback) {
    FlightDetail.find({
        flightCode: flight.code,
        class: flight.class,
        priceLevel: flight.priceLevel
    }, function (err, bookedSlot) {
        if (err) {
            console.log(err);
            callback(err, -1);
        } else {
            callback(null, flight.numberOfSeat - bookedSlot.length);
        }
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
module.exports = flightDetail;
