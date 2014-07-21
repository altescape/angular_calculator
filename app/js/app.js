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
			$routeProvider.when('/calculator', {templateUrl : 'partials/calculator.html', controller : 'ChartCtrl'});
			$routeProvider.when('/logout', {templateUrl : 'partials/logout.html', controller : 'LogOutCtrl'});
			$routeProvider.when('/logged-out', {templateUrl : 'partials/logged-out.html', controller : 'LogOutCtrl'});
			$routeProvider.when('/sessions', {templateUrl : 'partials/sessions.html', controller : 'ListSessionCtrl'});
			$routeProvider.when('/sessions/:id', {templateUrl : 'partials/sessions-detail.html', controller : 'ListSessionCtrl'});
			$routeProvider.when('/save-session', {templateUrl : 'partials/save-session.html', controller : 'SaveSessionCtrl'});
			$routeProvider.when('/update-session', {templateUrl : 'partials/update-session.html', controller : 'UpdateSessionCtrl'});

			$routeProvider.otherwise({redirectTo : '/user'});

			$stateProvider
					.state('calculator', {
						views : {
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						},
						controller : 'ChartCtrl'
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

		}
		]);