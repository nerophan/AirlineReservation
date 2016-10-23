var mongoose = require('mongoose'),
    chalk = require('chalk'),
    FlightDetail = mongoose.model('FlightDetail'),
    Flight = mongoose.model('Flight'),
    flightDetailController = require('./flightdetail.controller');

// Get all flight
module.exports.getAllFlights = function (req, res) {
    Flight.find({}, function (err, flights) {
        res.json(flights);
    });
};

// Add sample flight data
module.exports.addSampleData = function (req, res) {
    var flights = [
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 5,
            price: 100000,
            datetime: "2016-10-15T13:04:51.247Z"
        },
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "F",
            numberOfSeat: 2,
            price: 10000,
            datetime: "2016-10-15T13:04:51.247Z"
        },
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "C",
            priceLevel: "G",
            numberOfSeat: 10,
            price: 500000,
            datetime: "2016-10-15T13:04:51.247Z"
        },
        {
            code: "BL327",
            depart: "TBB",
            arrive: "SGN",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 100,
            price: 100000,
            datetime: "2016-10-15T13:04:51.247Z"
        }
    ];

    var i = 0;
    flights.forEach(function (flight) {
        flight.datetime = Date.parse(flight.datetime);
        var f = new Flight(flight);
        console.log(f);
        f.save(function (err, f) {
            if (err)
                console.log(err);
            else console.log(f);
            if (++i === 9) {
                this.getFlights(req, res);
            }
        });
    });
};

// Clear all flight data in database
module.exports.clearFlightData = function (req, res) {
    Flight.find({}).remove(function (err, data) {
        if (err) {
            console.log(chalk.red(err));
        } else {
            console.log(chalk.green('Clear data successfully'));
            res.end('Clear data successfully');
            console.log(data);
        }
    });
};

// Add new flight
module.exports.addFlight = function (req, res) {
    var newFlight = req.body;
    Flight.create(newFlight, function (err, rs) {
        if (err) res.send(err);
        else {
            res.json(rs);
        }
    });
};

// Remove flight from databae
module.exports.deleteFlight = function (req, res) {
    var id = req.params.id;

    // Remove flight
    Flight.remove({_id: id}, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.end('Flight is removed successfully');
        }
    });

    // Remove other related data (passenger, booking...)
    //...
};

