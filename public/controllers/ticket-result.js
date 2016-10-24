/**
 * Created by ApisMantis on 10/23/2016.
 */

var ticketResultModule = angular.module('lotusAirline.ticketResults', []);
ticketResultModule.controller('TicketCtrl', ['$scope', '$window', '$http', '$rootScope', '$location', '$timeout',
    function ($scope, $window, $http, $rootScope, $location, $timeout) {

        $scope.currIndex = -1;

        // Booking infor - global variable
        $rootScope.bookingInfor = {
            "flights": [],
            "passengers": []
        };

        // Select ticket
        $scope.selectTicket = function ($index, type) {
            if (type == 'depart') {
                $rootScope.data.departTicket = $rootScope.departTickets[$index];
                updateFlights($rootScope.data.departTicket, type);
            }
            else {
                $rootScope.data.returnTicket = $rootScope.returnTickets[$index];
                updateFlights($rootScope.data.returnTicket, type);
            }

            console.log($scope.bookingInfor);
        };

        // Add new flight to booking infor
        function updateFlights(flight, type) {
            var newFlight = {
                "code": flight.code,
                "departAt": flight.departAt,
                "arriveAt": flight.arriveAt,
                "priceLevel": flight.priceLevel,
                "class": flight.class
            };

            var pos = 1;
            if (type == 'depart') pos = 0;

            if ($scope.bookingInfor.flights.length < pos + 1)
                $scope.bookingInfor.flights.push(newFlight);
            else
                $scope.bookingInfor.flights[pos] = newFlight;
        }

        $scope.continueBooking = function () {
            // Push passengers to data
            for (var i = 0; i < $rootScope.data.passengers; i++) {
                $rootScope.bookingInfor.passengers.push({
                    "title": "",
                    "firstName": "",
                    "lastName": ""
                });
            }

            $window.location.href = '#/get-passengers-information';
        };

        $scope.getTime = function (timestamp) {
            var date = new Date(timestamp);
            var hour = date.getHours();
            var minute = date.getMinutes();

            if (hour < 10) hour = '0' + hour;
            if (minute < 10) minute = '0' + minute;

            return hour + ":" + minute;
        };

        $scope.getDate = function (timestamp) {
            var date = new Date(timestamp);
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getYear();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return dd + "/" + mm + "/" + yyyy;
        };
    }]);
