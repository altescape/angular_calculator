'use strict';

angular.module('myApp.chart_controllers', [])

		.controller('DataCtrl', ['$scope', function ($scope) {
			$scope.updateData = function () {
				console.log("data");
			}
		}])

		.controller('ChartCtrl', [
			'$rootScope',
			'$scope',
			'localStorageService',
			'ChartInitFctry',
			'$state',
			'ChartDraw',
			'ChartData', function ($rootScope, $scope, localStorageService, ChartInitFctry, $state, ChartDraw, ChartData) {

				// Saves name of open view for results (from dataView) in local storage
				$rootScope.$on('$stateChangeSuccess',
						function (event, toState, toParams, fromState, fromParams) {
							event.preventDefault();
							localStorageService.set('results_view', toState);
						});

				// Initiates the view for results (from dataView)
				$scope.result_view = localStorageService.get('results_view');
				if ( $scope.result_view ) {
					$state.go($scope.result_view.name);
				} else {
					$state.go('chart_high');
				}

				$scope.cal = ChartInitFctry.cal;
				$scope.colors = ChartInitFctry.colors();

				$scope.updateChart = function () {

					// Check $scope.cal.adjustment exists
					if (!$scope.cal.adjustment || $scope.cal.adjustment === null) {
						$scope.cal.adjustment = 1000000;
					}

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

						if ( val === 'low' ) {
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
						if ( val === 'high' ) {
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
						if ( val === 'high' ) {
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

					$scope.revenue_integrity_process_improvement_high = Math.round($scope.ref13("high") / $scope.cal.adjustment);
					$scope.revenue_integrity_process_improvement_low = Math.round($scope.ref13("low") / $scope.cal.adjustment);

					// Table 5
					// Weight and Balance Cost Manager Application (for fuel) (CMAP)
					// ref:14
					$scope.ref14 = function () {
						return Math.round(($scope.cal.param10 / 100) * $scope.cal.param7);
					};

					// ref:15
					$scope.ref15 = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.005;
						} else {
							num = 0.0025;
						}
						return $scope.ref14() * num;
					};

					// ref: 16
					$scope.ref16 = function (val) {
						return $scope.ref15(val) / $scope.cal.adjustment;
					};

					// ref: 17
					$scope.ref17 = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.01;
						} else {
							num = 0.005;
						}
						return $scope.ref14(val) * num;
					}

					$scope.cmap_high = Math.round($scope.ref16("high"));
					$scope.cmap_low = Math.round($scope.ref16("low"));

					// Table 6
					// O&D (origin and destination) revenue management
					// ref: 18
					$scope.ref18 = function () {
						return $scope.cal.param6;
					}
					// ref:19
					$scope.ref19 = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.02;
						} else {
							num = 0.01;
						}
						return $scope.cal.param6 * num;
					};

					// ref:20
					$scope.ref20 = function (val) {
						return $scope.ref19(val) / $scope.cal.adjustment;
					};

					$scope.o_and_d_high = Math.round($scope.ref20("high"));
					$scope.o_and_d_low = Math.round($scope.ref20("low"));

					// Table 7
					// Point of sale controls
					// ref:21
					$scope.ref21 = function () {
						return $scope.cal.param6;
					};

					// ref:22
					$scope.ref22 = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.005;
						} else {
							num = 0.0025;
						}
						return $scope.ref21() * num;
					};

					// ref:23
					$scope.ref23 = function (val) {
						return $scope.ref22(val) / $scope.cal.adjustment;
					};

					$scope.pos_high = Math.round($scope.ref23("high"));
					$scope.pos_low = Math.round($scope.ref23("low"));

					// Table 9
					// Airfare Insight
					// ref:24
					$scope.ref24 = function () {
						return $scope.cal.param6;
					};

					// ref:25
					$scope.ref25 = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.01;
						} else {
							num = 0.005;
						}
						return $scope.ref24() * num;
					};

					// ref:26
					$scope.ref26 = function (val) {
						return $scope.ref25(val) / $scope.cal.adjustment;
					};

					$scope.insight_high = Math.round($scope.ref26("high"));
					$scope.insight_low = Math.round($scope.ref26("low"));

					//
					// End of table functions
					//

					//
					// Add data to data service / factory arrays
					//
					// revenue_integrity
					if ( $scope.cal.services.op1 === true ) {
						ChartData.summary.high.revenue_integrity = $scope.revenue_integrity_high;
						ChartData.summary.low.revenue_integrity = $scope.revenue_integrity_low;
					} else {
						ChartData.summary.high.revenue_integrity = 0;
						ChartData.summary.low.revenue_integrity = 0;
					}

					// revenue_integrity_process_improvement
					if ( $scope.cal.services.op2 === true ) {
						ChartData.summary.high.revenue_integrity_process_improvement = $scope.revenue_integrity_process_improvement_high;
						ChartData.summary.low.revenue_integrity_process_improvement = $scope.revenue_integrity_process_improvement_low;
					} else {
						ChartData.summary.high.revenue_integrity_process_improvement = 0;
						ChartData.summary.low.revenue_integrity_process_improvement = 0;
					}

					// cmap
					if ( $scope.cal.services.op5 === true ) {
						ChartData.summary.high.cmap = $scope.cmap_high;
						ChartData.summary.low.cmap = $scope.cmap_low;
					} else {
						ChartData.summary.high.cmap = 0;
						ChartData.summary.low.cmap = 0;
					}

					// o&d
					if ( $scope.cal.services.op6 === true ) {
						ChartData.summary.high.o_and_d = $scope.o_and_d_high;
						ChartData.summary.low.o_and_d = $scope.o_and_d_low;
					} else {
						ChartData.summary.high.o_and_d = 0;
						ChartData.summary.low.o_and_d = 0;
					}

					// pos
					if ( $scope.cal.services.op7 === true ) {
						ChartData.summary.high.pos = $scope.pos_high;
						ChartData.summary.low.pos = $scope.pos_low;
					} else {
						ChartData.summary.high.pos = 0;
						ChartData.summary.low.pos = 0;
					}

					// insight
					if ( $scope.cal.services.op9 === true ) {
						ChartData.summary.high.insight = $scope.insight_high;
						ChartData.summary.low.insight = $scope.insight_low;
					} else {
						ChartData.summary.high.insight = 0;
						ChartData.summary.low.insight = 0;
					}

					// Save summary to local storage
					localStorageService.set('summary', ChartData.summary);

					// Save calculations to local storage
					localStorageService.set('cal', $scope.cal);

					// Pie chart drawing functions
					// Labels for pie chart
					$scope.pie_titles = [
						'Revenue Integrity',
						'RI Process Improvement',
						'Channel Shift',
						'Ancillary Sales',
						'CMAP',
						'O & D',
						'POS',
						'ARR',
						'Insight'
					];

					// Function to convert data object to array for chart
					$scope.pie_values = [];
					$scope.getPieValue = function (pie_data, pie_array) {
						var i = 0;
						angular.forEach(pie_data, function (value, key) {
							pie_array.push([$scope.pie_titles[i], value]);
							i++;
						});
					};

					// Count totals of services
					$scope.serviceTotals = function (service_numbers) {
						$scope.value_total = 0;
						angular.forEach(service_numbers, function (value, key) {
							$scope.value_total += parseInt(value[1], 10);
							return parseInt($scope.value_total, 10);
						});
					};

					// On load/refresh get the view so we can display the right results
					if ( localStorageService.get('results_view') && localStorageService.get('results_view').name === "chart_high" ) {

						// Highcharts config for pie chart (high value)
						$scope.chartConfigHigh = ChartDraw.chartConfigPie;

						// Store the chart object child in seriesArrayPie variable
						var seriesArrayPie = $scope.chartConfigHigh.series[0];

						$scope.getPieValue(ChartData.summary.high, $scope.pie_values);

						seriesArrayPie.data = $scope.pie_values;

						$scope.serviceTotals(seriesArrayPie.data);

					} else {

						// Highcharts config for pie chart (high value)
						$scope.chartConfigLow = ChartDraw.chartConfigPie;

						// Store the chart object child in seriesArrayPie variable
						var seriesArrayPie = $scope.chartConfigLow.series[0];

						$scope.getPieValue(ChartData.summary.low, $scope.pie_values);

						seriesArrayPie.data = $scope.pie_values;

						$scope.serviceTotals(seriesArrayPie.data);

					}

					// Change values based on state/page change
					$rootScope.$on('$stateChangeStart',
							function (event, toState, toParams, fromState, fromParams) {
								$scope.pie_values = [];
								$scope.chartConfigHigh = ChartDraw.chartConfigPie;
								$scope.getPieValue(ChartData.summary.high, $scope.pie_values);
								$scope.serviceTotals(seriesArrayPie.data);

								if ( toState.name === 'chart_low' ) {
									$scope.chartConfigLow = ChartDraw.chartConfigPie;
									$scope.pie_values = [];
									$scope.getPieValue(ChartData.summary.low, $scope.pie_values);
									$scope.serviceTotals(seriesArrayPie.data);
								}
								seriesArrayPie.data = $scope.pie_values;
							});

					// Update service totals
