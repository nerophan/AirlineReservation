/**
 * Created by hoang on 10/13/2016.
 */
var async = require('async');

var mongoose = require('mongoose');
var flightDetail = require('./flightdetail_handler');
var passenger = require('./passenger_handler');

require('../model/book');
require('../model/book_current_id');
require('../model/flight');

var Book = mongoose.model('Book');
var BookCurrentId = mongoose.model('BookCurrentId');
var FlightDetail = mongoose.model('FlightDetail');
var Passenger = mongoose.model('Passenger');
var Flight = mongoose.model('Flight');

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

//temporarily book with status = 0
book.add = function(req,res){
    //var data = req.body;
    // if(data.book == null || data.flightdetail == null || data.passenger == null){
    //     res.status(400).send("Chưa cung cấp đủ thông tin");
    // }
    // //assign new Id for data
    // var newId = generateBookingId();
    // data.book.ma = newId;
    //
    // for(var i=0;i<data.flightdetail.length;i++){
    //     data.flightdetail[i].madatcho = newId;
    //     flightDetail.add(data.flightdetail[i]);
    // }
    // for(var i=0;i<data.passenger.length;i++){
    //     data.passenger[i].madatcho = newId;
    //     passenger.add(data.passenger[i])
    // }

    //data = flightdetails
    var data = req.body;
    if(data == null){
        res.status(400).send({"error":"No flight is chosen"});
        return;
    }
    
    var booking ={};
    var newId = generateBookingId();
    booking.ma = newId;
    booking.thoigiandatcho = new Date();
    booking.tongtien = totalCost(data);
    booking.trangthai = 0;
    Book.create(booking,function(err,rs){
        if(err){
            res.status(400).send("Error while creating booking");
        }else{
            res.status(201).json(rs);
            setTimeout(checkBookingSession(newId),1000*60*5);
        }
    });
    data.forEach(function(item,index){
        data[index].madatcho = newId;
        flightDetail.add(data[index]);
    });
};

var totalCost = function(flightDetails){
    var totalCost = 0;
    var count = 0;
    flightDetails.forEach(function(item,index){
        var date = new Date(item.ngay);
        Flight.find({'machuyenbay':item.machuyenbay,'hang':item.hang,'mucgia':item.mucgia,
            'ngay':{$gte: new Date(date.getYear()+1900,date.getMonth(),date.getDate()),$lt:new Date(date.getYear()+1900,date.getMonth(),date.getDate()+1)}},
        'giaban',function(err,data){
                count++;
                if(err){
                    console.log('Cannot find flight ' + item);
                    return;
                }else{
                    totalCost += data[0].giaban;
                }
                if(count >= flightDetails.length){
                    return totalCost;
                }
        });
    });

}

//find the number of flightdetails then compare to the number of passengers
book.updateStatus = function(req,res){
    var bookingId = req.params.id;
    //flight detail must be fill in when booking. Therefore, search flight detail for checking booking existence
    FlightDetail.count({'madatcho':bookingId},function(err,count){
        if(err){
            res.status(404).send({"error":"Requested booking id could not be found"});
            return;
        }else{
            //continue to find corresponding passengers
            var numberOfFlightDetail = count;
            Passenger.count({'madatcho':bookingId},function(err,count){
                if(err){
                    res.status(400).send({"error":"Lack of passengers info"});
                    return;
                }else{
                    if(numberOfFlightDetail == count) {
                        //update status
                        Book.update({'ma': bookingId}, {$set: {'trangthai': 1}}, function (err, data) {
                            if (err) {
                                res.status(500).send({"error": "Error while updating status"});
                                return;
                            } else {
                                Book.find({'ma': bookingId}, function (err, data) {
                                    if (err) {
                                        res.status(404).send({"error": "Requested booking id could not be found"});
                                        return;
                                    } else {
                                        res.status(200).json(data);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
};

var checkBookingSession = function(bookingId){
    Book.find({'ma':bookingId},'trangthai',function(err,data){
        if(err){
            return false;
        }else{
            //session timeout
            if(data[0].trangthai == 0){
                Book.remove({'ma':bookingId},function(err){
                    if(err){
                        return false;
                    }
                });
                FlightDetail.remove({'madatcho':bookingId},function(err){
                    if(err){
                        return false;
                    }
                });
            }
        }
    });
};

var generateBookingId = function(){
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