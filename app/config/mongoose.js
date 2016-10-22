/**
 * Created by hoang on 10/8/2016.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://huynh:123456@ds053146.mlab.com:53146/airlinereservation');

var flightController = require('../controllers/flight.controller.js');
var airportController = require('../controllers/airport.controller.js');
var bookingController = require('../controllers/booking.controller.js');

//check connection
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  // we're connected!
  console.log("connected to database");
});

var handler = {};//exported var

handler.addAirport = function(req,res){
    airportController.add(req,res);
}

handler.getAirports = function(req,res){
    airportController.get(req,res);
}
// handler.deleteAirport = function(req,res){
//     airportController.deleteAirport(req,res);
// }
handler.addFlightCode = function(req,res){
    airportController.addFlightCode(req,res);
};

handler.getFlights = function(req,res){
    flightController.getFlights(req,res);
};

handler.addFlight = function(req,res){
    flightController.addFlight(req,res);
};

handler.deleteFlight = function(req,res){
    flightController.deleteFlight(req,res);
}

// handler.getFromAirports = function(req,res){
//     fromAirportHandler.get(req,res);
// };
//
// handler.addFromAirport = function(fromAirport,req,res){
//     fromAirportHandler.add(fromAirport,req,res);
// };
//
// handler.getToAirports = function(req,res){
//     toAirportHandler.get(req,res);
// };
//
// handler.addToAirport = function(toAirport,req,res){
//     toAirportHandler.add(toAirport,req,res);
// }

handler.addBook = function(req,res){
    book.add(req,res);
}

handler.getBooks = function(req,res){
    book.get(req,res);
}
var handleError = function(err){
    //handle later
    return err;
};

module.exports = handler;
