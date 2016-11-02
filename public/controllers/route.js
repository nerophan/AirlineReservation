angular.module('lotusAirline.route', [])
    .controller('RouteCtrl', ['$scope', '$timeout', 'Airports', 'FlightRoutes', '$rootScope', '$window',
        function ($scope, $timeout, Airports, FlightRoutes, $rootScope, $window) {

            if ($window.sessionStorage.getItem('user') == null) {
                console.log('User is null');
                $window.location.href = "#/admin/login";
            }

            $scope.departures = [];
            $scope.arrivals = [];

            $scope.departureCountry = 0;
            $scope.departureAirports = [];

            $scope.arrivalCountry = 0;
            $scope.arrivalAirports = [];

            $scope.departureRouteAirport = "";
            $scope.arrivalRouteAirport = "";
            $scope.msg = "";

            $scope.message = {
                type: '',
                content: ''
            };

            function init() {
                $scope.departureCountry = 0;
                $scope.departureAirports = [];

                $scope.arrivalCountry = 0;
                $scope.arrivalAirports = [];
            };

            var airports = Airports.query(function () {
                $scope.departures = airports;
                $scope.arrivals = airports;
            });

            $scope.$watch('departureCountry', function (newVal, oldVal) {
                if ($scope.departures[newVal])
                    $scope.departureAirports = $scope.departures[newVal].airports;
            });

            $scope.$watch('arrivalCountry', function (newVal, oldVal) {
                if ($scope.arrivals[newVal])
                    $scope.arrivalAirports = $scope.arrivals[newVal].airports;
            });

            $scope.$watch('arrivalRouteAirport', function (newVal, oldVal) {
                if (newVal == $scope.departureRouteAirport && newVal != "") {
                    $scope.message = {
                        type: 'error',
                        content: 'Departure airport and arrival airport must be difference!'
                    }
                } else $scope.message = {};
            });

            $scope.$watch('departureRouteAirport', function (newVal, oldVal) {
                if (newVal == $scope.arrivalRouteAirport && newVal != "") {
                    $scope.message = {
                        type: 'error',
                        content: 'Departure airport and arrival airport must be difference!'
                    }
                } else {
                    $scope.message = {};
                }
            });

            $scope.addNewRoute = function () {

                if (!$scope.departureRouteAirport) {
                    $scope.message = {
                        type: 'error',
                        content: 'Departure airport can not be blank.'
                    };

                    return;
                }

                if (!$scope.arrivalRouteAirport) {
                    $scope.message = {
                        type: 'error',
                        content: 'Arrival airport can not be blank.'
                    };
                    return;
                }


                $scope.msg = "Processing... Please wait!";

                FlightRoutes.save({
                    code: $scope.departureRouteAirport + $scope.arrivalRouteAirport,
                    from: $scope.departureRouteAirport,
                    to: $scope.arrivalRouteAirport
                }, function () {
                    $scope.message = {
                        type: 'success',
                        content: 'Route was added successfully'
                    };
                });
            }
        }]);

