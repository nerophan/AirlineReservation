/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose');

require('../model/flight_detail');

var FlightDetail = mongoose.model('FlightDetail');

var flightDetail = {};

flightDetail.get = function(bookId){
  FlightDetail.find({"madatcho":bookId},'machuyenbay ngay hang mucgia',function(err,data){
      if(err){
          return null;
      }else{
          return data;
      }
  });
};

flightDetail.add = function(newFlightDetail){
    FlightDetail.create(newFlightDetail,function(err,data){
        if(err) return false;
        return true;
    })
}
module.exports = flightDetail;