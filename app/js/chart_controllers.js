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
			'inputData',
			'allData',
			'revenueIntegrity',
			'revenueIntegrityProcessImprovement',
			'$state',
			'chartConfig',
			'chartData', function ($rootScope, $scope, localStorageService, inputData, allData, revenueIntegrity, revenueIntegrityProcessImprovement, $state, chartConfig, chartData) {

				/**
				 *  Stores the state of collapsed sections, collapsed = true|false.
				 *
				 *  @type {*|Array|Choice|Undefined|Object|array|promise|Object}
				 */
				$scope.view_state = localStorageService.get('view_state');
				$scope.collapseSection = function () {
					localStorageService.set('view_state', $scope.view_state);
				};

				/**
				 *  Initiates the process for saving the open results view, Charts or table.
				 *
				 *  @type {*|Array|Choice|Undefined|Object|array|promise|Object}
				 */
				$scope.result_view = localStorageService.get('results_view');
				if ( $scope.result_view ) {
					$state.go($scope.result_view.name);
				} else {
					$state.go('chart_high');
				}

				/**
				 *  Saves the state of the open results view, Charts or table,
				 *  when loaded. Uses state and state change success event ($stateChangeSuccess).
				 */
				$rootScope.$on('$stateChangeSuccess',
						function (event, toState, toParams, fromState, fromParams) {
							event.preventDefault();
							localStorageService.set('results_view', toState);
						});

				// Get the defaults values from the Chart Initialisation Factory
				$scope.cal = inputData.cal;
				$scope.colors = inputData.colors();

				/**
				 *  Updates the chart.
				 *
				 *  Called whenever a value is changed in an input box and on initial load of /#/calculator page.
				 */
				$scope.updateChart = function () {

					// Here is where hell begins... tread carefully or ye will trip and fall.
					// Check reference docs for references or you'll get lost.

					// Check $scope.cal.adjustment exists
					if ( !$scope.cal.adjustment || $scope.cal.adjustment === null ) {
						$scope.cal.adjustment = 1000000;
					}

					// Table 1
					// Revenue Integrity
					$scope.revenue_integrity_high = Math.round(( (0.02 * $scope.cal.param6) + (0.05 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.01 * $scope.cal.param6) ) / $scope.cal.adjustment);
					$scope.revenue_integrity_low = Math.round(( (0.01 * $scope.cal.param6) + (0.03 * ($scope.cal.param7 * $scope.cal.param8 / 100)) + (0.001 * $scope.cal.param6) ) / $scope.cal.adjustment);

					// Table 2
					// Revenue Integrity process improvement
					// ref:1
					$scope.pnrs = function (val) {
						return Math.round($scope.cal.param1 * 0.036);
					};
					// ref:2
					$scope.segments = function (val) {
						return $scope.pnrs(val) * 1.8;
					};
					// ref:3
					$scope.passengers = function (val) {
						return $scope.pnrs(val) * 1.6
					};
					// ref:4
					$scope.av_psj_per_pnr = function (val) {
						return $scope.segments(val) / $scope.pnrs(val) * $scope.passengers(val) / $scope.pnrs(val);
					};
					// ref:5
					$scope.psj = function (val) {
						return $scope.av_psj_per_pnr(val) * $scope.pnrs(val);
					};
					// ref:6
					$scope.total_checks = function (val) {
						var g30 = $scope.psj(val) * 0.000034,
								g31 = $scope.psj(val) * 0.024916,
								g32 = $scope.psj(val) * 0.230518,
								g33 = $scope.psj(val) * 0.023052,
								g34 = $scope.psj(val) * 0.001330,
								g35 = $scope.psj(val) * 0.010752,
								g36 = $scope.psj(val) * 0.000012,
								g37 = $scope.psj(val) * 0.054547,
								g38 = $scope.psj(val) * 0.006698;

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
					$scope.seats_resold = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.1;
						} else {
							num = 0.05;
						}
						return num * $scope.total_checks(val);
					};
					// ref:8
					$scope.additional_revenue = function (val) {
						return Math.round($scope.cal.param9 * $scope.seats_resold(val));
					};
					// ref:9
					$scope.ref9 = function (val) {
						return $scope.additional_revenue(val) * 12;
					};
					// ref:10
					$scope.no_show_per_annum = function (val) {
						return 0.03 * $scope.cal.param1;
					};
					// ref:11
					$scope.no_shows_avoided = function (val) {
						var num;
						if ( val === 'high' ) {
							num = 0.2;
						} else {
							num = 0.1;
						}
						return $scope.no_show_per_annum(val) * num;
					};
					// ref:12
					$scope.gds_cost_reduction = function (val) {
						return 450 * $scope.no_shows_avoided(val);
					};
					// ref:13
					$scope.process_improvement = function (val) {
						return Math.round($scope.ref9(val) + $scope.gds_cost_reduction(val) / 2);
					};

					$scope.revenue_integrity_process_improvement_high = Math.round($scope.process_improvement("high") / $scope.cal.adjustment);
					$scope.revenue_integrity_process_improvement_low = Math.round($scope.process_improvement("low") / $scope.cal.adjustment);

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
						chartData.summary.high.revenue_integrity.value = $scope.revenue_integrity_high;
						chartData.summary.low.revenue_integrity.value = $scope.revenue_integrity_low;
					} else {
						chartData.summary.high.revenue_integrity.value = 0;
						chartData.summary.low.revenue_integrity.value = 0;
					}

					// revenue_integrity_process_improvement
					if ( $scope.cal.services.op2 === true ) {
						chartData.summary.high.revenue_integrity_process_improvement.value = $scope.revenue_integrity_process_improvement_high;
						chartData.summary.low.revenue_integrity_process_improvement.value = $scope.revenue_integrity_process_improvement_low;
					} else {
						chartData.summary.high.revenue_integrity_process_improvement.value = 0;
						chartData.summary.low.revenue_integrity_process_improvement.value = 0;
					}

					// cmap
					if ( $scope.cal.services.op5 === true ) {
						chartData.summary.high.cmap.value = $scope.cmap_high;
						chartData.summary.low.cmap.value = $scope.cmap_low;
					} else {
						chartData.summary.high.cmap.value = 0;
						chartData.summary.low.cmap.value = 0;
					}

					// o&d
					if ( $scope.cal.services.op6 === true ) {
						chartData.summary.high.o_and_d.value = $scope.o_and_d_high;
						chartData.summary.low.o_and_d.value = $scope.o_and_d_low;
					} else {
						chartData.summary.high.o_and_d.value = 0;
						chartData.summary.low.o_and_d.value = 0;
					}

					// pos
					if ( $scope.cal.services.op7 === true ) {
						chartData.summary.high.pos.value = $scope.pos_high;
						chartData.summary.low.pos.value = $scope.pos_low;
					} else {
						chartData.summary.high.pos.value = 0;
						chartData.summary.low.pos.value = 0;
					}

					// insight
					if ( $scope.cal.services.op9 === true ) {
						chartData.summary.high.insight.value = $scope.insight_high;
						chartData.summary.low.insight.value = $scope.insight_low;
					} else {
						chartData.summary.high.insight.value = 0;
						chartData.summary.low.insight.value = 0;
					}

					// Save summary to local storage
					localStorageService.set('summary', chartData.summary);

					// Save calculations to local storage
					localStorageService.set('cal', $scope.cal);

					/**
					 *  Pie chart drawing functions
					 */
						// Function to convert data object to array for chart
					$scope.pie_values = [];
					$scope.getPieValue = function (pie_data, pie_array) {
						var i = 0;
						angular.forEach(pie_data, function (value, key) {
							pie_array.push([value.name, value.value]);
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
					// Because the chart displaying high value is default, checking that low value chart is showing
					if ( localStorageService.get('results_view') && localStorageService.get('results_view').name === "chart_low" ) {

						// Highcharts config for pie chart (high value)
						$scope.chartConfigLow = chartConfig.chartConfigPie;

						// Store the chart object child in seriesArrayPie variable
						var seriesArrayPie = $scope.chartConfigLow.series[0];

						$scope.getPieValue(chartData.summary.low, $scope.pie_values);

						seriesArrayPie.data = $scope.pie_values;

						$scope.serviceTotals(seriesArrayPie.data);

					} else {

						// Highcharts config for pie chart (high value)
						$scope.chartConfigHigh = chartConfig.chartConfigPie;

						// Store the chart object child in seriesArrayPie variable
						var seriesArrayPie = $scope.chartConfigHigh.series[0];

						$scope.getPieValue(chartData.summary.high, $scope.pie_values);

						seriesArrayPie.data = $scope.pie_values;

						$scope.serviceTotals(seriesArrayPie.data);

					}

					// Change values based on state/page change
					$rootScope.$on('$stateChangeStart',
							function (event, toState, toParams, fromState, fromParams) {
								$scope.pie_values = [];
								$scope.chartConfigHigh = chartConfig.chartConfigPie;
								$scope.getPieValue(chartData.summary.high, $scope.pie_values);
								$scope.serviceTotals(seriesArrayPie.data);

								if ( toState.name === 'chart_low' ) {
									$scope.chartConfigLow = chartConfig.chartConfigPie;
									$scope.pie_values = [];
									$scope.getPieValue(chartData.summary.low, $scope.pie_values);
									$scope.serviceTotals(seriesArrayPie.data);
								}
								seriesArrayPie.data = $scope.pie_values;
							});

				};

				// Update chart on load
				$scope.updateChart();

			}])

		.controller('SessionsDetailCtrl', ['$rootScope', '$scope', '$routeParams', '$firebase', '$state', 'chartConfig', 'chartData', function ($rootScope, $scope, $routeParams, $firebase, $state, chartConfig, chartData) {

			/* Get associated session item from Firebase */
			$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + $routeParams.id));

			/* Promise for loaded data */
			$scope.item.$on("loaded", function () {

				$scope.cal = $scope.item.calculations;
				$scope.detail_summary = $scope.item.summary;

				/**
				 *  Pie chart drawing functions
				 */
					// Function to convert data object to array for chart
				$scope.pie_values = [];
				$scope.getPieValue = function (pie_data, pie_array) {
					var i = 0;
					angular.forEach(pie_data, function (value, key) {
						pie_array.push([value.name, value.value]);
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

				$scope.pie_values_high = [];
				$scope.chartConfigHigh = chartConfig.chartConfigPie;
				// Store the chart object child in seriesArrayPie variable
				var seriesArrayPieHigh = $scope.chartConfigHigh.series[0];
				$scope.getPieValue($scope.detail_summary.high, $scope.pie_values_high);
				seriesArrayPieHigh.data = $scope.pie_values_high;
				// Highcharts config for pie chart (high value)
				$scope.chartConfigHigh = chartConfig.chartConfigPie;
				$scope.serviceTotals(seriesArrayPieHigh.data);

			});

		}]);