/**
 * Created by hoang on 10/13/2016.
 */
var async = require('async');

var mongoose = require('mongoose');
var flightDetail = require('./flightdetail.controller');
var passenger = require('./passenger.controller');


var Booking = mongoose.model('Booking');
var FlightDetail = mongoose.model('FlightDetail');
var Passenger = mongoose.model('Passenger');
var Flight = mongoose.model('Flight');

var currentId;

Booking.findOne().sort({"bookedAt": -1}).limit(1).exec(function (err, data) {
    currentId = data.code;
});

var book = {};

book.get = function (req, res) {
    var bookId = req.params.id;
    var bookDetail = {};
    bookDetail.id = bookId;
    bookDetail.flightdetails = [];
    bookDetail.passengers = [];
    Booking.find({"code": bookId}, function (err, booking) {
        bookDetail.status = booking[0].status;
    });
    FlightDetail.find({"bookingCode": bookId}, '-_id flightCode departAt arriveAt class priceLevel', function (err, flightdetails) {
        if (err) {
            console.log(err);
            res.status(404).send({"error": "error getting flight detail"});
        } else {
            //bookDetail.flightdetails = flightdetails;
            for (var i = 0; i < flightdetails.length; i++) {

                // bookDetail.flightdetails[i].flightCode = flightdetails[i].flightCode;
                // bookDetail.flightdetails[i].departAt = flightdetails[i].departAt;
                // bookDetail.flightdetails[i].arriveAt = flightdetails[i].arriveAt;
                // bookDetail.flightdetails[i].class = flightdetails[i].class;
                // bookDetail.flightdetails[i].priceLevel = flightdetails[i].priceLevel;
                // bookDetail.flightdetails[i] = flightdetails[i];
                bookDetail.flightdetails[i] = {
                    "flightCode": flightdetails[i].flightCode,
                    "departAt": flightdetails[i].departAt,
                    "arriveAt": flightdetails[i].arriveAt,
                    "class": flightdetails[i].class,
                    "priceLevel": flightdetails[i].priceLevel,
                    "depart": "",
                    "arrive": "",
                    "price": 0
                };
                // bookDetail.flightdetails[i].depart = "ABC";
                // bookDetail.flightdetails[i].arrive = "ABC";
            }
            Passenger.find({"bookingCode": bookId}, '-_id title lastName firstName', function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(404).send("lỗi lấy dữ liệu hành khách cho mã đặt chỗ này");
                } else {
                    bookDetail.passengers = data;
                    var flightLoop = 0;
                    for (var i = 0; i < bookDetail.flightdetails.length; i++) {
                        Flight.find({"code": bookDetail.flightdetails[i].flightCode,"departAt":bookDetail.flightdetails[i].departAt,
                        "class":bookDetail.flightdetails[i].class,"priceLevel":bookDetail.flightdetails[i].priceLevel})
                            .limit(1)
                            .select('code depart arrive price')
                            .exec(function (err, flight) {
                            bookDetail.flightdetails[flightLoop].depart = flight[0].depart;
                            bookDetail.flightdetails[flightLoop].arrive = flight[0].arrive;
                            bookDetail.flightdetails[flightLoop].price = flight[0].price;
                            flightLoop++;
                            if (flightLoop > bookDetail.flightdetails.length - 1) {
                                res.status(200).json(bookDetail);
                            }
                        });
                    }
                    // bookDetail.flightdetails.forEach(function(item,index){
                    //     Flight.find({"code":item.flightCode}).limit(1).select('code depart arrive').exec(function(err,flight){
                    //         item.depart = flight[0].depart;
                    //         item.arrive = flight[0].arrive;
                    //         if(index >= bookDetail.flightdetails.length - 1){
                    //             res.status(200).json(bookDetail);
                    //         }
                    //     });
                    // });
                }
            });
        }
    });


};

