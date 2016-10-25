/**
 * Created by ApisMantis on 10/23/2016.
 */

var submitionModule = angular.module('lotusAirline.submition', []);

submitionModule.controller('SubmitionCtrl', ['$scope', '$window', '$http', '$rootScope', '$location',
    function ($scope, $window, $http, $rootScope, $location) {

        $scope.submitBooking = function () {

            $http.post("/bookings", $rootScope.bookingInfor)
                .then(function successCallback(response) {
                    console.log(response.data);
                    $scope.ticketID = response.data.id;
                    $("#TicketInfoModal").modal("show");

                }, function errorCallback(responde) {
                    alert('Có lỗi xảy ra. Không thể đặt vé. Vui lòng thử lại sau!');
                });
        };
    }]);
