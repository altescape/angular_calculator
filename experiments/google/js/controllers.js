var myApp2 = angular.module('myApp2', []);

myApp2.controller('GoogleChartCtrl', function ($scope) {

    $scope.data = {
            ri: {name: 'Revenue Integrity', value: 3},
            ripi: {name: 'Revenue Integrity Process Improvement', value: 0},
            wb: {name: 'Weight and Balance', value: 1},
            od: {name: 'Origin and Destination', value: 1},
            pos: {name: 'Point of Sale', value: 0},
            arr: {name: 'ARR', value: 67},
            ai: {name: 'Airfare Insight', value: 1},
            cs: {name: 'Channel Shift', value: 0},
            as: {name: 'Ancillary Sales', value: 1}
        };

    google.setOnLoadCallback(this.drawChart);

    $scope.drawChart = function () {

        var data = google.visualization.arrayToDataTable($scope.googleData);

        $scope.currency = '€';

        var options = {
            backgroundColor: {
                fill: 'transparent'
            },
            chartArea: {
                backgroundColor: 'transparent'
            },
            pieHole: 0.5,
            pieSliceText: 'value',
            pieSliceTextStyle: {
                color: 'black'
            },
            legend: {
                alignment: 'center',
                position: 'right',
                maxLines: 8
            }
        };

        var formatter = new google.visualization.NumberFormat({pattern: $scope.currency+'#'});
        formatter.format(data, 1);

        var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
        chart.draw(data, options);

        var cli = chart.getChartLayoutInterface();

        $scope.chart_left = cli.getChartAreaBoundingBox().left;
        $scope.chart_top = cli.getChartAreaBoundingBox().top;
        $scope.chart_height = cli.getChartAreaBoundingBox().height;
        $scope.chart_width = cli.getChartAreaBoundingBox().width;

        console.log('left: ' + cli.getChartAreaBoundingBox().left);
        console.log('top: ' + cli.getChartAreaBoundingBox().top);
        console.log('height: ' + cli.getChartAreaBoundingBox().height);
        console.log('width: ' + cli.getChartAreaBoundingBox().width);
    };

    $scope.updateData = function () {

        $scope.googleData = [
            ['Name', 'Value'],
            ['Revenue integrity', $scope.data.ri.value],
            ['Revenue Integrity Process Improvement', $scope.data.ripi.value],
            ['Weight and Balance', $scope.data.wb.value],
            ['Origin and Destination', $scope.data.od.value],
            ['Point of Sale',$scope.data.pos.value],
            ['ARR',$scope.data.arr.value],
            ['Airfare Insight', $scope.data.ai.value],
            ['Channel Shift', $scope.data.cs.value],
            ['Ancillary Sales', $scope.data.as.value]
        ];

        $scope.chart_total = $scope.data.ri.value +
            $scope.data.ripi.value +
            $scope.data.wb.value +
            $scope.data.od.value +
            $scope.data.pos.value +
            $scope.data.arr.value +
            $scope.data.ai.value +
            $scope.data.cs.value +
            $scope.data.as.value;

        $scope.drawChart();
    };
});