//temporarily book with status = 0
book.add = function (req, res) {
    var data = req.body;
    if (data == null) {
        res.status(400).send({"error": "No flight is chosen"});
        return;
    }
    if (data.flights.length >= 3) {
        res.status(400).send({"error": "The number of flights mush be less than or equal 2"});
        return;
    }
    var isRoundabout = data.flights.length == 1 ? false : true;
    if (!isRoundabout) {//1 way flight
        var datetime = new Date(data.flights[0].datetime);
        //check if flight exist
        Flight.find({
            "code": data.flights[0].code, "class": data.flights[0].class, "priceLevel": data.flights[0].priceLevel,
            "datetime": data.flights[0].datetime
        }, function (err, flight) {
            datetime;
            if (err || flight.length == 0) {
                res.status(400).send({"error": "Cannot find the requested flight"});
                return;
            } else {
                var newId = generateBookingId();

                //book document
                var booking = {};
                booking.code = newId;
                booking.bookedAt = (new Date().getTime());
                booking.price = totalCost(flight, data.passengers.length);
                booking.status = 1;

                //flightdetail document
                data.flights[0].bookingCode = newId;
                data.flights[0].flightCode = data.flights[0].code;
                
                //passenger array document
                for (var i = 0; i < data.passengers.length; i++) {
                    data.passengers[i].bookingCode = newId;
                }

                FlightDetail.create(data.flights[0], function (err, flightdetail) {
                    if (err) {

                    } else {
                        Passenger.create(data.passengers, function () {
                            if (arguments[0]) {

                            } else {
                                Booking.create(booking, function (err, data) {
                                    if (err) {

                                    } else {
                                        req.params.id = booking.code;
                                        book.get(req, res);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {//roundabout flight
        var flights = [];
        var flightLoop = 0;
        data.flights.forEach(function (item, index) {
            Flight.find({
                "code": data.flights[index].code,
                "class": data.flights[index].class,
                "priceLevel": data.flights[index].priceLevel,
                "datetime": data.flights[index].datetime
            }, function (err, flight) {
                flightLoop++;
                if (err || flight.length == 0) {
                    res.status(400).send({"error": "Cannot find the requested flight"});
                    return;
                } else {
                    flights.push(flight[0]);
                    if (flightLoop == data.flights.length) {//last item
                        var newId = generateBookingId();
                        //book document
                        var booking = {};
                        booking.code = newId;
                        booking.bookedAt = (new Date().getTime());
                        booking.price = totalCost(flights, data.passengers.length);
                        booking.status = 1;
                        //flightdetail array document
                        for (var i = 0; i < data.flights.length; i++) {
                            data.flights[i].bookingCode = newId;
                            data.flights[i].flightCode = data.flights[i].code;
                        }
                        //passenger array document
                        for (var i = 0; i < data.passengers.length; i++) {
                            data.passengers[i].bookingCode = newId;
                        }

                        FlightDetail.create(data.flights, function () {
                            if (arguments[0]) {

                            } else {
                                Passenger.create(data.passengers, function () {
                                    if (arguments[0]) {

                                    } else {
                                        Booking.create(booking, function (err, data) {
                                            if (err) {

                                            } else {
                                                req.params.id = booking.code;
                                                book.get(req, res);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
};

var totalCost = function (flights, numberOfPassenger) {
    var totalCost = 0;
    var count = 0;
    flights.forEach(function (item, index) {
        // var date = new Date(item.ngay);
        // Flight.find({'code':item.code,'hang':item.hang,'mucgia':item.mucgia,
        //     'ngay':{$gte: new Date(date.getYear()+1900,date.getMonth(),date.getDate()),$lt:new Date(date.getYear()+1900,date.getMonth(),date.getDate()+1)}},
        // 'giaban',function(err,data){
        //         count++;
        //         if(err){
        //             console.log('Cannot find flight ' + item);
        //             return;
        //         }else{
        //             totalCost += data[0].giaban;
        //         }
        //         if(count >= flightDetails.length){
        //             callback(totalCost);
        //         }
        // });
        totalCost += item.price;
    });
    return totalCost * numberOfPassenger;
}

//find the number of flightdetails then compare to the number of passengers
book.updateStatus = function (req, res) {
    var bookingId = req.params.id;
    //flight detail must be fill in when booking. Therefore, search flight detail for checking booking existence
    FlightDetail.count({'madatcho': bookingId}, function (err, count) {
        if (err) {
            res.status(404).send({"error": "Requested booking id could not be found"});
            return;
        } else {
            //continue to find corresponding passengers
            var numberOfFlightDetail = count;
            Passenger.count({'madatcho': bookingId}, function (err, count) {
                if (err) {
                    res.status(400).send({"error": "Lack of passengers info"});
                    return;
                } else {
                    if (numberOfFlightDetail == count) {
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

var checkBookingSession = function (bookingId) {
    Book.find({'ma': bookingId}, 'trangthai', function (err, data) {
        if (err) {
            return false;
        } else {
            //session timeout
            if (data[0].trangthai == 0) {
                Book.remove({'ma': bookingId}, function (err) {
                    if (err) {
                        return false;
                    }
                });
                FlightDetail.remove({'madatcho': bookingId}, function (err) {
                    if (err) {
                        return false;
                    }
                });
            }
        }
    });
};

var generateBookingId = function () {
    var chars = currentId.slice(0, 3);
    var numbers = currentId.slice(3, 6);
    numbers = parseInt(numbers) + 1;
    numbers = ('000' + numbers).substr(-3);
    if (numbers >= 1000) {
        numbers = "000";
        chars = increaseChars(chars);
    }
    currentId = chars + numbers;
    return currentId;
}
var increaseChars = function (chars) {
    var char1 = chars.charAt(0);
    var char2 = chars.charAt(1);
    var char3 = chars.charAt(2);

    char1 = increaseChar(char1);
    if (char1 == 'A') {
        char2 = increaseChar(char2);
        if (char2 == 'A') {
            char3 = increaseChar(char3);
            if (char3 == 'A') {
                //handle ID overflow here
            }
        }
    }
    return char1 + char2 + char3;
};
var increaseChar = function (char) {
    var charCode = char.charCodeAt(0);
    charCode++;
    if (charCode >= 91) {
        return 'A';
    } else {
        return String.fromCharCode(charCode);
    }
}

// /**
//  * Created by hoang on 10/13/2016.
//  */
// var async = require('async');
//
// var mongoose = require('mongoose');
// var flightDetail = require('./flightdetail.controller');
// var passenger = require('./passenger.controller');
//
// require('./book');
// require('./book_current_id');
//
// var Book = mongoose.model('Book');
// var BookCurrentId = mongoose.model('BookCurrentId');
// var FlightDetail = mongoose.model('FlightDetail');
// var Passenger = mongoose.model('Passenger');
//
// var currentId;
// BookCurrentId.find({},function(err,data){
//     if(err) console.log("can't find currentId");
//     currentId = data[0].currentId;
// });
// var book = {};
//
// book.get = function(req,res){
//     var bookId = req.params.id;
//     var bookDetail = {};
//     // bookDetail.book={};
//     // bookDetail.flightDetail = new Array();
//     // bookDetail.passenger = new Array();
//     // flightDetail.get(bookId,bookDetail.flightDetail);
//     // passenger.get(bookId,bookDetail.passenger);
//
//     // async.series([flightDetail.get(bookId),passenger.get(bookId)],function(err,result){
//     //     if(err){
//     //         console.log(err);
//     //     }
//     //     console.log(result);
//     // });
//     FlightDetail.find({"madatcho": bookId}, 'machuyenbay ngay hang mucgia', function (err, data) {
//         if (err) {
//             console.log(err);
//             res.status(404).send("lỗi lấy dữ liệu chi tiết chuyến bay cho mã đặt chỗ này");
//         } else {
//             bookDetail.flightDetail = data;
//             //lồng nhau
//             Passenger.find({"madatcho": bookId}, 'danhxung ho ten', function (err, data) {
//                 if (err) {
//                     console.log(err);
//                     res.status(404).send("lỗi lấy dữ liệu hành khách cho mã đặt chỗ này");
//                 } else {
//                     bookDetail.passenger = data;
//                     //lồng nhau
//                     Book.find({"ma":bookId},function(err,data){
//                         if(err){
//                             res.status(400).send(err);
//                             return;
//                         }else{
//                             if(data == null){
//                                 res.status(400).send("Mã đặt chỗ không tồn tại");
//                                 return;
//                             }
//                             bookDetail.book = data;
//                             res.status(200).json(bookDetail);
//                         }
//                     });
//                 }
//             });
//         }
//     });
//
//
//
//
// };
//
// book.add = function(req,res){
//     var data = req.body;
//     if(data.book == null || data.flightdetail == null || data.passenger == null){
//         res.status(400).send("Chưa cung cấp đủ thông tin");
//     }
//     //assign new Id for data
//     var newId = generateBookId();
//     data.book.ma = newId;
//
//     for(var i=0;i<data.flightdetail.length;i++){
//         data.flightdetail[i].madatcho = newId;
//         flightDetail.add(data.flightdetail[i]);
//     }
//     for(var i=0;i<data.passenger.length;i++){
//         data.passenger[i].madatcho = newId;
//         passenger.add(data.passenger[i])
//     }
//
//     Book.create(data.book,function(err,rs){
//         if(err){
//             res.status(400).send("Không thể đặt chỗ");
//         }else{
//             res.status(201).json(data);
//         }
//     });
// };
//
// var generateBookId = function(){
//     var chars = currentId.slice(0,3);
//     var numbers = currentId.slice(3,6);
//     numbers = parseInt(numbers) + 1;
//     numbers = ('000' + numbers).substr(-3);
//     if(numbers >= 1000){
//         numbers = "000";
//         chars = increaseChars(chars);
//     }
//     currentId = chars + numbers;
//     updateCurrentId(currentId);
//     return currentId;
// }
// var increaseChars = function(chars){
//     var char1 = chars.charAt(0);
//     var char2 = chars.charAt(1);
//     var char3 = chars.charAt(2);
//
//     char1 = increaseChar(char1);
//     if(char1 == 'A'){
//         char2 = increaseChar(char2);
//         if(char2 == 'A'){
//             char3 = increaseChar(char3);
//             if(char3 == 'A'){
//                 //handle ID overflow here
//             }
//         }
//     }
//     return char1 + char2 + char3;
// };
// var increaseChar = function(char){
//     var charCode = char.charCodeAt(0);
//     charCode++;
//     if(charCode >= 91){
//         return 'A';
//     }else{
//         return String.fromCharCode(charCode);
//     }
// }
//
// var updateCurrentId = function(newId){
//     BookCurrentId.update({_id:'57ff7c14dcba0f48d2c4f8fc'},{$set:{'currentId':newId}},function(err,data){
//         if(err) console.error("error updating static current book Id");
//     });
// }

book.getBookingList = function (req, res) {
    Booking.find({}, function (err, bookings) {
        res.json(bookings);
    });
};

book.getBookingDetail = function (bookingCode, callback) {
    Booking.findOne({code: bookingCode}, function (err, booking) {
        callback(err, booking);
    });
};

module.exports = book;
