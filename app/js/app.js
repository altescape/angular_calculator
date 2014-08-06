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
//			$routeProvider.when('/info', {templateUrl : 'partials/info.html'});
//			$routeProvider.when('/auth', {templateUrl : 'partials/auth/form.html', controller : 'AuthCtrl'});
//			$routeProvider.when('/calculator', {templateUrl : 'partials/calculator.html', controller : 'TestCtrl'});
//			$routeProvider.when('/logout', {templateUrl : 'partials/logout.html', controller : 'LogOutCtrl'});
//			$routeProvider.when('/logged-out', {templateUrl : 'partials/logged-out.html', controller : 'LogOutCtrl'});
//			$routeProvider.when('/saved-calculations', {templateUrl : 'partials/calculations/saved-calculations.html', controller : 'ListSessionCtrl'});
//			$routeProvider.when('/saved-calculations/:id', {templateUrl : 'partials/calculations/saved-calculations-detail.html', controller : 'SessionsDetailCtrl'});
//			$routeProvider.when('/save-calculation', {templateUrl : 'partials/calculations/save-calculation.html', controller : 'SaveSessionCtrl'});
//			$routeProvider.when('/update-calculation', {templateUrl : 'partials/calculations/update-calculation.html', controller : 'UpdateSessionCtrl'});
//			$routeProvider.when('/test', {templateUrl : 'partials/test.html', controller : 'TestCtrl'});

			$routeProvider.otherwise({redirectTo : '/info'});

			$stateProvider
					.state('info', {
						url: "/info",
						views : {
							"mainView" : {templateUrl : "partials/info.html"}
						}
					});

			$stateProvider
					.state('auth', {
						url: "/auth",
						views : {
							"mainView" : {templateUrl : "partials/auth/form.html"}
						},
						controller : 'AuthCtrl'
					});

			$stateProvider
					.state('calculator', {
						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {
								templateUrl : "partials/results/chart_high.html"
							}
						}
					});

			$stateProvider
					.state('calculator.chart_high', {
//						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('calculator.chart_low', {
//						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('calculator.table', {
//						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('calculator.test', {
//						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'TestCtrl'
							},
							"dataView" : {templateUrl : "partials/test.html"}
						}
					});

			$stateProvider
					.state('clear-data', {
						url: "/clear-data",
						views : {
							"mainView" : {
								templateUrl : "partials/clear-data.html",
								controller : 'ClearDataCtrl'
							}
						}
					});

			$stateProvider
					.state('clear-data-confirm', {
						url: "/clear-data-confirm",
						views : {
							"mainView" : {
								templateUrl : "partials/clear-data-confirm.html",
								controller : 'ClearDataCtrl'
							}
						},
						controller : 'ClearDataCtrl'
					});

			$stateProvider
					.state('saved-calculations', {
						url: "/saved-calculations",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations.html",
								controller : 'ListSessionCtrl'
							}
						}
					});

			$stateProvider
					.state('saved-calculations-detail', {
						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller: 'SessionsDetailCtrl'
							}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.chart_high', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.chart_low', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.table', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('saved-calculations-detail.test', {
//						url: "/saved-calculations/:id",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "partials/test.html"}
						}
					});

			$stateProvider
					.state('save-calculation', {
						url: "/save-calculation",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/save-calculation.html",
								controller : 'SaveSessionCtrl'
							}
						}
					});

			$stateProvider
					.state('update-calculation', {
						url: "/update-calculation",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/update-calculation.html",
								controller : 'UpdateSessionCtrl'
							}
						}
					});

		}
		]);