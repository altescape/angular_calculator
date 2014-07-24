'use strict';

var app = angular.module('myApp', [
			'highcharts-ng',
			'ngRoute',
			'firebase',
			'ui.bootstrap',
			'ui.router',
			'LocalStorageModule',
			'ngAnimate',
			'myApp.directives',
			'myApp.filters',
			'myApp.services',
			'myApp.controllers',
			'myApp.chart_controllers'
		]).config(['$routeProvider', '$stateProvider', '$urlRouterProvider', function ($routeProvider, $stateProvider, $urlRouterProvider) {
			$routeProvider.when('/user', {templateUrl : 'partials/user.html'});
			$routeProvider.when('/calculator', {templateUrl : 'partials/calculator.html', controller : 'TestCtrl'});
			$routeProvider.when('/logout', {templateUrl : 'partials/logout.html', controller : 'LogOutCtrl'});
			$routeProvider.when('/logged-out', {templateUrl : 'partials/logged-out.html', controller : 'LogOutCtrl'});
			$routeProvider.when('/saved-calculations', {templateUrl : 'partials/calculations/saved-calculations.html', controller : 'ListSessionCtrl'});
			$routeProvider.when('/saved-calculations/:id', {templateUrl : 'partials/calculations/saved-calculations-detail.html', controller : 'SessionsDetailCtrl'});
			$routeProvider.when('/save-calculation', {templateUrl : 'partials/calculations/save-calculation.html', controller : 'SaveSessionCtrl'});
			$routeProvider.when('/update-calculation', {templateUrl : 'partials/calculations/update-calculation.html', controller : 'UpdateSessionCtrl'});
			$routeProvider.when('/test', {templateUrl : 'partials/test.html', controller : 'TestCtrl'});

			$routeProvider.otherwise({redirectTo : '/user'});

			$stateProvider
					.state('calculator', {
						views : {
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						},
						controller : 'TestCtrl'
					});

			$stateProvider
					.state('table', {
						views : {
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('chart_high', {
						views : {
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('chart_low', {
						views : {
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('test', {
						views : {
							"dataView" : {templateUrl : "partials/test.html"}
						},
						controller : 'TestCtrl'
					});

		}
		]);