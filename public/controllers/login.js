/**
 * Created by apismantis on 02/11/2016.
 */
var loginModule = angular.module('lotusAirline.login', ['ngCookies']);

loginModule.controller('LoginCtrl', ['$scope', '$window', '$http', '$cookies', '$rootScope',
    function ($scope, $window, $http, $cookies, $rootScope) {

        $scope.login = function () {

            if ($scope.username == null || $scope.password == null) {
                $scope.message = "Please fill out login information";
                return;
            }

            var data = {
                'username': $scope.username,
                'password': $scope.password
            };

            $http.post('/accounts/login', data)
                .then(function successCallback(res) {
                    // Save current user
                    $window.sessionStorage.setItem('user', res.data.acc);

                    // Save token
                    $cookies.put('accessToken', res.data.token);
                    $window.location.href = '#/admin';

                }, function errorCallback(res) {
                    $scope.message = res.data.message;

                    // Delete old token
                    $cookies.remove('accessToken');
                    $window.sessionStorage.removeItem('user');
                });
        };

    }]);
