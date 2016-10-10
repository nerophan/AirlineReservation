/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/airline');
//MongoLab server
mongoose.connect('mongodb://huynh:123456@ds053146.mlab.com:53146/airlinereservation');

var airportHandler = require('./airport_handler');
var flightHandler = require('./flight_handler');
//var flightDB = require('../model/flight');
// var bookDB = require('../model/book');
// var flightDetailDB = require('../model/flight_detail');
// var passengerDB = require('../model/passenger');

//check connection
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  // we're connected!
  console.log("connected to database");
});

 var handler = {};//exported var

handler.addAirport = function(airport,res){
    airportHandler.addAirport(airport,res);
}

handler.getAirports = function(res){
    airportHandler.getAirports(res);
}
handler.deleteAirport = function(req,res){
    airportHandler.deleteAirport(req,res);
}

handler.getFlights = function(res){
    flightHandler.getFlights(res);
};

handler.addFlight = function(flight,res){
    flightHandler.addFlight(flight,res);
};

handler.deleteFlight = function(req,res){
    flightHandler.deleteFlight(req,res);
}

var handleError = function(err){
    //handle later
    return err;
};

module.exports = handler;
