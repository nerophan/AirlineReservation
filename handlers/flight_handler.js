/**
 * Created by hoang on 10/9/2016.
 */
var mongoose = require('mongoose');
require('../model/flight');
require('../model/flight_code');
require('../model/flight_detail');

var FlightDetail = mongoose.model('FlightDetail');
var FlightCode = mongoose.model('FlightCode');
var Flight = mongoose.model('Flight');
var flight = {};

flight.getFlights = function(req,res){
    // Flight.find({},function(err,flights){
    //     if(err) {
    //         console.error('Error fetching flights: ' + err);
    //         res.send(err);
    //     }
    //     res.json(flights);
    //
    // });
    var noiDi = req.query.noidi;
    var noiDen = req.query.noiden;
    var ngayDi = new Date(req.query.ngaydi);
    var ngayVe = new Date(req.query.ngayve);
    var soLuongHanhKhach = parseInt(req.query.soluonghanhkhach);
    if(soLuongHanhKhach == null) soLuongHanhKhach = 1;
    if(noiDi == null || noiDen == null || ngayDi == "Invalid Date"){
        res.status(400).send("Chưa cung cấp đủ thông tin");
        return;
    }
    var returnData = {};
    //lấy các chuyến bay thõa nơi đi, nơi đến và ngày giờ (chưa xét số lượng hành khách)
    Flight.find({'noidi':noiDi,'noiden':noiDen,'ngaygio':{$gte: new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()),$lt:new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()+1)}},function(err,data){
        if(err){
            res.status(404).send("Lỗi lấy chuyến bay đi");
        }else{
            ngayDi;
            returnData.chuyenbaydi=data;
            if(ngayVe != "Invalid Date"){
                Flight.find({'noidi':noiDen,'noiden':noiDi,'ngaygio':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()+1)}},function(err,data){
                    if(err){
                        res.status(404).send("Lỗi lấy chuyến bay về");
                    }else{
                        returnData.chuyenbayve=data;
                        filtResult(req,res,returnData,soLuongHanhKhach);
                        //res.status(200).json(returnData);
                    }
                });
            }else{
                filtResult(req,res,returnData,soLuongHanhKhach);
                //res.status(200).json(returnData);
            }
        }
    });
};

