var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var dbHandler = require('../config/mongoose');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/flights',function(req,res){
//   dbHandler.addFlight(req,res);
// });
//
// router.get('/flights',function(req,res){
//   dbHandler.getFlights(req,res);
// });
//
// router.delete('/flights/:id',function(req,res){
//   dbHandler.deleteFlight(req,res);
// });
//
// router.get('/airports',function(req,res){
//   dbHandler.getAirports(req,res);
// });
//
// //lay ma san bay den dua vao san bay di
// router.get('/airports/:id',function(req,res){
//   dbHandler.getAirports(req,res);
// });
// //them ma san bay den dua vao ma san bay di
// router.post('/airports/:id',function(req,res){
//   dbHandler.addFlightCode(req,res);
// });
//
// router.post('/airports',function(req,res){
//   dbHandler.addAirport(req,res);
// });
//
// //them san bay den dua vao san bay di
// // router.post('/airports/:id',function(req,res){
// //   var data = req.body;
// //   dbHandler.addToAirport(data,req,res);
// // });
//
// router.get('/books/:id',function(req,res){
//   dbHandler.getBooks(req,res);
// });
//
// router.post('/books',function(req,res){
//   dbHandler.addBook(req,res)
// })
module.exports = router;
