/**
 * Created by hoang on 10/13/2016.
 */
var mongoose = require('mongoose');
var FlightDetail = require('./flightdetail_handler');
var Passenger = require('./passenger_handler');

require('../model/book');
require('../model/book_current_id');

var Book = mongoose.model('Book');
var BookCurrentId = mongoose.model('BookCurrentId');

var currentId;
BookCurrentId.find({},function(err,data){
    if(err) console.log("can't find currentId");
    currentId = data.currentId;
});
var book = {};

book.get = function(req,res){
    var bookId = req.params.id;
    var bookDetail = {};
    Book.find({"ma":bookId},function(err,data){
       if(err){
           res.status(400).send(err);
       }else{
           bookDetail.book = data;
       }
    });
    bookDetail.flightDetail = FlightDetail.get(bookId);
    bookDetail.passenger = Passenger.get(bookId);
};

var generateBookId = function(){
    var chars = currentId.slice(0,3);
    var numbers = parseInt(currentId.slide(3,6));

    numbers++;
    if(numbers >= 1000){
        numbers = "000";

    }
}
var increaseChars = function(chars){

};

var updateCurrentId = function(newId){
    BookCurrentId.update({_id:'57ff7c14dcba0f48d2c4f8fc'},{$set:{'currentId':newId}},function(err,data){
        if(err) console.error("error updating static current book Id");
    });
}
module.exports = book;