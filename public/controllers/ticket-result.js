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

        // Select ticket handler
        $scope.selectTicket = function ($index, type) {
            if (type == 'depart') {
                $rootScope.data.departTicket = $rootScope.departTickets[$index];
                updateFlights($rootScope.data.departTicket, type);
            }
            else {
                $rootScope.data.returnTicket = $rootScope.returnTickets[$index];
                updateFlights($rootScope.data.returnTicket, type);
            }

            console.log($rootScope.bookingInfor);
            console.log($rootScope.data);
        };

        // Add new flight to booking info
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

            if ($rootScope.bookingInfor.flights.length < pos + 1)
                $rootScope.bookingInfor.flights.push(newFlight);
            else
                $rootScope.bookingInfor.flights[pos] = newFlight;
        }

        // Continue booking
        $scope.continueBooking = function () {
            // Check booking info
            if ($rootScope.bookingInfor.flights.length == 0
                || ($rootScope.data.type == 'round-trip' && $rootScope.bookingInfor.flights.length != 2)) {
                alert('Bạn chưa chọn chuyến bay về');
                return;
            }

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

        // Get time (HH:MM) from timestamp
        $rootScope.getTime = function (timestamp) {
            var date = new Date(timestamp);
            var hour = date.getHours();
            var minute = date.getMinutes();

            if (hour < 10) hour = '0' + hour;
            if (minute < 10) minute = '0' + minute;

            return hour + ":" + minute;
        };

        // Get date (HH:MM) from timestamp
        $rootScope.getDate = function (timestamp) {
            var date = new Date(timestamp);
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getYear();

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return dd + "/" + mm + "/" + yyyy;
        };
    }]);
