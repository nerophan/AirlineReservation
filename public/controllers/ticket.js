/**
 * Created by ApisMantis on 10/23/2016.
 */

var ticketResultModule = angular.module('lotusAirline.ticketResults', []);
ticketResultModule.controller('TicketCtrl', ['$scope', '$window', '$http', '$rootScope', '$location', '$timeout',
    function ($scope, $window, $http, $rootScope, $location, $timeout) {

        $scope.currIndex = -1;
        $scope.totalCost = 0;

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

            $scope.totalCost = getTotalCost();
            console.log($scope.totalCost);
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

        // Get total cost
        function getTotalCost() {
            var departCost = 0;
            var returnCost = 0;

            if (typeof $rootScope.data.departTicket.price != 'undefined')
                departCost = $rootScope.data.departTicket.price;

            if (typeof $rootScope.data.returnTicket.price != 'undefined')
                returnCost = $rootScope.data.returnTicket.price;

            return departCost * $rootScope.data.passengers + returnCost * $rootScope.data.passengers;
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
            var mm = date.getMonth() + 1;
            var yyyy = date.getYear() + 1900;

            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return dd + "/" + mm + "/" + yyyy;
        };

        // Format money
        $rootScope.formatMoney = function (money) {
            money = money + "";
            var moneyF = "";
            var i;

            if(money.length <= 3)
                return money;

            for(i = money.length; i >= 3; i -= 3) {
                if(i != money.length)
                    moneyF = money.substr(i - 3, 3) + "." + moneyF;
                else
                    moneyF = money.substr(i - 3, 3);
            }

            if(i == 0)
                moneyF = money.substr(0, i) + moneyF;
            else
                moneyF = money.substr(0, i) + "." + moneyF;

            return moneyF;
        };
    }]);
