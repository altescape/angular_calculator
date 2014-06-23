/**
 * Created by michaelwatts on 21/06/2014.
 */

var app = angular.module('myApp', ['highcharts-ng', 'LocalStorageModule'])

	.factory('InfoFactory', function (localStorageService) {
		return {
			"user"   : {
				"name": localStorageService.get('user') && localStorageService.get('user').name
					? localStorageService.get('user').name
					: ""
			},
			"session": {
				"name": localStorageService.get('session') && localStorageService.get('session').name
					? localStorageService.get('session').name
					: ""
			}
		}
	})

	.controller('InfoCtrl', function ($scope, localStorageService, InfoFactory) {
		/* User data from InfoFactory */
		$scope.user = InfoFactory.user;
		/* Session data from InfoFactory */
		$scope.session = InfoFactory.session;

	})

	.controller('UserCtrl', function ($scope, localStorageService, InfoFactory) {

		$scope.user = InfoFactory.user;

		$scope.updateUser = function () {
			localStorageService.set('user', $scope.user);
			InfoFactory.user = $scope.user;
		};
	})

	.controller('SessionCtrl', function ($scope, localStorageService, InfoFactory) {

		$scope.session = InfoFactory.session;

		$scope.updateSession = function () {
			localStorageService.set('session', $scope.session);
			InfoFactory.session = $scope.session;
		};
	})

	.factory('ChartFactory', function (localStorageService) {
		return {
			"cal" : localStorageService.get('cal')
				? localStorageService.get('cal')
				: {
				"services": {
					"op1": 0,
					"op2": 0,
					"op3": 0,
					"op4": 0
				},
				"param1"  : 1000000,
				"param2"  : 50,
				"param3"  : 0,
				"param4"  : 0
			},
			"colors" : function () {
				{
					return angular.forEach(Highcharts.getOptions().colors, function (value, key) {
						key : value[key];
					})
				}
			}
		}
	})

	.controller('ChartCtrl', function ($scope, localStorageService, ChartFactory) {

		$scope.cal = ChartFactory.cal;

		$scope.colors = ChartFactory.colors();

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


			if (flag === "normal") {
				return [
					['Revenue Integrity', $scope.op1_con],
					['Revenue Integrity process improvement', $scope.op2_con],
					['Channel Shift', $scope.op3_con],
					['Ancillary sales', $scope.op4_con]
				];
			}
			if (flag === "aggressive") {
				return [
					['Revenue Integrity', $scope.op1_agg],
					['Revenue Integrity process improvement', $scope.op2_agg],
					['Channel Shift', $scope.op3_agg],
					['Ancillary sales', $scope.op4_agg]
				];
			}
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

			console.log($scope.total_cons);

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
	});