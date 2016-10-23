var searchModule = angular.module('lotusAirline.search', []);

searchModule.controller('SearchCtrl', ['$scope', '$window', '$http', function ($scope, $window, $http) {

    $scope.countryDeparture = [];
    $scope.countryArrival = [];
    $scope.adult = 1;
    $scope.children = 0;
    $scope.baby = 0;

    $scope.data = {
        "type": "round-trip",
        "departureAirport": "",
        "arrivalAirport": "",
        "depart": "",
        "passengers": 1,
        "return": "",
        "filter": "exactly"
    };

    var dateSelect = $('#flight-datepicker');
    var dateDepart = $('#start-date');
    var dateReturn = $('#end-date');
    var spanDepart = $('.date-depart');
    var spanReturn = $('.date-return');
    var spanDateFormat = 'ddd, MMMM D yyyy';

    dateSelect.datepicker({
        autoclose: true,
        format: "dd/mm/yyyy",
        maxViewMode: 0,
        startDate: "now"
    }).on('change', function () {
        var start = $.format.date(dateDepart.datepicker('getDate'), spanDateFormat);
        var end = $.format.date(dateReturn.datepicker('getDate'), spanDateFormat);
        spanDepart.text(start);
        spanReturn.text(end);
    });

    // GET all available airports
    $http.get("/airports")
        .then(function (response) {
            $scope.countryDeparture = response.data;
        });

    $scope.changeTicketType = function () {
        if ($scope.data.type == "one-way") {
            document.getElementById('end-date').disabled = true;
            // document.getElementById('end-date').style.borderColor = "#757575";
        }
        else {
            document.getElementById('end-date').disabled = false;
            // document.getElementById('end-date').style.borderColor = "#3074C5";
        }
    };

    // Get arrival airports
    $scope.getArrivalAirport = function () {

        // Check depature
        if ($scope.data.departureAirport == null) {
            alert("Bạn chưa chọn sân bay đi");
        } else {

            // Get arrival airports
            $http.get("/airports/" + $scope.data.departureAirport)
                .then(function (response) {
                    $scope.countryArrival = response.data;
                });
        }
    };

    // Add more passenger
    $scope.addPassenger = function (passengerType) {

        switch (passengerType) {
            case "adult":
                if ($scope.adult < 6) { // Maximum is 6
                    $scope.adult++;
                    $scope.data.passengers++;
                }
                break;

            case "children":
                if ($scope.children + $scope.baby < $scope.adult) { // 1 adult can keep 1 or 2 child
                    $scope.children++;
                    $scope.data.passengers++;
                }
                break;

            case "baby":
                if ($scope.children + $scope.baby < $scope.adult) { // 1 adult can keep 1 or 2 child
                    $scope.baby++;
                    $scope.data.passengers++;
                }
                break;

            default:
                break;
        }
    };

    // Remove passenger
    $scope.removePassenger = function (passengerType) {

        switch (passengerType) {
            case "adult":
                if ($scope.adult > 1) { // Default is 1
                    $scope.adult--;
                    $scope.data.passengers--;
                }
                break;

            case "children":
                if ($scope.children > 0) {
                    $scope.children--;
                    $scope.data.passengers--;
                }
                break;

            case "baby":
                if ($scope.baby > 0) {
                    $scope.baby--;
                    $scope.data.passengers--;
                }
                break;

            default:
                break;
        }
    };

    $scope.findTicket = function () {
        console.log($scope.data);

        if ($scope.data.departureAirport == null
            || $scope.data.arrivalAirport == null
            || $scope.data.depart == null
            || ($scope.data.type == "round-trip" && $scope.data.return == null)) {
            alert("Bạn chưa điền đầy đủ thông tin");
        }
        else {

        }
    };

}]);