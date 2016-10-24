/**
 * Created by ApisMantis on 10/23/2016.
 */

var passengerInforModule = angular.module('lotusAirline.passengerInfor', []);

passengerInforModule.controller('PassengersCtrl', ['$scope', '$window', '$http', '$rootScope',
    function ($scope, $window, $http, $rootScope) {

        $scope.continueBooking = function () {
            console.log($rootScope.bookingInfor);
            if (checkPassengerInfo())
                $window.location.href = "#/submition";
            else
                alert('Bạn chưa nhập đủ thông tin');
        };

        checkPassengerInfo = function () {
            for(var i = 0; i < $rootScope.bookingInfor.passengers.length; i++) {
                var pass = $rootScope.bookingInfor.passengers.length[i];
                
            }


            return true;
        }

    }]);
