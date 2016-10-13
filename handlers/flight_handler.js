/**
 * Created by hoang on 10/9/2016.
 */
var mongoose = require('mongoose');
require('../model/flight');

var Flight = mongoose.model('Flight');
var flight = {};

flight.getFlights = function(req,res){
    Flight.find({},function(err,flights){
        if(err) {
            console.error('Error fetching flights: ' + err);
            res.send(err);
        }
        res.json(flights);

    });
};

flight.addFlight = function(newFlight,req,res){
    Flight.create(newFlight,function(err,rs){
        if(err) res.send(err);
        else{
            flight.getFlights(req,res);
        }
    });
};

flight.deleteFlight = function(req,res){//flight info can be in params or query or body
    //assume deleting a flight based on params
    var id = req.params.id;
    Flight.remove({_id:id},function(err){
        if(err){
            res.send(err);
        }else{
            flight.getFlights(res);
        }
    });
}

module.exports = flight;
