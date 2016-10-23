/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose');

require('../models/passenger.model');
require('../models/flightdetail.model');

var Passenger = mongoose.model('Passenger');
var FlightDetail = mongoose.model('FlightDetail');

var passenger = {};

passenger.get = function(bookId,assignedValue){
    assignedValue = assignedValue | null;
    if(assignedValue == null) {
        Passenger.find({"madatcho": bookId}, 'danhxung ho ten', function (err, data) {
            if (err) {
                return null;
            } else {
                return data;
            }
        });
    }else{
        Passenger.find({"madatcho": bookId}, 'danhxung ho ten', function (err, data) {
            if (err) {
                assignedValue = null;
            } else {
                assignedValue = data;
            }
        });
    }
};

passenger.add = function(req,res){
    var bookingId = req.body.madatcho;
    var passengers = req.body.passenger;
    //compare the the number of flightdetails and the number of passengers
    FlightDetail.count({"madatcho":bookingId},function(err,count){
        //
        
    });
};

module.exports = passenger;
