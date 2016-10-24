var dashboardModule = angular.module('lotusAirline.dashboard', []);

dashboardModule.controller('DashboardCtrl', ['$scope', '$timeout', 'Airports', 'Flights', function ($scope, $timeout, Airports, Flights) {

    $scope.departures = [];
    $scope.arrivals = [];

    $scope.departureCountry = 0;
    $scope.departureAirports = [];

    $scope.arrivalCountry = 0;
    $scope.arrivalAirports = [];

    $scope.arriveAt = new Date();
    $scope.departAt = new Date();

    $scope.flight =  {
        depart: "",
        arrive: "",
        departAt: new Date(),
        arriveAt: new Date()
    };

    $scope.tickets = [];
    $scope.ticket = {};

    $scope.message = '';

    function init() {
        $scope.departureCountry = 0;
        $scope.departureAirports = [];

        $scope.arrivalCountry = 0;
        $scope.arrivalAirports = [];

        $scope.arriveAt = new Date();
        $scope.departAt = new Date();

        $scope.flight =  {
            depart: "",
            arrive: "",
            departAt: new Date(),
            arriveAt: new Date()
        };

        $scope.tickets = [];
        $scope.ticket = {};
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

        if (newVal) {
            var arrivalAirports = Airports.query({depart: newVal}, function () {
                $scope.arrivals = arrivalAirports;
                console.log(arrivalAirports);
            });
        }

        console.log(newVal);
    });

    $scope.addTicket = function () {
        $scope.tickets.push(JSON.parse(JSON.stringify($scope.ticket)));
        $scope.ticket = {};
    };

    $scope.addNewFlight = function () {

        $scope.message = "Processing... Please wait!";

        $scope.flight.departAt = $scope.departAt.getTime();
        $scope.flight.arriveAt = $scope.arriveAt.getTime();
        Flights.save({flight: $scope.flight, tickets: $scope.tickets}, function () {
            $scope.message = "Flight was added successfully!";

            $timeout(function () {
                $scope.message = "";
                init();
            }, 1500);
        });
    }
}]);

