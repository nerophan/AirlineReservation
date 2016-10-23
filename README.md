# AirlineReservation
Mô tả các API 

Lưu ý: _Ví dụ dữ liệu Date: "Tue Dec 25 2012 00:00:00 GMT+0700 (SE Asia Standard Time)"_
## Trả về các mã sân bay đi có trong CSDL
### URL: 
**/airports**
### Method:
**GET**
### URL params:
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
  [
    {
      "_id": "57ff470c9230b4118c24627e",
      "nhom": "Việt Nam",
      "ma": "BMV",
      "ten": "Buôn Ma Thuột",
      "__v": 0
    },
    ...
  ]
```
### Error Response:
 * Code: 404 (not found)
  * Content: error

## Trả về các mã sân bay đến tương ứng với sân bay đi
### URL: 
**/airports/:id**
### Method:
**GET**
### URL params:
id: mã sân bay đi
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
  [
    {
      "_id": "57ff470c9230b4118c24627e",
      "nhom": "Việt Nam",
      "ma": "BMV",
      "ten": "Buôn Ma Thuột",
      "__v": 0
    },
    ...
  ]
```
### Error Response:
 * Code: 404 (not found)
  * Content: error

## Tạo đặt chỗ mới:
### URL: 
**/book**
### Method:
**POST**
### URL params:
### Data params:
```
{
  "flights":[
    {
      "code": String,
      "datetime":Timestamp,
      "priceLevel": String,
      "class": String,
    },
    {
      "code": String,
      "datetime":Timestamp,
      "priceLevel": String,
      "class": String,
    }
  ],
  "passengers":[
    {
      "gender": String,
      "firstName":String,
      "lastName": String
    },
    {
      "gender": String,
      "firstName":String,
      "lastName": String
    }...
  ]
}
``` 

*Nếu chuyến bay 1 chiều thì mảng flights chỉ có 1 object* 

### Success Response:
* Code: 200/201 (success)
 * Content:
```
{
  "book":{
    _**"id"**_: String,
    "thoigiandatcho": Timestamp
    "tongtien" : Number,
    _**"trangthai"**_: 0
  },
  "flightdetail":[
    {
      _**"madatcho"**_: String,
      "machuyenbay":String,
      "ngay": Timestamp,
      "hang": String,
      "mucgia": String
    },
    ...
  ]
}
```
### Error Response:
 * Code: 400 (bad request)
  * Content: error

## Thông tin đặt chỗ
### URL: 
**/book/:id**
### Method:
**GET**
### URL params:
id: id mã đặt chỗ
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
{
    "id": String,
    "status": Integer,
    "details": [ {
      "flightId": String,
      "departure": String,
      "arrival": String,
      "flightTime": String,
      "class": String,
      "price": String,
      "priceLevel": String,  
      }...
    ],
    "passenger": [{
        "gender": String,
        "firstName":String,
        "lastName": String
      }, ...
     ]
}

```
### Error Response:
 * Code: 404 (not found)
  * Content: error
  
## Danh sách hành khách
### URL: 
**/passengers**
### Method:
**GET**
### URL params:
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
[
  {
    "madatcho":String,
    "danhxung": String,
    "ho": String,
    "ten": String
  },
  ...
]
```
### Error Response:
 * Code: 404 (not found)
  * Content: error
  
## Danh sách hành khách theo chuyến bay
### URL: 
**/passengers?*_querystring_*** 

querystring:
 * Required:
  * machuyenbay: String
  * ngay: Date
 * Optional:
  * hang: String
  * mucgia: String 
  
### Method:
**GET**
### URL params:
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
[
  {
    "madatcho":String,
    "danhxung": String,
    "ho": String,
    "ten": String
  },
  ...
]
```
### Error Response:
 * Code: 404 (not found)
  * Content: error

## Danh sách chuyến bay thõa mãn nơi đi, nơi đến, ngày đi, ngày về, số lượng hành khách
### URL: 
**/flights?*_querystring_*** 

querystring:
 * Required:
  * noidi: String
  * noiden: String
  * ngaydi: Date
 * Optional:
  * ngayve: Date,
  * soluonghanhkhach: Number (nếu không mô tả thì mặc định là 1)
  
### Method:
**GET**
### URL params:
### Data params:
### Success Response:
* Code: 200 (success)
 * Content:
```
{
  "chuyenbaydi":[
    {
      "ma":String,
      "noidi": String,
      "noiden": String,
      "ngay": Date,
      "hang": String,
      "mucgia": String,
      "soluongghe": Number,
      "giaban": Number
    },
    ...
  ],
  "chuyenbayve":[
    {
      "ma":String,
      "noidi": String,
      "noiden": String,
      "ngay": Date,
      "hang": String,
      "mucgia": String,
      "soluongghe": Number,
      "giaban": Number
    },
    ...
  ]
}
```
_"chuyenbayve" sẽ không có nếu query không có ngayve_
### Error Response:
 * Code: 404 (not found)
  * Content: error

## Thêm hành khách
### URL: 
**/passengers** 
  
### Method:
**POST**
### URL params:
### Data params:
```
{
  "madatcho":String,
  "passenger":[
     {
       "danhxung":String
       "ho":String
       "ten":String
     },
     ...
  ]
}
```
### Success Response:
* Code: 200 (success)
 * Content:
```
{
  "booking":{
      "ma":String,
      "thoigiandatcho": Timestamp,
      "tongtien": Number,
      "trangthai": 1
      }
  ,
  "flightdetail":[
    {
      "machuyenbay":String,
      "ngay": Timestamp,
      "hang": String,
      "mucgia": String
    },
    ...
  ],
  "passenger":[
    {
      "danhxung":String,
      "ho":String,
      "ten":String
    },
    ...
  ]
}
```
### Error Response:
 * Code: 400 (bad request)
  * Content: error

