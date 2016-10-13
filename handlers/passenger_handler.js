/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose');

require('../model/passenger');

var Passenger = mongoose.model('Passenger');

var passenger = {};

passenger.get = function(bookId){
    Passenger.find({"madatcho":bookId},'danhxung ho ten',function(err,data){
        if(err){
            return null;
        }else{
            return data;
        }
    })
};

passenger.add = function(newPassenger){
    Passenger.create(newPassenger,function(err,data){
        if(err) return false;
        return true;
    });
};

module.exports = passenger;
