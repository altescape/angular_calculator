/**
 * Created by michaelwatts on 21/06/2014.
 */

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
    ]
    ).config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/user', {templateUrl: 'partials/user.html', controller: 'InfoCtrl'});
      $routeProvider.when('/calculator', {templateUrl: 'partials/calculator.html', controller: 'ChartCtrl'});
      $routeProvider.when('/logout', {templateUrl: 'partials/logout.html', controller: 'LogOutCtrl'});
      $routeProvider.when('/logged-out', {templateUrl: 'partials/logged-out.html', controller: 'LogOutCtrl'});
      $routeProvider.when('/sessions', {templateUrl: 'partials/sessions.html', controller: 'ListSessionCtrl'});
      $routeProvider.when('/sessions/:id', {templateUrl: 'partials/sessions-detail.html', controller: 'ListSessionCtrl'});
      $routeProvider.when('/save-session', {templateUrl: 'partials/save-session.html', controller: 'SaveSessionCtrl'});
      $routeProvider.when('/update-session', {templateUrl: 'partials/update-session.html', controller: 'UpdateSessionCtrl'});
//      $routeProvider.when('/save-session/:id', {templateUrl: 'partials/save-session.html', controller: 'SaveSessionCtrl'});
      $routeProvider.otherwise({redirectTo: '/user'});
    }
    ]);