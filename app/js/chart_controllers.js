/**
 * Created by michaelwatts
 * Date: 08/07/2014
 * Time: 13:47
 */

'use strict';

angular.module('myApp.chart_controllers', [])

    .controller('ChartCtrl', [
      '$rootScope',
      '$scope',
      'localStorageService',
      'ServicesBuilderFcty',
      'ChartInitFctry',
      '$state',
      'ChartData', function (
          $rootScope,
          $scope,
          localStorageService,
          ServicesBuilderFcty,
          ChartInitFctry,
          $state,
          ChartData) {

      // Saves name of open view for results (from dataView)
      $rootScope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
            event.preventDefault();
            localStorageService.set('results_view', toState);
          });

      // Initiates the view for results (from dataView)
      $scope.result_view = localStorageService.get('results_view');
      if ($scope.result_view) {
        $state.go($scope.result_view.name);
      } else {
        $state.go('chart');
      }

      $scope.cal = ChartInitFctry.cal;
      $scope.colors = ChartInitFctry.colors();
      $scope.services = ServicesBuilderFcty;


      $scope.updateChart = function () {

        // Table 1
        // Revenue Integrity
        $scope.revenue_integrity_high = Math.round(( (0.02 * $scope.cal.param6) + (0.05 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.01 * $scope.cal.param6) ) / $scope.cal.adjustment);
        $scope.revenue_integrity_low = Math.round(( (0.01 * $scope.cal.param6) + (0.03 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.001 * $scope.cal.param6) ) / $scope.cal.adjustment);

        // Table 2
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

          if (val === 'low') {
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
          if (val === 'high') {
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
          if (val === 'high') {
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

        $scope.revenue_integrity_process_improvement_high  = Math.round($scope.ref13("high") / $scope.cal.adjustment);
        $scope.revenue_integrity_process_improvement_low = Math.round($scope.ref13("low") / $scope.cal.adjustment);

        //
        // End of table functions
        //

        //
        // Add data to data service / factory arrays
        //
        // revenue_integrity
        if ($scope.cal.services.op1 === "1") {
          ChartData.summary.high.revenue_integrity = $scope.revenue_integrity_high;
          ChartData.summary.low.revenue_integrity = $scope.revenue_integrity_low;
        } else {
          ChartData.summary.high.revenue_integrity = 0;
          ChartData.summary.low.revenue_integrity = 0;
        }

        // revenue_integrity_process_improvement
        if ($scope.cal.services.op2 === "1") {
          ChartData.summary.high.revenue_integrity_process_improvement = $scope.revenue_integrity_process_improvement_high;
          ChartData.summary.low.revenue_integrity_process_improvement = $scope.revenue_integrity_process_improvement_low;
        } else {
          ChartData.summary.high.revenue_integrity_process_improvement = 0;
          ChartData.summary.low.revenue_integrity_process_improvement = 0;
        }

        localStorageService.set('summary', ChartData.summary);


        // Save calculations to localstorage
        localStorageService.set('cal', $scope.cal);

        // Convert object to array
        $scope.obj_to_array = function (data) {
          var arr =[];
          for( var i in data ) {
            if (data.hasOwnProperty(i)){
              arr.push(data[i]);
            }
          }
          return arr;
        };

        // Update high graph
        var seriesArray = $scope.chartConfig.series[0];
        seriesArray.data = $scope.obj_to_array(ChartData.summary.high);

        /* Update high totals */
        $scope.total_high = 0;
        $scope.total_services_high = angular.forEach(seriesArray.data, function (value, key) {
          $scope.total_high += parseInt(value, 10);
          return parseInt($scope.total_high, 10);
        });

        /* Update low graph */
        var seriesArray2 = $scope.chartConfig2.series[0];
        seriesArray2.data = $scope.obj_to_array(ChartData.summary.low);

        /* Update low totals */
        $scope.total_low = 0;
        $scope.total_services_low = angular.forEach(seriesArray2.data, function (value, key) {
          $scope.total_low += parseInt(value, 10);
          return parseInt($scope.total_low, 10);
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
            name     : 'Value of moving to SITA (High)',
            innerSize: '20%',
            data     : ChartData.summary.high
          }
        ],
        title  : {
          text         : "Value of moving to SITA (High)",
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
            name     : 'Value of moving to SITA (Low)',
            innerSize: '20%',
            data     : ChartData.summary.low
          }
        ],
        title  : {
          text         : "Value of moving to SITA (Low)",
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