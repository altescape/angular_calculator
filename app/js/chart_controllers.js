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

        // Revenue Integrity
        $scope.var_revenue_integrity = Math.round( ( (0.02 * $scope.cal.param6) + (0.05 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.01 * $scope.cal.param6) ) / $scope.cal.adjustment );
        $scope.var_revenue_integrity_low = Math.round( ( (0.01 * $scope.cal.param6) + (0.03 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.001 * $scope.cal.param6) ) / $scope.cal.adjustment );

        // Revenue Integrity process improvement
        // ref:1
        $scope.ref1 = function (val) {
          return Math.round($scope.cal.param1 * 0.036);
        };
        // ref:2
        $scope.ref2 = function (val) {
          return $scope.ref1(val) * 1.8;
        };
        // ref:3
        $scope.ref3 = function (val) {
          return $scope.ref1(val) * 1.6
        };
        // ref:4
        $scope.ref4 = function (val) {
          return $scope.ref2(val) / $scope.ref1(val) * $scope.ref3(val) / $scope.ref1(val);
        };
        // ref:5
        $scope.ref5 = function (val) {
          return $scope.ref4(val) * $scope.ref1(val);
        };
        // ref:6
        $scope.ref6 = function (val) {
          var g30 = $scope.ref5(val) * 0.000034,
              g31 = $scope.ref5(val) * 0.024916,
              g32 = $scope.ref5(val) * 0.230518,
              g33 = $scope.ref5(val) * 0.023052,
              g34 = $scope.ref5(val) * 0.001330,
              g35 = $scope.ref5(val) * 0.010752,
              g36 = $scope.ref5(val) * 0.000012,
              g37 = $scope.ref5(val) * 0.054547,
              g38 = $scope.ref5(val) * 0.006698;

          if (val === 'high') {
            g30 = g30 / 2;
            g31 = g31 / 2;
            g32 = g32 / 2;
            g33 = g33 / 2;
            g34 = g34 / 2;
            g35 = g35 / 2;
            g36 = g36 / 2;
            g37 = g37 / 2;
            g38 = g38 / 2;
          }

          return Math.round(g30 + g31 + g32 + g33 + g34 + g35 + g36 + g37 + g38);
        };
        // ref:7
        $scope.ref7 = function (val) {
          var num;
          if (val === 'low') {
            num = 0.1;
          } else {
            num = 0.05;
          }
          return num * $scope.ref6(val);
        };
        // ref:8
        $scope.ref8 = function (val) {
          return Math.round($scope.cal.param9 * $scope.ref7(val));
        };
        // ref:9
        $scope.ref9 = function (val) {
          return $scope.ref8(val) * 12;
        };
        // ref:10
        $scope.ref10 = function (val) {
          return 0.03 * $scope.cal.param1;
        };
        // ref:11
        $scope.ref11 = function (val) {
          var num;
          if (val === 'low') {
            num = 0.2;
          } else {
            num = 0.1;
          }
          return $scope.ref10(val) * num;
        };
        // ref:12
        $scope.ref12 = function (val) {
          return 450 * $scope.ref11(val);
        };
        // ref:13
        $scope.ref13 = function (val) {
          return Math.round($scope.ref9(val) + $scope.ref12(val) / 2);
        };


        $scope.var_revenue_integrity_proc_imp = Math.round($scope.ref13("low") / $scope.cal.adjustment);
        $scope.var_revenue_integrity_proc_imp_high = Math.round($scope.ref13("high") / $scope.cal.adjustment);

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