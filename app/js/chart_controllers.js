/**
 * Created by michaelwatts
 * Date: 08/07/2014
 * Time: 13:47
 */

'use strict';

angular.module('myApp.chart_controllers', [])

    .controller('ChartCtrl', ['$scope', 'localStorageService', 'ServicesBuilderFcty', 'ChartInitFctry', function ($scope, localStorageService, ServicesBuilderFcty, ChartInitFctry) {

      $scope.cal = ChartInitFctry.cal;
      $scope.colors = ChartInitFctry.colors();
      $scope.services = ServicesBuilderFcty;

      $scope.graphData = function (flag) {

        $scope.op1_con = 0;
        $scope.op1_agg = 0;

        if ($scope.cal.services.op1 === "1") {
          $scope.op1_con = parseInt($scope.cal.param1 / 500000, 10);
          $scope.op1_agg = parseInt($scope.cal.param1 / 200000, 10);
        }

        $scope.op2_con = 0;
        $scope.op2_agg = 0;

        if ($scope.cal.services.op2 === "1") {
          $scope.op2_con = parseInt($scope.cal.param1 / 100000, 10);
          $scope.op2_agg = parseInt($scope.cal.param1 / 80000, 10);
        }

        $scope.op3_con = 0;
        $scope.op3_agg = 0;

        if ($scope.cal.services.op3 === "1") {
          $scope.op3_con = parseInt($scope.cal.param1 / 500000, 10);
          $scope.op3_agg = parseInt($scope.cal.param1 / 200000, 10);
        }

        $scope.op4_con = 0;
        $scope.op4_agg = 0;

        if ($scope.cal.services.op4 === "1") {
          $scope.op4_con = parseInt($scope.cal.param1 / 600000, 10);
          $scope.op4_agg = parseInt($scope.cal.param1 / 300000, 10);
        }

        $scope.op5_con = 0;
        $scope.op5_agg = 0;

        if ($scope.cal.services.op5 === "1") {
          $scope.op5_con = parseInt($scope.cal.param1 / 300000, 10);
          $scope.op5_agg = parseInt($scope.cal.param1 / 150000, 10);
        }

        if (flag === "normal") {
          return [
            ['Revenue Integrity', $scope.op1_con],
            ['Revenue Integrity process improvement', $scope.op2_con],
            ['Channel Shift', $scope.op3_con],
            ['Ancillary sales', $scope.op4_con],
            ['CMAP', $scope.op5_con]
          ];
        }
        if (flag === "aggressive") {
          return [
            ['Revenue Integrity', $scope.op1_agg],
            ['Revenue Integrity process improvement', $scope.op2_agg],
            ['Channel Shift', $scope.op3_agg],
            ['Ancillary sales', $scope.op4_agg],
            ['CMAP', $scope.op5_agg]
          ];
        }
        return false;
      };

      $scope.updateChart = function () {

        localStorageService.set('cal', $scope.cal);

        /* Update conservative graph */
        var seriesArray = $scope.chartConfig.series[0];
        seriesArray.data = $scope.graphData("normal");

        /* Update conservative totals */
        $scope.total_con = 0;
        $scope.total_cons = angular.forEach(seriesArray.data, function (key) {
          $scope.total_con = parseInt($scope.total_con, 10) + parseInt(key[1], 10);
          return parseInt($scope.total_con, 10);
        });

        /* Update aggressive graph */
        var seriesArray2 = $scope.chartConfig2.series[0];
        seriesArray2.data = $scope.graphData("aggressive");

        /* Update aggressive totals */
        $scope.total_agg = 0;
        $scope.total_aggrs = angular.forEach(seriesArray2.data, function (key) {
          $scope.total_agg = parseInt($scope.total_agg, 10) + parseInt(key[1], 10);
          return parseInt($scope.total_agg, 10);
        });
      };

      /* Start Highcharts config */
      $scope.chartConfig = {
        options: {
          chart      : {
            type               : 'pie',
            backgroundColor    : 'rgba(255, 255, 255, 0)',
            plotBackgroundColor: 'rgba(255, 255, 255, 0)'
          },
          tooltip    : {
            pointFormat: '<b>{point.y}</b>'
          },
          plotOptions: {
            series: {
              tooltip  : {
                followPointer: false
              },
              animation: true
            },
            pie   : {
              allowPointSelect: true,
              cursor          : 'pointer',
              borderColor     : 'rgba(255, 255, 255, 0)',
              dataLabels      : {
                enabled: false
              },
              center          : ['50%', '40%'],
              size            : 220
            }
          }
        },
        series : [
          {
            name     : 'Value of moving to SITA (Conservative)',
            innerSize: '20%',
            data     : $scope.graphData("normal")
          }
        ],
        title  : {
          text         : "Value of moving to SITA (Conservative)",
          style        : {
            'color': '#333'
          },
          align        : 'center',
          verticalAlign: 'middle',
          y            : 110
        }
      };
      /* End Highcharts config */

      /* Start Highcharts config */
      $scope.chartConfig2 = {
        options: {
          chart      : {
            type               : 'pie',
            backgroundColor    : 'rgba(255, 255, 255, 0)',
            plotBackgroundColor: 'rgba(255, 255, 255, 0)'
          },
          tooltip    : {
            pointFormat: '<b>{point.y}</b>'
          },
          plotOptions: {
            series: {
              tooltip  : {
                followPointer: false
              },
              animation: true
            },
            pie   : {
              allowPointSelect: true,
              cursor          : 'pointer',
              borderColor     : 'rgba(255, 255, 255, 0)',
              dataLabels      : {
                enabled: false
              },
              center          : ['50%', '40%'],
              size            : 220
            }
          }
        },
        series : [
          {
            name     : 'Value of moving to SITA (Aggressive)',
            innerSize: '20%',
            data     : $scope.graphData("aggressive")
          }
        ],
        title  : {
          text         : "Value of moving to SITA (Aggressive)",
          style        : {
            'color': '#333'
          },
          align        : 'center',
          verticalAlign: 'middle',
          y            : 110
        }
      };
      /* End Highcharts config */

      $scope.updateChart();

      $scope.collapsed = false;
      $scope.collapse = function () {
        if ($scope.collapsed === false) {
          $scope.collapsed = true;
        }
      };
    }])


    .controller('SessionsDetailCtrl', ['$scope', '$routeParams', '$firebase', function ($scope, $routeParams, $firebase) {

      /* Get associated session item from Firebase */
      $scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + $routeParams.id));

      /* Promise for loaded data */
      $scope.item.$on("loaded", function () {
        $scope.cal = $scope.item.calculations;

        $scope.graphData = function (flag) {

          $scope.op1_con = 0;
          $scope.op1_agg = 0;

          if ($scope.cal.services.op1 === "1") {
            $scope.op1_con = parseInt($scope.cal.param1 / 500000, 10);
            $scope.op1_agg = parseInt($scope.cal.param1 / 200000, 10);
          }

          $scope.op2_con = 0;
          $scope.op2_agg = 0;

          if ($scope.cal.services.op2 === "1") {
            $scope.op2_con = parseInt($scope.cal.param1 / 100000, 10);
            $scope.op2_agg = parseInt($scope.cal.param1 / 80000, 10);
          }

          $scope.op3_con = 0;
          $scope.op3_agg = 0;

          if ($scope.cal.services.op3 === "1") {
            $scope.op3_con = parseInt($scope.cal.param1 / 500000, 10);
            $scope.op3_agg = parseInt($scope.cal.param1 / 200000, 10);
          }

          $scope.op4_con = 0;
          $scope.op4_agg = 0;

          if ($scope.cal.services.op4 === "1") {
            $scope.op4_con = parseInt($scope.cal.param1 / 600000, 10);
            $scope.op4_agg = parseInt($scope.cal.param1 / 300000, 10);
          }

          $scope.op5_con = 0;
          $scope.op5_agg = 0;

          if ($scope.cal.services.op5 === "1") {
            $scope.op5_con = parseInt($scope.cal.param1 / 300000, 10);
            $scope.op5_agg = parseInt($scope.cal.param1 / 150000, 10);
          }

          if (flag === "normal") {
            return [
              ['Revenue Integrity', $scope.op1_con],
              ['Revenue Integrity process improvement', $scope.op2_con],
              ['Channel Shift', $scope.op3_con],
              ['Ancillary sales', $scope.op4_con],
              ['CMAP', $scope.op5_con]
            ];
          }
          if (flag === "aggressive") {
            return [
              ['Revenue Integrity', $scope.op1_agg],
              ['Revenue Integrity process improvement', $scope.op2_agg],
              ['Channel Shift', $scope.op3_agg],
              ['Ancillary sales', $scope.op4_agg],
              ['CMAP', $scope.op5_agg]
            ];
          }
          return false;
        }

        /* Start Highcharts config */
        $scope.chartConfig = {
          options: {
            chart      : {
              type               : 'pie',
              backgroundColor    : 'rgba(255, 255, 255, 0)',
              plotBackgroundColor: 'rgba(255, 255, 255, 0)'
            },
            tooltip    : {
              pointFormat: '<b>{point.y}</b>'
            },
            plotOptions: {
              series: {
                tooltip  : {
                  followPointer: false
                },
                animation: true
              },
              pie   : {
                allowPointSelect: true,
                cursor          : 'pointer',
                borderColor     : 'rgba(255, 255, 255, 0)',
                dataLabels      : {
                  enabled: false
                },
                center          : ['50%', '40%'],
                size            : 220
              }
            }
          },
          series : [
            {
              name     : 'Value of moving to SITA (Conservative)',
              innerSize: '20%',
              data     : $scope.graphData("normal")
            }
          ],
          title  : {
            text         : "Value of moving to SITA (Conservative)",
            style        : {
              'color': '#333'
            },
            align        : 'center',
            verticalAlign: 'middle',
            y            : 110
          }
        };
        /* End Highcharts config */

        /* Start Highcharts config */
        $scope.chartConfig2 = {
          options: {
            chart      : {
              type               : 'pie',
              backgroundColor    : 'rgba(255, 255, 255, 0)',
              plotBackgroundColor: 'rgba(255, 255, 255, 0)'
            },
            tooltip    : {
              pointFormat: '<b>{point.y}</b>'
            },
            plotOptions: {
              series: {
                tooltip  : {
                  followPointer: false
                },
                animation: true
              },
              pie   : {
                allowPointSelect: true,
                cursor          : 'pointer',
                borderColor     : 'rgba(255, 255, 255, 0)',
                dataLabels      : {
                  enabled: false
                },
                center          : ['50%', '40%'],
                size            : 220
              }
            }
          },
          series : [
            {
              name     : 'Value of moving to SITA (Aggressive)',
              innerSize: '20%',
              data     : $scope.graphData("aggressive")
            }
          ],
          title  : {
            text         : "Value of moving to SITA (Aggressive)",
            style        : {
              'color': '#333'
            },
            align        : 'center',
            verticalAlign: 'middle',
            y            : 110
          }
        };
        /* End Highcharts config */
      });

    }]);