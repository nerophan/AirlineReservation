/**
 * Created by hoang on 10/12/2016.
 */
var mongoose = require('mongoose');
require('../model/from_airport');

var FromAirport = mongoose.model('FromAirport');

var fromAirport = {};

fromAirport.get = function(req,res){
    FromAirport.find({},function(err,data){
        if(err){
            res.status(404).send(err);
        }else{
            res.status(200).json(data);
        }
    })
}
fromAirport.add = function(data,req, res){
    FromAirport.create(data,function(err,rs){
        if(err){
            res.status(400).send(err);
        }else{
            fromAirport.get(req,res);
        }
    });
}

module.exports = fromAirport;

