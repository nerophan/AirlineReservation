angular.module('lotusAirline.flightRoute', [])
    .factory('FlightRoutes', ['$resource', function ($resource) {
    return $resource('/routes');
}]);
