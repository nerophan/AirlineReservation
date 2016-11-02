var dashboardModule = angular.module('lotusAirline.dashboard', []);

dashboardModule.controller('DashboardCtrl', ['$scope', '$timeout', 'Airports', 'Flights', '$rootScope', '$window',
    function ($scope, $timeout, Airports, Flights, $rootScope, $window) {

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

        $scope.arriveAt = new Date();
        $scope.departAt = new Date();

        $scope.flight = {
            depart: "",
            arrive: "",
            departAt: new Date(),
            arriveAt: new Date()
        };

        $scope.tickets = [];
        $scope.ticket = {};

        $scope.message = '';
        $scope.routeMessage = '';

        var classPrices = new Map();
        var c = ['C', 'Y'];
        var p = ['E', 'F', 'G'];

        for (var i = 0; i < c.length; i++) {
            for (var j = 0; j < p.length; j++) {
                classPrices.set(c[i] + p[j], false);
            }
        }


        function init() {
            $scope.departureCountry = 0;
            $scope.departureAirports = [];

            $scope.arrivalCountry = 0;
            $scope.arrivalAirports = [];

            $scope.arriveAt = new Date();
            $scope.departAt = new Date();

            $scope.flight = {
                depart: "",
                arrive: "",
                departAt: new Date(),
                arriveAt: new Date()
            };

            $scope.tickets = [];
            $scope.ticket = {};

            $scope.message = "";

            for (var i = 0; i < c.length; i++) {
                for (var j = 0; j < p.length; j++) {
                    classPrices.set(c[i] + p[j], false);
                }
            }
        };

        var departureAirports = Airports.query(function () {
            $scope.departures = departureAirports;
        });

        $scope.$watch('departureCountry', function (newVal, oldVal) {
            if ($scope.departures[newVal])
                $scope.departureAirports = $scope.departures[newVal].airports;
        });

        $scope.$watch('arrivalCountry', function (newVal, oldVal) {
            if ($scope.arrivals[newVal])
                $scope.arrivalAirports = $scope.arrivals[newVal].airports;
        });

        $scope.$watch('flight.depart', function (newVal, oldVal) {
            $scope.routeMessage = "";

            if (newVal) {
                var arrivalAirports = Airports.query({depart: newVal}, function () {
                    if (arrivalAirports.length == 0) {
                        $scope.routeMessage = "There is no route flight. Please choose another departure airport.";
                    }
                    $scope.arrivals = arrivalAirports;
                });
            }

            console.log(newVal);
        });

        $scope.addTicket = function () {

            if (!$scope.ticket.class || !$scope.ticket.priceLevel || !$scope.ticket.numberOfSeat || !$scope.ticket.price) {
                $scope.message = "All field is required.";
                return;
            }

            if ($scope.ticket.numberOfSeat < 1) {
                $scope.message = "The number of seat must be grater than 0.";
                return;
            }

            if ($scope.ticket.price < 0) {
                $scope.message = "The price cannot be negative.";
                return;
            }

            if (classPrices.get($scope.ticket.class + $scope.ticket.priceLevel)) {
                $scope.message = "The tickets of kind class: " + $scope.ticket.class + ", price level: " + $scope.ticket.priceLevel +
                    " is already existed.";
                return;
            } else {
                classPrices.set($scope.ticket.class + $scope.ticket.priceLevel, true);
            }

            $scope.tickets.push(JSON.parse(JSON.stringify($scope.ticket)));
            $scope.ticket = {};
            $scope.message = "";
        };

        $scope.addNewFlight = function () {
            $scope.message = "";

            var currentTime = new Date().getTime();

            $scope.flight.departAt = $scope.departAt.getTime();
            $scope.flight.arriveAt = $scope.arriveAt.getTime();


            if ($scope.flight.departAt - currentTime < 6 * 3600 * 1000) {
                $scope.message = "The departure time must be larger than current at least 6 hours.";
                return;
            }

            if ($scope.flight.departAt >= $scope.flight.arriveAt) {
                $scope.message = "Invalid arrival time. The arrival time must be less than departure time.";
                return;
            }


            if (!$scope.flight.arrive || !$scope.flight.depart) {
                $scope.message = "Please fill both departure and arrival airport";
                return;
            }

            if (!$scope.tickets.length) {
                $scope.message = "Please add at least one type of ticket.";
                return;
            }


            $scope.message = "Processing... Please wait!";

            Flights.save({flight: $scope.flight, tickets: $scope.tickets}, function () {
                $scope.message = "Flight was added successfully!";

                $timeout(function () {
                    $scope.message = "";
                    init();
                }, 1500);
            });
        };

        $scope.removeTicket = function (index) {
            $scope.tickets.splice(index, 1);
        };

        $scope.resetForm = function () {
            init();
        }

    }]);


