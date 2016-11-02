'use strict';

var app = angular.module('lotusAirline', [
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngResource',
    'lotusAirline.search',
    'lotusAirline.ticketResults',
    'lotusAirline.passengerInfor',
    'lotusAirline.submition',
    'lotusAirline.dashboard',
    'lotusAirline.login',
    'lotusAirline.airport',
    'lotusAirline.flight',
    'lotusAirline.route',
    'lotusAirline.flightRoute',
    'lotusAirline.booking']);

app.factory('authInterceptor', function ($rootScope, $q, $window, $cookies) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($cookies.get('accessToken')) {
                config.headers.token = $cookies.get('accessToken');
                console.log(config);
            }

            return config;
        },
        responseError: function (response) {
            // Return the promise rejection.
            // if (response.status == 401) {
            //     $window.location.href = "#/admin/login";
            // }
            // return response || $q.when(response);
        }
    };
});

app.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {

    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider.when('/', {
        templateUrl: 'views/search-flight.html',
        controller: 'SearchCtrl'

    }).when('/ticket-results', {
        templateUrl: 'views/ticket-result.html',
        controller: 'TicketCtrl'

    }).when('/get-passengers-information', {
        templateUrl: 'views/get-passenger-information.html',
        controller: 'PassengersCtrl'

    }).when('/submition', {
        templateUrl: 'views/submition.html',
        controller: 'SubmitionCtrl'

    }).when('/admin', {
        templateUrl: 'views/admin/dashboard.html',
        controller: 'DashboardCtrl'

    }).when('/admin/login', {
        templateUrl: 'views/admin/login.html',
        controller: 'LoginCtrl'

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

