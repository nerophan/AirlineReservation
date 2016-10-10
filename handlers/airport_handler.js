/**
 * Created by hoang on 10/9/2016.
 */
var mongoose = require('mongoose');
require('../model/airport_code');

var Airport = mongoose.model('Airport');
var airport = {};

airport.getAirports = function(res){
    Airport.find({},function(err,airports){
        if(err) {
            console.error('Error fetching airports: ' + err);
            res.send(err);
        }
        res.json(airports);
    });
};

airport.addAirport = function(newAirport,res){
    Airport.create(newAirport,function(err,rs){
        if(err) res.send(err);
        else{
            airport.getAirports(res);
        }
    });
};

airport.deleteAirport = function(req,res){
    
    var id = req.params.id;
    Airport.remove({_id:id},function(err){
        if(err){
            res.send(err);
        }else{
            airport.getAirports(res);
        }
    });
}

module.exports = airport;