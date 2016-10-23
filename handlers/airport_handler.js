/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose');
require('../model/airport');
require('../model/flight_code');

var Airport = mongoose.model('Airport');
var FlightCode = mongoose.model('FlightCode');

var airport = {};

airport.get = function(req,res){
    //var airportId = req.params.id;
    var airportId = req.query.dep;
    if(airportId == null) {
        Airport.find({}, function (err, data) {
            if (err) {
                res.status(404).send({"error":"Requested airport cound not be found"});
            } else {
                res.status(200).json(data);
            }
        });
    }else{
        var toAirportList = new Array();
        FlightCode.find({'noidi':airportId},'-_id noiden',function(err,data){
            if(err){
                console.log('không có sân bay đến tương ứng trong CSDL');
                return;
            }
            for(var i=0;i<data.length;i++){
                toAirportList.push(data[i].noiden);
            }
            Airport.find({'ma':{$in:toAirportList}},function(err,data){
                if (err) {
                    res.status(404).send({"error":"Error finding departure airport"});
                } else {
                    res.status(200).json(data);
                }
            })
        });
    }
};

airport.add = function(req, res){
    var data = req.body;
    Airport.create(data,function(err,rs){
        if(err){
            res.status(400).send(err);
        }else{
            airport.get(req,res);
        }
    });
}

airport.addFlightCode = function(req,res){
    var fromAirportId = req.params.id;
    var data = req.body;
    data.noidi = fromAirportId;
    FlightCode.create(data,function(err,rs){
        if(err){
            res.status(403).send("Không thể thêm");
        }else{
            airport.get(req,res);
        }
    });
};

module.exports = airport;
