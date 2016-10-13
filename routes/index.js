var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var dbHandler = require('../handlers/db_handler');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/airports',function(req,res){
//   var data = req.body;
//   dbHandler.addAirport(data,res);
// });
// router.get('/airports',function(req,res){
//   dbHandler.getAirports(res);
// });
// router.delete('/airports/:id',function(req,res){
//   dbHandler.deleteAirport(req,res);
// });

router.post('/flights',function(req,res){
  var data = req.body;
  dbHandler.addFlight(data,req,res);
});

router.get('/flights',function(req,res){
  dbHandler.getFlights(req,res);
});

router.delete('/flights/:id',function(req,res){
  dbHandler.deleteFlight(req,res);
});

router.get('/from-airports',function(req,res){
  dbHandler.getFromAirports(req,res);
})

router.post('/from-airports',function(req,res){
  var data = req.body;
  dbHandler.addFromAirport(data,req,res);
});

//lay ma san bay den dua vao san bay di
router.get('/from-airports/:id',function(req,res){
  dbHandler.getToAirports(req,res);
});
//them san bay den dua vao san bay di
router.post('/from-airports/:id',function(req,res){
  var data = req.body;
  dbHandler.addToAirport(data,req,res);
});

module.exports = router;
