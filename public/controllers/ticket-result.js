/**
 * Created by ApisMantis on 10/23/2016.
 */

var ticketResultModule = angular.module('lotusAirline.ticketResults', []);

ticketResultModule.controller('TicketCtrl', ['$scope', '$window', '$http', '$rootScope', '$location',
    function ($scope, $window, $http, $rootScope, $location) {

        $scope.currIndex = -1;

        $scope.showTicketDetail = function ($index) {

            getTotalCost();

            // Show ticket detail
            $scope.currIndex = $index;
        };

        function getTotalCost() {
            
        }

        $scope.getTime = function (timestamp) {
            var date = new Date(timestamp);
            var hour = date.getHours();
            var minute = date.getMinutes();

            if(hour < 10) hour = '0' + hour;
            if(minute < 10) minute = '0' + minute;

            return hour + ":" + minute;
        };

        $scope.getDate = function (timestamp) {
            var date = new Date(timestamp);
            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getYear();

            if(dd < 10) dd = '0' + dd;
            if(mm < 10) mm = '0' + mm;

            return dd + "/" + mm + "/" + yyyy;
        };
    }]);
