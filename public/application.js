'use strict';

var app = angular.module('lotusAirline', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'lotusAirline.search',
    'lotusAirline.ticketResults',
    'lotusAirline.passengerInfor',
    'lotusAirline.submition',
    'lotusAirline.dashboard',
    'lotusAirline.airport',
    'lotusAirline.flight',
    'lotusAirline.route',
    'lotusAirline.flightRoute',
    'lotusAirline.booking']);

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/search-flight.html',
        controller: 'SearchCtrl'

    }).when('/ticket-results', {
        templateUrl: 'views/ticket-result.html',
        controller: 'TicketCtrl'

    }).when('/get-passengers-information', {
        templateUrl: 'views/passenger-information.html',
        controller: 'PassengersCtrl'

    }).when('/submition', {
        templateUrl: 'views/submition.html',
        controller: 'SubmitionCtrl'

    }).when('/admin', {
        templateUrl: 'views/admin/dashboard.html',
        controller: 'DashboardCtrl'
    }).when('/admin/route', {
        templateUrl: 'views/admin/route.html',
        controller: 'RouteCtrl'
    }).when('/admin/booking', {
        templateUrl: 'views/admin/booking.html',
        controller: 'BookingCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);

