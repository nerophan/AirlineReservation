/**
 * Created by hoang on 10/13/2016.
 */
var async = require('async');

var mongoose = require('mongoose');
var flightDetail = require('./flightdetail_handler');
var passenger = require('./passenger_handler');

require('../model/book');
require('../model/book_current_id');

var Book = mongoose.model('Book');
var BookCurrentId = mongoose.model('BookCurrentId');
var FlightDetail = mongoose.model('FlightDetail');
var Passenger = mongoose.model('Passenger');

var currentId;
BookCurrentId.find({},function(err,data){
    if(err) console.log("can't find currentId");
    currentId = data[0].currentId;
});
var book = {};

book.get = function(req,res){
    var bookId = req.params.id;
    var bookDetail = {};
    // bookDetail.book={};
    // bookDetail.flightDetail = new Array();
    // bookDetail.passenger = new Array();
    // flightDetail.get(bookId,bookDetail.flightDetail);
    // passenger.get(bookId,bookDetail.passenger);

    // async.series([flightDetail.get(bookId),passenger.get(bookId)],function(err,result){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log(result);
    // });
    FlightDetail.find({"madatcho": bookId}, 'machuyenbay ngay hang mucgia', function (err, data) {
        if (err) {
            console.log(err);
            res.status(404).send("lỗi lấy dữ liệu chi tiết chuyến bay cho mã đặt chỗ này");
        } else {
            bookDetail.flightDetail = data;
            //lồng nhau
            Passenger.find({"madatcho": bookId}, 'danhxung ho ten', function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(404).send("lỗi lấy dữ liệu hành khách cho mã đặt chỗ này");
                } else {
                    bookDetail.passenger = data;
                    //lồng nhau
                    Book.find({"ma":bookId},function(err,data){
                        if(err){
                            res.status(400).send(err);
                            return;
                        }else{
                            if(data == null){
                                res.status(400).send("Mã đặt chỗ không tồn tại");
                                return;
                            }
                            bookDetail.book = data;
                            res.status(200).json(bookDetail);
                        }
                    });
                }
            });
        }
    });




};

book.add = function(req,res){
    var data = req.body;
    if(data.book == null || data.flightdetail == null || data.passenger == null){
        res.status(400).send("Chưa cung cấp đủ thông tin");
    }
    //assign new Id for data
    var newId = generateBookId();
    data.book.ma = newId;

    for(var i=0;i<data.flightdetail.length;i++){
        data.flightdetail[i].madatcho = newId;
        flightDetail.add(data.flightdetail[i]);
    }
    for(var i=0;i<data.passenger.length;i++){
        data.passenger[i].madatcho = newId;
        passenger.add(data.passenger[i])
    }

    Book.create(data.book,function(err,rs){
        if(err){
            res.status(400).send("Không thể đặt chỗ");
        }else{
            res.status(201).json(data);
        }
    });
};

var generateBookId = function(){
    var chars = currentId.slice(0,3);
    var numbers = currentId.slice(3,6);
    numbers = parseInt(numbers) + 1;
    numbers = ('000' + numbers).substr(-3);
    if(numbers >= 1000){
        numbers = "000";
        chars = increaseChars(chars);
    }
    currentId = chars + numbers;
    updateCurrentId(currentId);
    return currentId;
}
var increaseChars = function(chars){
    var char1 = chars.charAt(0);
    var char2 = chars.charAt(1);
    var char3 = chars.charAt(2);

    char1 = increaseChar(char1);
    if(char1 == 'A'){
        char2 = increaseChar(char2);
        if(char2 == 'A'){
            char3 = increaseChar(char3);
            if(char3 == 'A'){
                //handle ID overflow here
            }
        }
    }
    return char1 + char2 + char3;
};
var increaseChar = function(char){
    var charCode = char.charCodeAt(0);
    charCode++;
    if(charCode >= 91){
        return 'A';
    }else{
        return String.fromCharCode(charCode);
    }
}

var updateCurrentId = function(newId){
    BookCurrentId.update({_id:'57ff7c14dcba0f48d2c4f8fc'},{$set:{'currentId':newId}},function(err,data){
        if(err) console.error("error updating static current book Id");
    });
}
module.exports = book;