/**
 * Created by ApisMantis on 10/23/2016.
 */

var passengerInforModule = angular.module('lotusAirline.passengerInfor', []);

passengerInforModule.controller('PassengersCtrl', ['$scope', '$window', '$http', '$rootScope',
    function ($scope, $window, $http, $rootScope) {

        // Continue booking with current booking info
        $scope.continueBooking = function () {
            console.log($rootScope.bookingInfor);
            if (checkPassengerInfo())
                $window.location.href = "#/submition";
            else
                alert('Bạn chưa nhập đủ thông tin hành khách');
        };

        // Check passenger info
        checkPassengerInfo = function () {
            for (var i = 0; i < $rootScope.bookingInfor.passengers.length; i++) {
                if ($rootScope.bookingInfor.passengers[i].title == ""
                    || $rootScope.bookingInfor.passengers[i].firstName == ""
                    || $rootScope.bookingInfor.passengers[i].lastName == "")
                    return false;
            }

            return true;
        }

    }]);
