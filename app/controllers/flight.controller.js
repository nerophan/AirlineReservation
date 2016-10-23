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
module.exports.addFlights = function (req, res) {
    var flights = [
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 100,
            price: 100000,
            datetime: "2016-10-15T13:04:51.247Z"
        },
        {
            code: "BL326",
            depart: "SGN",
            arrive: "TBB",
            class: "Y",
            priceLevel: "F",
            numberOfSeat: 20,
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
        },
        {
            code: "BMVHAN",
            depart: "BMV",
            arrive: "HAN",
            class: "Y",
            priceLevel: "C",
            numberOfSeat: 3,
            price: 100000,
            datetime: "2016-10-15T11:51:05.000Z"
        },
        {
            code: "BMVHAN",
            depart: "BMV",
            arrive: "HAN",
            class: "Y",
            priceLevel: "E",
            numberOfSeat: 20,
            price: 300000,
            datetime: "2016-10-15T11:51:05.000Z"
        },
        {
            code: "BMVSGN",
            depart: "BMV",
            arrive: "SGN",
            class: "Y",
            priceLevel: "F",
            numberOfSeat: 20,
            price: 100000,
            datetime: "2016-10-15T11:51:05.000Z"
        },
        {
            code: "SGNBMV",
            depart: "SGN",
            arrive: "BMV",
            class: "Y",
            priceLevel: "F",
            numberOfSeat: 20,
            price: 100000,
            datetime: "2016-10-16T11:51:05.000Z"
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

var findDepartureFlight = function (query, departureDate, callback) {
    Flight.find(query).where('datetime').gte(departureDate).exec(function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

var findReturnFlight = function (query, departureDate, returnDate, callback) {
    Flight.find(query).where('datetime').gte(departureDate).ls(returnDate).exec(function (err, flights) {
        if (err) {
            return callback(err);
        }

        return callback(null, flights);
    });
};

// Flight search route
// If query.return date != null then it is round trip flight,
module.exports.getFlights = function (req, res) {
  this.getOneWayFlights(req, res);
};

// Get one-way flights by query
module.exports.getOneWayFlights = function (req, res) {

    // Get query parameters
    var query = {};
    query.depart = req.query.from;
    query.arrive = req.query.to;

    var departureDate = Date.parse(req.query.depart),
        numberOfPassenger = req.query.passengers;

    // Check valid departure date
    if (!departureDate) {
        res.status(400).end('Invalid departure date');
        return;
    }

    // Find flight
    findDepartureFlight(query, departureDate, function (err, flights) {
        if (err) {
            res.status(400).send('Oops! Something went wrong...');
            console.log(err);
        } else {
            var responseFlights = [];
            console.log(flights);

            if (flights.length == 0) {
                res.json([]);
                return;
            }

            // Loop through flights and check available slot
            flights.forEach(function (flight, index) {

                flightDetailController.countAvailableSlot(flight, function (err, availableSlot) {
                    console.log(availableSlot + '-' + numberOfPassenger);
                    if (availableSlot >= numberOfPassenger)
                        responseFlights.push(flight);

                    // Response after the last item
                    if (index == flights.length - 1)
                        res.json(responseFlights);
                });
            });
        }
    });
};

// Get round-trip flight by query
module.exports.getRoundTripFlight = function (req, res) {


    var noiDi = req.query.noidi;
    var noiDen = req.query.noiden;
    var ngayDi = new Date(req.query.ngaydi);
    var ngayVe = new Date(req.query.ngayve);
    var soLuongHanhKhach = parseInt(req.query.soluonghanhkhach);
    if (soLuongHanhKhach == null) soLuongHanhKhach = 1;
    if (noiDi == null || noiDen == null || ngayDi == "Invalid Date") {
        res.status(400).send("Chưa cung cấp đủ thông tin");
        return;
    }


    var returnData = {};
    //lấy các chuyến bay thõa nơi đi, nơi đến và ngày giờ (chưa xét số lượng hành khách)
    Flight.find({
        'noidi': noiDi,
        'noiden': noiDen,
        'ngaygio': {
            $gte: new Date(ngayDi.getYear() + 1900, ngayDi.getMonth(), ngayDi.getDate()),
            $lt: new Date(ngayDi.getYear() + 1900, ngayDi.getMonth(), ngayDi.getDate() + 1)
        }
    }, function (err, data) {
        if (err) {
            res.status(404).send("Lỗi lấy chuyến bay đi");
        } else {
            ngayDi;
            returnData.chuyenbaydi = data;
            if (ngayVe != "Invalid Date") {
                Flight.find({
                    'noidi': noiDen,
                    'noiden': noiDi,
                    'ngaygio': {
                        $gte: new Date(ngayVe.getYear() + 1900, ngayVe.getMonth(), ngayVe.getDate()),
                        $lt: new Date(ngayVe.getYear() + 1900, ngayVe.getMonth(), ngayVe.getDate() + 1)

                    }
                }, function (err, data) {
                    if (err) {
                        res.status(404).send("Lỗi lấy chuyến bay về");
                    } else {
                        returnData.chuyenbayve = data;
                        filtResult(req, res, returnData, soLuongHanhKhach);
                        //res.status(200).json(returnData);
                    }
                });
            } else {
                filtResult(req, res, returnData, soLuongHanhKhach);
                //res.status(200).json(returnData);
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
