/**
 * Created by ApisMantis on 10/23/2016.
 */

var submitionModule = angular.module('lotusAirline.submition', []);

submitionModule.controller('SubmitionCtrl', ['$scope', '$window', '$http', '$rootScope', '$location',
    function ($scope, $window, $http, $rootScope, $location) {

        $scope.submitBooking = function () {

            $http.post("/bookings", $rootScope.bookingInfor)
                .then(function (response) {
                    console.log(response.data);
                });
        };
    }]);
