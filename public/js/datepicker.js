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