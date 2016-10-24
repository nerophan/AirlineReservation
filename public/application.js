'use strict';

var app = angular.module('lotusAirline', [
    'ngRoute',
    'ngSanitize',
    'lotusAirline.search',
    'lotusAirline.ticketResults',
    'lotusAirline.passengerInfor',
    'lotusAirline.submition']);

app.factory('tickets', function () {
    var oneWayTicket = {
        "_id": '',
        "code": '',
        "depart": '',
        "arrive": '',
        "class": '',
        "priceLevel": '',
        "numberOfSeat": 0,
        "price": 0,
        "__v": 0,
        "datetime": 0
    };
    var roundTripTicket = {
        "return": [
            {
                "_id": '',
                "code": '',
                "depart": '',
                "arrive": '',
                "class": '',
                "priceLevel": '',
                "numberOfSeat": 0,
                "price": 0,
                "__v": 0,
                "datetime": 0
            }
        ],
        "depart": [
            {
                "_id": '',
                "code": '',
                "depart": '',
                "arrive": '',
                "class": '',
                "priceLevel": '',
                "numberOfSeat": 0,
                "price": 0,
                "__v": 0,
                "datetime": 0
            }
        ]
    };

    return {
        getOneWayTicket: function () {
            return oneWayTicket;
        },

        getRounfTripTicket: function () {
            return roundTripTicket;
        }
    };
});

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/search-flight.html',
        controller: 'SearchCtrl'

    }).when('/ticket-results', {
        templateUrl: 'views/ticket-result.html',
        controller: 'TicketResultCtrl'

    }).when('/get-passengers-information', {
        templateUrl: 'views/passenger-information.html',
        controller: 'PassengersCtrl'

    }).when('/search', {
        templateUrl: 'views/submition.html',
        controller: 'SubmitionCtrl'

    }).otherwise({
        redirectTo: '/'
    });
}]);

