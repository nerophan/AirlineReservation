angular.module('lotusAirline.booking', [])
    .controller('BookingCtrl', ['$scope', '$timeout', '$filter', '$http', 'Flights', 'Airports', '$rootScope', '$window',
        function ($scope, $timeout, $filter, $http, Flights, Airports, $rootScope, $window) {

            if ($window.sessionStorage.getItem('user') == null) {
                console.log('User is null');
                $window.location.href = "#/admin/login";
            }

            $scope.flights = [];
            $scope.flightCode = "";
            $scope.bookings = [];
            $scope.message = "Loading data... Please wait!";

            $scope.bookingFlights = [];
            $scope.bookingPassengers = [];

            airportNames = new Map();

            $http.get('/flights/list').then(function (response) {
                $scope.flights = response.data;
                for (var i = 0; i < $scope.flights.length; i++) {
                    $scope.flights[i].departAt = $filter('date')($scope.flights[i].departAt, 'HH:mm -  dd/MM/yyyy');
                }

                $scope.flights.forEach(function (flight) {
                    airportNames.set(flight.depart.code, flight.depart.name);
                    airportNames.set(flight.arrive.code, flight.arrive.name);
                });

                $scope.message = 'Done!';
                $timeout(function () {
                    $scope.message = '';
                }, 1000);
            }, function (response) {
            });

            $scope.$watch('flightCode', function (newVal, oldVal) {

                if (!newVal)
                    return;
                $scope.message = "Loading data... Please wait!";
                $scope.bookings = [];

                $http.get('/flight-details/' + newVal).then(function (response) {
                    $scope.bookings = response.data;
                    $scope.message = 'Done!';
                    $timeout(function () {
                        $scope.message = '';
                    }, 1000);
                });
            });

            $scope.showBookingDetail = function (bookingCode) {
                $scope.bookingPassengers = [];
                $scope.bookingFlights = [];
                $scope.detailMessage = "Loading data... Please wait!";

                $http.get('bookings/' + bookingCode).then(function (response) {

                    $scope.detailMessage = "";
                    var tempFlights = response.data.flightdetails;
                    for (var i = 0; i < tempFlights.length; i++) {
                        tempFlights[i].depart = airportNames.get(tempFlights[i].depart);
                        tempFlights[i].arrive = airportNames.get(tempFlights[i].arrive);


                        tempFlights[i].departAt = new Date(tempFlights[i].departAt);
                        tempFlights[i].arriveAt = new Date(tempFlights[i].arriveAt);
                    }

                    console.log(tempFlights);

                    $scope.bookingFlights = tempFlights;
                    $scope.bookingPassengers = response.data.passengers;

                    console.log(response);
                });
            }
        }]);


