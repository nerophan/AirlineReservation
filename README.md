# AirlineReservation
Mô tả các API
## Trả về các mã sân bay đi có trong CSDL
### URL: 
**/from-airports**
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
**/from-airports/:id**
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

## Tạo đặt chỗ mới
### URL: 
**/book**
### Method:
**POST**
### URL params:
### Data params:
```
{
  "book":{
    "thoigiandatcho": Date
    "tongtien" : Number
  },
  "flightdetail":[
    {
      "machuyenbay":String,
      "ngay": Date,
      "hang": String,
      "mucgia": String
    },
    ...
  ],
  "passenger":[
    {
      "danhxung": String,
      "ho":String,
      "ten": String
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
  "book":{
    _**"id"**_: String,
    "thoigiandatcho": Date
    "tongtien" : Number,
    _**"trangthai"**_: Number (0 (default): đang đặt chỗ|1: đã đặt)
  },
  "flightdetail":[
    {
      "machuyenbay":String,
      "ngay": Date,
      "hang": String,
      "mucgia": String
    },
    ...
  ],
  "passenger":[
    {
      "danhxung": String,
      "ho":String,
      "ten": String
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
  "book":{
    _**"id"**_: String,
    "thoigiandatcho": Date
    "tongtien" : Number,
    _**"trangthai"**_: Number (0|1)
  },
  "flightdetail":[
    {
      "machuyenbay":String,
      "ngay": Date,
      "hang": String,
      "mucgia": String
    },
    ...
  ],
  "passenger":[
    {
      "danhxung": String,
      "ho":String,
      "ten": String
    },
    ...
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
