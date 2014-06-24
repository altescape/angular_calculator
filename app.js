/**
 * Created by michaelwatts on 21/06/2014.
 */

'use strict';

var app = angular.module('myApp', [
		'highcharts-ng',
		'LocalStorageModule',
		'ngRoute',
		'myApp.directives',
		'myApp.services',
		'myApp.controllers'
	]
).config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/user', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
		$routeProvider.when('/calculator', {templateUrl: 'partials/calculator.html', controller: 'ChartCtrl'});
		$routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'LogOutCtrl'});
		$routeProvider.when('/logged-out', {templateUrl: 'partials/logged-out.html', controller: 'LogOutCtrl'});
		$routeProvider.when('/sessions', {templateUrl: 'partials/sessions.html', controller: 'SessionsCtrl'});
		$routeProvider.when('/sessions/:id', {templateUrl: 'partials/sessions-detail.html', controller: 'SessionsDetailCtrl'});
		$routeProvider.when('/captured-screens', {templateUrl: 'partials/captured-screens.html', controller: 'CapturedScreeensCtrl'});
		$routeProvider.otherwise({redirectTo: '/user'});
	}
	]);