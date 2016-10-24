/**
 * Created by ApisMantis on 10/23/2016.
 */

var ticketResultModule = angular.module('lotusAirline.ticketResults', []);
ticketResultModule.controller('TicketCtrl', ['$scope', '$window', '$http', '$rootScope', '$location', '$timeout',
    function ($scope, $window, $http, $rootScope, $location, $timeout) {

        $scope.currIndex = -1;

        // Booking infor
        $rootScope.bookingInfor = {
            "flights": [
                {
                    "code": "",
                    "departAt": 0,
                    "arriveAt": 0,
                    "priceLevel": "",
                    "class": ""
                }
            ],
            "passengers": [
                {
                    "title": "",
                    "firstName": "",
                    "lastName": ""
                }
            ]
        };

        $scope.selectTicket = function ($index, type) {
            if (type == 'depart')
                $scope.departTicket = $rootScope.departTickets[$index];
            else
                $scope.returnTicket = $rootScope.returnTickets[$index];

            updateBookingInfor();
            console.log($scope.bookingInfor);
            console.log($scope.departTicket);
            console.log($scope.returnTicket);
        };

        function updateBookingInfor() {
            // Update depart root
            $scope.bookingInfor.flights[0].code = $scope.departTicket.code;
            $scope.bookingInfor.flights[0].departAt = $scope.departTicket.departAt;
            $scope.bookingInfor.flights[0].arriveAt = $scope.departTicket.arriveAt;
            $scope.bookingInfor.flights[0].priceLevel = $scope.departTicket.priceLevel;
            $scope.bookingInfor.flights[0].class = $scope.departTicket.class;

            // Update arrival root
            // $scope.bookingInfor.flights[1].code = $scope.returnTicket.code;
            // $scope.bookingInfor.flights[1].departAt = $scope.returnTicket.departAt;
            // $scope.bookingInfor.flights[1].arriveAt = $scope.returnTicket.arriveAt;
            // $scope.bookingInfor.flights[1].priceLevel = $scope.returnTicket.priceLevel;
            // $scope.bookingInfor.flights[1].class = $scope.returnTicket.class;
        }

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
