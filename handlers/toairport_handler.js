/**
 * Created by hoang on 10/12/2016.
 */
var mongoose = require('mongoose');
require('../model/to_airport');

var ToAirport = mongoose.model('ToAirport');

var toAirport = {};

//url: /sanbaydi/:id
toAirport.get = function(req,res){
    fromAirportId = req.params.id;
    ToAirport.find({'masanbaydi' : fromAirportId},function(err,data){
        if(err){
            res.status(404).send(err);
        }else{
            res.status(200).json(data);
        }
    });
}

//url: /sanbaydi/:id
toAirport.add = function(data,req,res){
    data.masanbaydi = req.params.id;
    ToAirport.create(data,function(err,data){
        if(err){
            res.status(400).send(err);
        }else{
            toAirport.get(req,res);
        }
    })
}
module.exports = toAirport;