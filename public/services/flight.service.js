angular.module('lotusAirline.flight', []).factory('Flights', ['$resource', function ($resource) {
    return $resource('/flights/:flightCode');
}]);
