var searchModule = angular.module('lotusAirline.search', []);

searchModule.controller('SearchCtrl', ['$scope', '$window', '$http', '$rootScope', '$location',
    function ($scope, $window, $http, $rootScope, $location) {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        today = dd + '/' + mm + '/' + yyyy;

        var departPickerConfig = {
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "DD/MM/YYYY",
                "separator": " - ",
                "fromLabel": "Từ",
                "toLabel": "Đến",
                "weekLabel": "Tuần",
                "daysOfWeek": [
                    "CN",
                    "T2",
                    "T3",
                    "T4",
                    "T5",
                    "T6",
                    "T7"
                ],
                "monthNames": [
                    "Tháng 1",
                    "Tháng 2",
                    "Tháng 3",
                    "Tháng 4",
                    "Tháng 5",
                    "Tháng 6",
                    "Tháng 7",
                    "Tháng 8",
                    "Tháng 9",
                    "Tháng 10",
                    "Tháng 11",
                    "Tháng 12"
                ],
                "firstDay": 1
            },
            "linkedCalendars": false,
            "showCustomRangeLabel": false,
            "startDate": today,
            "minDate": today,
            "drops": "up"
        };
        var returnPickerConfig = departPickerConfig;

        // Config datepicker
        $(function () {
            $('#end-date').daterangepicker(departPickerConfig);

            $('#start-date').daterangepicker(departPickerConfig, function (start, end, label) {
                console.log("Datepicker running....");
                $('#start-date').val(start.format("DD/MM/YYYY"));
                var returnDate = $('#end-date').val();

                // Change minimum date available
                returnPickerConfig.minDate = $('#start-date').val();
                $('#end-date').daterangepicker(returnPickerConfig);
            });

            $('#departureDate').daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                locale: {
                    format: 'MM/DD/YYYY h:mm A'
                }
            });
        });

        $scope.countryDeparture = [];
        $scope.countryArrival = [];
        $scope.adult = 1;
        $scope.children = 0;
        $scope.baby = 0;

        $rootScope.departTickets = {}; // Displayed in ticket-result module
        $rootScope.returnTickets = {}; // Displayed in ticket-result module

        // Global data
        $rootScope.data = {
            "type": "round-trip",
            "departureAirport": "",
            "arrivalAirport": "",
            "depart": "",
            "passengers": 1,
            "return": "",
            "filter": "exactly",
            "departTicket": {},
            "returnTicket": {}
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
            if ($scope.data.type != "round-trip")
                $scope.data.return = "";

            // console.log($scope.data);
            getTicket();
            $window.location.href = '#/ticket-results';
        };

        function getTicket() {
            var URL = "/flights/search?"
                + "from=" + $scope.data.departureAirport
                + "&to=" + $scope.data.arrivalAirport
                + "&depart=" + $scope.data.depart
                + "&return=" + $scope.data.return
                + "&passengers=" + $scope.data.passengers;

            console.log(URL);

            $http.get(URL)
                .then(function (response) {
                    if ($rootScope.data.type == "one-way") {
                        $rootScope.departTickets = response.data;
                        $rootScope.returnTickets = {}; // Reset data
                    }
                    else {
                        $rootScope.departTickets = response.data.depart;
                        $rootScope.returnTickets = response.data.return;
                    }

                    console.log(response.data);
                });
        }

        function formartDate(date) {
            var newDate = date.split("/");
            return newDate[2] + "-" + newDate[1] + "-" + newDate[0];
        }
    }]);