//					$scope.value_total = 0;
//					$scope.total_services = angular.forEach(seriesArrayPie.data, function (value, key) {
//						$scope.value_total += parseInt(value[1], 10);
//						return parseInt($scope.value_total, 10);
//					});

				};

				/* End Highcharts config */

				// Initiate chart on controller load
				$scope.updateChart();
			}])

		.controller('SessionsDetailCtrl', ['$rootScope', '$scope', '$routeParams', '$firebase', '$state', 'ChartDraw', 'ChartData', function ($rootScope, $scope, $routeParams, $firebase, $state, ChartDraw, ChartData) {

			/* Get associated session item from Firebase */
			$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + $routeParams.id));

			/* Promise for loaded data */
			$scope.item.$on("loaded", function () {

				$scope.cal = $scope.item.calculations;
				$scope.detail_summary = $scope.item.summary;

				// Pie chart drawing functions
				// Function to convert data object to array for chart
				$scope.getPieValue = function (pie_data, pie_array) {
					angular.forEach(pie_data, function (value, key) {
						pie_array.push([key, value]);
					});
				};

				// Count totals of services
				$scope.serviceTotals = function (service_numbers) {
					$scope.value_total = 0;
					angular.forEach(service_numbers, function (value, key) {
						$scope.value_total += parseInt(value[1], 10);
						return parseInt($scope.value_total, 10);
					});
				};

				$scope.pie_values_high = [];
				$scope.chartConfigHigh = ChartDraw.chartConfigPie;
				// Store the chart object child in seriesArrayPie variable
				var seriesArrayPieHigh = $scope.chartConfigHigh.series[0];
				$scope.getPieValue($scope.detail_summary.high, $scope.pie_values_high);
				seriesArrayPieHigh.data = $scope.pie_values_high;
				// Highcharts config for pie chart (high value)
				$scope.chartConfigHigh = ChartDraw.chartConfigPie;
				$scope.serviceTotals(seriesArrayPieHigh.data);


			});

		}]);