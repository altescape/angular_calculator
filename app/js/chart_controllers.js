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
			'chartData',
			function ($rootScope, $scope, localStorageService, inputData, allData, revenueIntegrity, revenueIntegrityProcessImprovement, $state, chartConfig, chartData) {

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

					/**
					 * Add data to data service / factory arrays
					 */
					// revenue_integrity
					if ( $scope.cal.services.op1 === true ) {
						chartData.summary.high.revenue_integrity.value = allData.revenue_integrity.high;
						chartData.summary.low.revenue_integrity.value = allData.revenue_integrity.low;
					} else {
						chartData.summary.high.revenue_integrity.value = 0;
						chartData.summary.low.revenue_integrity.value = 0;
					}

					// revenue_integrity_process_improvement
					if ( $scope.cal.services.op2 === true ) {
						chartData.summary.high.revenue_integrity_process_improvement.value = allData.revenue_integrity_process_improvement.high;
						chartData.summary.low.revenue_integrity_process_improvement.value = allData.revenue_integrity_process_improvement.low;
					} else {
						chartData.summary.high.revenue_integrity_process_improvement.value = 0;
						chartData.summary.low.revenue_integrity_process_improvement.value = 0;
					}

					// cmap
					if ( $scope.cal.services.op5 === true ) {
						chartData.summary.high.cmap.value = allData.cmap.high;
						chartData.summary.low.cmap.value = allData.cmap.low;
					} else {
						chartData.summary.high.cmap.value = 0;
						chartData.summary.low.cmap.value = 0;
					}

					// o&d
					if ( $scope.cal.services.op6 === true ) {
						chartData.summary.high.o_and_d.value = allData.origin_and_destination.high;
						chartData.summary.low.o_and_d.value = allData.origin_and_destination.low;
					} else {
						chartData.summary.high.o_and_d.value = 0;
						chartData.summary.low.o_and_d.value = 0;
					}

					// pos
					if ( $scope.cal.services.op7 === true ) {
						chartData.summary.high.pos.value = allData.pos.high;
						chartData.summary.low.pos.value = allData.pos.low;
					} else {
						chartData.summary.high.pos.value = 0;
						chartData.summary.low.pos.value = 0;
					}

					// insight
					if ( $scope.cal.services.op9 === true ) {
						chartData.summary.high.insight.value = allData.arr.high;
						chartData.summary.low.insight.value = allData.arr.low;
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

			}]);