//lọc danh sách các chuyến bay dựa vào số lượng hành khách
var filtResult = function(req,res,Data,soLuongHanhKhach){
    var noiDi = req.query.noidi;
    var noiDen = req.query.noiden;
    var ngayDi = new Date(req.query.ngaydi);
    var ngayVe = new Date(req.query.ngayve);

    var maChuyenBayDi, maChuyenBayVe;
    //tim ma chuyen bay
    FlightCode.find({'noidi':noiDi,'noiden':noiDen},'ma',function(err,data){
        maChuyenBayDi = data[0].ma;
        var chuyenbaydiCount = Data.chuyenbaydi.length;
        var loopCount = 0;
        Data.chuyenbaydi.forEach(function(item,index){
            FlightDetail.count({'machuyenbay':maChuyenBayDi,'ngay':{$gte: new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()),$lt:new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()+1)},
                'hang':Data.chuyenbaydi[index].hang,'mucgia':Data.chuyenbaydi[index].mucgia},function(err,count){
                //không đủ số lượng ghế
                var i = Data.chuyenbaydi.indexOf(item);
                if(count + soLuongHanhKhach > Data.chuyenbaydi[i].soluongghe){
                    //xóa chuyến bay khỏi danh sách
                    Data.chuyenbaydi.splice(i,1);
                }
                loopCount++;
                if(loopCount == chuyenbaydiCount){

                    //
                    if(req.query.ngayve != null){
                        FlightCode.find({'noidi':noiDen,'noiden':noiDi},'ma',function(err,data){
                            maChuyenBayVe = data[0].ma;

                            var chuyenbayveCount = Data.chuyenbayve.length;
                            var loopCount = 0;
                            Data.chuyenbayve.forEach(function(item,index){
                                FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
                                    'hang':Data.chuyenbayve[index].hang,'mucgia':Data.chuyenbayve[index].mucgia},function(err,count){
                                    //không đủ số lượng ghế
                                    var i = Data.chuyenbayve.indexOf(item);
                                    if(count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe){
                                        //xóa chuyến bay khỏi danh sách
                                        Data.chuyenbayve.splice(i,1);
                                    }
                                    loopCount++;
                                    if(loopCount == chuyenbayveCount){
                                        res.status(200).json(Data);
                                    }
                                });
                            });
                        });
                    }else{
                        res.status(200).json(Data);
                    }
                    //

                }
            });
        });
    });
    // if(req.query.ngayve != null){
    //     FlightCode.find({'noidi':noiDen,'noiden':noiDi},'ma',function(err,data){
    //         maChuyenBayVe = data[0].ma;
    //
    //         var chuyenbayveCount = Data.chuyenbayve.length;
    //         var loopCount = 0;
    //         Data.chuyenbayve.forEach(function(item,index){
    //             FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
    //                 'hang':Data.chuyenbayve[index].hang,'mucgia':Data.chuyenbayve[index].mucgia},function(err,count){
    //                 //không đủ số lượng ghế
    //                 var i = Data.chuyenbayve.indexOf(item);
    //                 if(count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe){
    //                     //xóa chuyến bay khỏi danh sách
    //                     Data.chuyenbayve.splice(i,1);
    //                 }
    //                 loopCount++;
    //                 if(loopCount == chuyenbayveCount){
    //                     res.status(200).json(Data);
    //                 }
    //             });
    //         });
    //     });
    // }else{
    //     res.status(200).json(Data);
    // }

    //tim so luong da book

    //var tempDate = JSON.parse(JSON.stringify(Data));

    //lọc danh sách chuyến bay đi
    // for(var i=0;i<Data.chuyenbaydi.length;i++){
    //
    //     FlightDetail.count({'machuyenbay':maChuyenBayDi,'ngay':{$gte: new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate()-1),$lt:new Date(ngayDi.getYear()+1900,ngayDi.getMonth(),ngayDi.getDate())},
    //         'hang':Data.chuyenbaydi[i].hang,'mucgia':Data.chuyenbaydi[i].mucgia},function(err,count){
    //         //không đủ số lượng ghế
    //         if(count + soLuongHanhKhach > Data.chuyenbaydi[i].soluongghe){
    //             //xóa chuyến bay khỏi danh sách
    //             Data.chuyenbaydi.splice(i,1);
    //             i--;
    //         }
    //     });
    // }



    //
    //lọc danh sách chuyến bay về
    // if(maChuyenBayVe != undefined){
    //     // for(var i=0;i<Data.chuyenbayve.length;i++){
    //     //
    //     //     FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
    //     //         'hang':Data.chuyenbayve[i].hang,'mucgia':Data.chuyenbayve[i].mucgia},function(err,count){
    //     //         //không đủ số lượng ghế
    //     //         if(count + soLuongHanhKhach > Data.chuyenbayve[i].soluongghe){
    //     //             //xóa chuyến bay khỏi danh sách
    //     //             Data.chuyenbayve.splice(i,1);
    //     //             i--;
    //     //         }
    //     //     });
    //     // }
    //     Data.chuyenbayve.forEach(function(item,index){
    //         FlightDetail.count({'machuyenbay':maChuyenBayVe,'ngay':{$gte: new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate()-1),$lt:new Date(ngayVe.getYear()+1900,ngayVe.getMonth(),ngayVe.getDate())},
    //             'hang':Data.chuyenbayve[index].hang,'mucgia':Data.chuyenbayve[index].mucgia},function(err,count){
    //             //không đủ số lượng ghế
    //             if(count + soLuongHanhKhach > Data.chuyenbayve[index].soluongghe){
    //                 //xóa chuyến bay khỏi danh sách
    //                 Data.chuyenbayve.splice(index,1);
    //             }
    //         });
    //     });
    //     res.status(200).json(Data);
    // }else{
    //     res.status(200).json(Data);
    // }
};
flight.addFlight = function(req,res){
    var newFlight = req.body;
    Flight.create(newFlight,function(err,rs){
        if(err) res.send(err);
        else{
            res.json(rs);
        }
    });
};

flight.deleteFlight = function(req,res){//flight info can be in params or query or body
    //assume deleting a flight based on params
    var id = req.params.id;
    Flight.remove({_id:id},function(err){
        if(err){
            res.send(err);
        }else{
            flight.getFlights(res);
        }
    });
}

module.exports = flight;
