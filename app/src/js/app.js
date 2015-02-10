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
            'fcsa-number'
		]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

			$urlRouterProvider.otherwise("/home");

			$stateProvider
					.state('home', {
						url: "/home",
						views : {
							"mainView" : {templateUrl : "partials/home.html"}
						}
					});

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
						}
					});

			$stateProvider
					.state('forgot-password', {
						url: "/forgot-password",
						views : {
							"mainView" : {templateUrl : "partials/auth/forgot-password.html"}
						}
					});

			$stateProvider
					.state('change-password', {
						url: "/change-password",
						views : {
							"mainView" : {templateUrl : "partials/auth/change-password.html"}
						}
					});

			$stateProvider
					.state('calculator', {
						abstract:true,
						url: "/calculator",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {
								templateUrl : "partials/results/chart_high.html"
							}
						}
					});

			$stateProvider
					.state('calculator.index', {
						url: "",
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {
								templateUrl : "partials/results/chart_high.html"
							}
						}
					});

			$stateProvider
					.state('calculator.chart_high', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_high.html"}
						}
					});

			$stateProvider
					.state('calculator.chart_low', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {templateUrl : "partials/results/chart_low.html"}
						}
					});

			$stateProvider
					.state('calculator.table', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {templateUrl : "partials/results/table.html"}
						}
					});

			$stateProvider
					.state('calculator.data', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculator.html",
								controller : 'CalcCtrl'
							},
							"dataView" : {templateUrl : "../../../partials/calculator/_data.html"}
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
						}
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
					.state('saved-calculations-detail.data', {
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/saved-calculations-detail.html",
								controller : 'SessionsDetailCtrl'
							},
							"dataView" : {templateUrl : "../../../partials/calculator/_data.html"}
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

			$stateProvider
					.state('new-calculation', {
						url: "/new-calculation",
						views : {
							"mainView" : {
								templateUrl : "partials/calculations/new-calculation.html",
								controller : 'NewSessionCtrl'
							}
						}
					});

		}
		]);