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

    // GET all available airports
    $http.get("/airports")
        .then(function (response) {
            $scope.countryDeparture = response.data;
        });

    $scope.changeTicketType = function () {
        document.getElementById('end-date').disabled = $scope.data.type == "one-way";
    };

    // Get arrival airports
    $scope.getArrivalAirport = function () {

        // Check depature
        if ($scope.data.departureAirport == null) {
            alert("Bạn chưa chọn sân bay đi");
        } else {

            // Get arrival airports
            $http.get("/airports?depart=" + $scope.data.departureAirport)
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
        $scope.data.depart = $('#start-date').val();
        $scope.data.return = $('#end-date').val();

        // Check data
        if ($scope.data.departureAirport == ""
            || $scope.data.arrivalAirport == ""
            || $scope.data.depart == ""
            || ($scope.data.type == "round-trip" && $scope.data.return == "")) {
            alert("Bạn chưa điền đầy đủ thông tin");
            return;
        }

        // Format depart date
        $scope.data.depart = formartDate($scope.data.depart);
        $scope.data.return = formartDate($scope.data.return);

        // One-way ticket has no return
        if($scope.data.type != "round-trip")
            $scope.data.return = "";

        console.log($scope.data);
    };
    
    function getTicket() {
        
    }

    function formartDate(date) {
        var newDate = date.split("/");
        return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
    }
}]);