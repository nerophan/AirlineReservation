var express = require('express'),
    mongoose = require('./mongoose'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

require('./../models/airport.model');
require('./../models/booking.model');
require('./../models/flightdetail.model');
require('./../models/flight.model');
require('./../models/passenger.model');
require('./../models/account.model');
require('./../models/route.model');

var routes = require('./../routes/index.route.js'),
    accounts = require('./../routes/account.route'),
    flight = require('./../routes/flight.route'),
    booking = require('./../routes/booking.route'),
    flightDetail = require('./../routes/flightdetail.route'),
    passenger = require('./../routes/passenger.route'),
    airport = require('./../routes/airport.route'),
    route = require('./../routes/route.route');

var app = express();
mongoose.connect();

// view engine setup
app.set('views', path.resolve('./app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

app.use('/', routes);
app.use('/accounts', accounts);
app.use('/flights', flight);

app.use('/bookings', booking);
app.use('/flight-details', flightDetail);
app.use('/passengers', passenger);
app.use('/airports', airport);
app.use('/routes', route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error controllers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
