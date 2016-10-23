/**
 * Created by hoang on 10/15/2016.
 */
var mongoose = require('mongoose'),
    Airport = mongoose.model('Airport'),
    FlightCode = mongoose.model('FlightDetail');

var airport = {};

airport.getAllAirports = function (req, res) {
    Airport.find({}, function (err, airports) {
        if (err) {
            res.status(400).end(err.toString());
        } else {
            res.json(airports);
        }
    });
};

airport.addSampleData = function (req, res) {
    var airports = [
        {
            country: "Việt Nam",
            code: "BMV",
            name: "Buôn Ma Thuột"
        },
        {
            country: "Việt Nam",
            code: "VCL",
            name: "Chu Lai"
        },
        {
            country: "Việt Nam",
            code: "CAH",
            name: "Cà Mau"
        },
        {
            country: "Việt Nam",
            code: "VCS",
            name: "Côn Đảo"
        },
        {
            country: "Việt Nam",
            code: "VCA",
            name: "Cần Thơ"
        },
        {
            country: "Việt Nam",
            code: "HUI",
            name: "Huế"
        },
        {
            code: "HAN",
            country: "Việt Nam",
            name: "Hà Nội"
        },
        {
            code: "SGN",
            country: "Việt Nam",
            name: "Tp Hồ Chí Minh"
        },
        {
            country: "Việt Nam",
            code: "HPH",
            name: "Hải Phòng"
        },
        {
            country: "Việt Nam",
            code: "CXR",
            name: "Nha Trang"
        },
        {
            country: "Việt Nam",
            code: "PQC",
            name: "Phú Quốc"
        },
        {
            country: "Việt Nam",
            code: "PXU",
            name: "Pleiku"
        },
        {
            country: "Việt Nam",
            code: "UIH",
            name: "Quy Nhơn"
        },
        {
            country: "Việt Nam",
            code: "VKG",
            name: "Rạch Giá"
        },
        {
            country: "Việt Nam",
            code: "THD",
            name: "Thanh Hóa"
        },
        {
            country: "Việt Nam",
            code: "VII",
            name: "Tp Vinh"
        },
        {
            country: "Việt Nam",
            code: "TBB",
            name: "Tuy Hòa"
        },
        {
            country: "Việt Nam",
            code: "DIN",
            name: "Điện Biên"
        },
        {
            country: "Việt Nam",
            code: "DLI",
            name: "Đà Lạt"
        },
        {
            country: "Việt Nam",
            code: "DAD",
            name: "Đà Nẵng"
        },
        {
            country: "Việt Nam",
            code: "VDH",
            name: "Đồng Hới"
        }
    ];

    var usa = [
        {
            country: "United States",
            code: "ATL",
            name: "Atlanta"
        },
        {
            country: "United States",
            code: "ORD",
            name: "Atlanta"
        },
        {
            country: "United States",
            code: "LAX",
            name: "Los Angeles"
        },
        {
            country: "United States",
            code: "JFK",
            name: "New York"
        },
        {
            country: "United States",
            code: "SFO",
            name: "San Francisco"
        },
        {
            country: "UK",
            code: "LHR",
            name: "London"
        },
        {
            code: "MAN",
            country: "UK",
            name: "Manchester"
        },
        {
            code: "LPL",
            country: "UK",
            name: "Liverpool"
        }
    ];

    usa.forEach(function (airport) {
        Airport.create(airport, function (err, data) {
            console.log(data);
        });
    });
};

airport.getDepartureAirports = function (req, res) {

    Airport.distinct('country', function (err, coutries) {
        if (err) {
            console.log(err);
            res.status(400).end(err.toString());
        } else {
            var responseAirports = [];

            coutries.forEach(function (country, index) {
                Airport.find({country: country}).select('name code -_id').exec(function (err, airports) {
                    responseAirports.push({country: country, airports: airports});
                    if (index == coutries.length - 1) {
                        res.json(responseAirports);
                    }
                });
            });
        }
    });
};

airport.get = function(req,res){
    var airportId = req.params.id;
    if(airportId == null) {
        Airport.find({}, function (err, data) {
            if (err) {
                res.status(404).send(err);
            } else {
                res.status(200).json(data);
            }
        });
    }else{
        var toAirportList = new Array();
        FlightCode.find({'noidi':airportId},'-_id noiden',function(err,data){
            if(err){
                console.log('không có sân bay đén tương ứng trong CSDL');
                return;
            }
            for(var i=0;i<data.length;i++){
                toAirportList.push(data[i].noiden);
            }
            Airport.find({'ma':{$in:toAirportList}},function(err,data){
                if (err) {
                    res.status(404).send(err);
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