var findDepartureFlight = function (conditions, callback) {
    Flight.find({
        depart: conditions.depart,
        arrive: conditions.arrive,
        datetime: {
            $gte: conditions.dateTime,
            $lte: conditions.maxDateTime
        }
    }, function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

var findReturnFlight = function (conditions, callback) {
    Flight.find({
        depart: conditions.depart,
        arrive: conditions.arrive,
        datetime: {
            $gte: conditions.dateTime,
            $lte: conditions.maxDateTime
        }
    }, function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

// Flight search route
// If query.return date != null then it is round trip flight,
module.exports.getFlights = function (req, res) {
    if (req.query.return)
        this.getRoundTripFlights(req, res);
    else
        this.getOneWayFlights(req, res);
};

function getConditionFromQuery(query, returnFlight) {
    var conditions = {};

    if (returnFlight) {
        conditions.depart = query.to;
        conditions.arrive = query.from;
    } else  {
        conditions.depart = query.from;
        conditions.arrive = query.to;
    }

    if (returnFlight) {
        conditions.dateTime = Date.parse(query.return);
    } else {
        conditions.dateTime = Date.parse(query.depart);
    }

    conditions.maxDateTime = conditions.dateTime + 1 * 24 * 3600 * 1000;
    conditions.numberOfPassenger = query.passengers;

    return conditions;
}

function filterFlight(conditions, callback) {
    // Find flight
    findDepartureFlight(conditions, function (err, flights) {
        if (err)
            return callback(err);

        if (flights.length == 0)
            return callback(null, []);

        // Loop through flights and check available slot
        var responseFlights = [];
        var countFlight = 0;

        flights.forEach(function (flight) {

            flightDetailController.countAvailableSlot(flight, function (err, availableSlot) {
                flight.numberOfSeat = availableSlot;
                if (availableSlot >= conditions.numberOfPassenger)
                    responseFlights.push(flight);

                // Response after the last item
                if (++countFlight == flights.length) {
                    callback(null, responseFlights);
                }
            });
        });
    });
}

// Get one-way flights by query
module.exports.getOneWayFlights = function (req, res) {
    console.log('One-way');

    // Get query parameters
    var conditions = getConditionFromQuery(req.query);

    // Filter flights and response
    filterFlight(conditions, function (err, flights) {
        if (err) {
            res.status(400).end('Oops! Something went wrong...');
            console.log(err);
        } else {
            res.json(flights);
        }
    });
};

// Get round-trip flight by query
module.exports.getRoundTripFlights = function (req, res) {
    console.log('Round-trip');

    var responsed = false;
    var responseFlights = {};

    // Get query parameters
    var departureConditions = getConditionFromQuery(req.query);

    // Filter departure flights
    filterFlight(departureConditions, function (err, flights) {
        if (err && !responsed) {
            res.status(400).end('Oops! Something went wrong...');
            responsed = true;
        } else {
            responseFlights.depart = flights;
            if (responseFlights.return) {
                res.json(responseFlights);
            }
        }
    });

    // Get return flight condition
    var arrivalConditions = getConditionFromQuery(req.query, true);

    // Filter return flights
    filterFlight(arrivalConditions, function (err, flights) {
        if (err && !responsed) {
            res.status(400).end('Oops! Something went wrong...');
            responsed = true;
        } else {
            responseFlights.return = flights;
            if (responseFlights.depart) {
                res.json(responseFlights);
            }
        }
    });
};

//lọc danh sách các chuyến bay dựa vào số lượng hành khách
// var filtResult = function (req, res, Data, soLuongHanhKhach) {
//     var noiDi = req.query.noidi;
//     var noiDen = req.query.noiden;
//     var ngayDi = new Date(req.query.ngaydi);
//     var ngayVe = new Date(req.query.ngayve);
//
//     var maChuyenBayDi, maChuyenBayVe;
//     //tim ma chuyen bay
//     FlightCode.find({'noidi': noiDi, 'noiden': noiDen}, 'ma', function (err, data) {
//         maChuyenBayDi = data[0].ma;
//         var chuyenbaydiCount = Data.chuyenbaydi.length;
//         var loopCount = 0;
//         Data.chuyenbaydi.forEach(function (item, index) {
//             FlightDetail.count({
//                 'machuyenbay': maChuyenBayDi,
//                 'ngay': {
//                     $gte: new Date(ngayDi.getYear() + 1900, ngayDi.getMonth(), ngayDi.getDate()),
//                     $lt: new Date(ngayDi.getYear() + 1900, ngayDi.getMonth(), ngayDi.getDate() + 1)
//                 },
//                 'hang': Data.chuyenbaydi[index].hang,
//                 'mucgia': Data.chuyenbaydi[index].mucgia
//             }, function (err, count) {
//                 //không đủ số lượng ghế
//                 var i = Data.chuyenbaydi.indexOf(item);
//                 if (count + soLuongHanhKhach > Data.chuyenbaydi[i].soluongghe) {
//                     //xóa chuyến bay khỏi danh sách
//                     Data.chuyenbaydi.splice(i, 1);
//                 }
//                 loopCount++;
//                 if (loopCount == chuyenbaydiCount) {
//
//                     //
//                     if (req.query.ngayve != null) {
//                         FlightCode.find({'noidi': noiDen, 'noiden': noiDi}, 'ma', function (err, data) {
//                             maChuyenBayVe = data[0].ma;
//
//                             var chuyenbayveCount = Data.chuyenbayve.length;
//                             var loopCount = 0;
//                             Data.chuyenbayve.forEach(function (item, index) {
//                                 FlightDetail.count({
//                                     'machuyenbay': maChuyenBayVe,
//                                     'ngay': {
//                                         $gte: new Date(ngayVe.getYear() + 1900, ngayVe.getMonth(), ngayVe.getDate() - 1),
//                                         $lt: new Date(ngayVe.getYear() + 1900, ngayVe.getMonth(), ngayVe.getDate())
//                                     },
//                                     'hang': Data.chuyenbayve[index].hang,
//                                     'mucgia': Data.chuyenbayve[index].mucgia
//                                 }, function (err, count) {
//                                     //không đủ số lượng ghế
//                                     var i = Data.chuyenbayve.indexOf(item);
//                                     if (count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe) {
//                                         //xóa chuyến bay khỏi danh sách
//                                         Data.chuyenbayve.splice(i, 1);
//                                     }
//                                     loopCount++;
//                                     if (loopCount == chuyenbayveCount) {
//                                         res.status(200).json(Data);
//                                     }
//                                 });
//                             });
//                         });
//                     } else {
//                         res.status(200).json(Data);
//                     }
//                     //
//
//                 }
//             });
//         });
//     });
//     // if(req.query.ngayve != null){
//     //     FlightCode.find({'noidi':noiDen,'noiden':noiDi},'ma',function(err,data){
//     //         maChuyenBayVe = data[0].ma;
//     //
//     //         var chuyenbayveCount = Data.chuyenbayve.length;
//     //         var loopCount = 0;
//     //         Data.chuyenbayve.forEach(function(item,index){
//     //             FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
//     //                 'hang':Data.chuyenbayve[index].hang,'mucgia':Data.chuyenbayve[index].mucgia},function(err,count){
//     //                 //không đủ số lượng ghế
//     //                 var i = Data.chuyenbayve.indexOf(item);
//     //                 if(count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe){
//     //                     //xóa chuyến bay khỏi danh sách
//     //                     Data.chuyenbayve.splice(i,1);
//     //                 }
//     //                 loopCount++;
//     //                 if(loopCount == chuyenbayveCount){
//     //                     res.status(200).json(Data);
//     //                 }
//     //             });
//     //         });
//     //     });
//     // }else{
//     //     res.status(200).json(Data);
//     // }
//
//     //tim so luong da book
//
//     //var tempDate = JSON.parse(JSON.stringify(Data));
//
//     //lọc danh sách chuyến bay đi
//     // for(var i=0;i<Data.chuyenbaydi.length;i++){
//     //
//     //     FlightDetail.count({'machuyenbay':maChuyenBayDi,'ngay':{$gte: new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()-1),$lt:new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate())},
//     //         'hang':Data.chuyenbaydi[i].hang,'mucgia':Data.chuyenbaydi[i].mucgia},function(err,count){
//     //         //không đủ số lượng ghế
//     //         if(count + soLuongHanhKhach > Data.chuyenbaydi[i].soluongghe){
//     //             //xóa chuyến bay khỏi danh sách
//     //             Data.chuyenbaydi.splice(i,1);
//     //             i--;
//     //         }
//     //     });
//     // }
//
//
//     //
//     //lọc danh sách chuyến bay về
//     // if(maChuyenBayVe != undefined){
//     //     // for(var i=0;i<Data.chuyenbayve.length;i++){
//     //     //
//     //     //     FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
//     //     //         'hang':Data.chuyenbayve[i].hang,'mucgia':Data.chuyenbayve[i].mucgia},function(err,count){
//     //     //         //không đủ số lượng ghế
//     //     //         if(count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe){
//     //     //             //xóa chuyến bay khỏi danh sách
//     //     //             Data.chuyenbayve.splice(i,1);
//     //     //             i--;
//     //     //         }
//     //     //     });
//     //     // }
//     //     Data.chuyenbayve.forEach(function(item,index){
//     //         FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
//     //             'hang':Data.chuyenbayve[index].hang,'mucgia':Data.chuyenbayve[index].mucgia},function(err,count){
//     //             //không đủ số lượng ghế
//     //             if(count + soLuongHanhKhach > Data.chuyenbayve[index].soluongghe){
//     //                 //xóa chuyến bay khỏi danh sách
//     //                 Data.chuyenbayve.splice(index,1);
//     //             }
//     //         });
//     //     });
//     //     res.status(200).json(Data);
//     // }else{
//     //     res.status(200).json(Data);
//     // }
// };
// flight.addFlight = function (req, res) {
//     var newFlight = req.body;
//     Flight.create(newFlight, function (err, rs) {
//         if (err) res.send(err);
//         else {
//             res.json(rs);
//         }
//     });
// };
//
// flight.deleteFlight = function (req, res) {//flight info can be in params or query or body
//     //assume deleting a flight based on params
//     var id = req.params.id;
//     Flight.remove({_id: id}, function (err) {
//         if (err) {
//             res.send(err);
//         } else {
//             flight.getFlights(res);
//         }
//     });
// }
