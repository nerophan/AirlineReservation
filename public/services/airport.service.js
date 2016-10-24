angular.module('lotusAirline.airport', []).factory('Airports', ['$resource', function ($resource) {
        return $resource('/airports/:airportCode');
}]);
