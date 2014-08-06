'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

		.controller('InfoCtrl',
				[
					'$scope',
					'localStorageService',
					'infoData', function ($scope, localStorageService, infoData) {

					/**
					 *  Fast click, removes time delay for click on mobile
					 */
					FastClick.attach(document.body, null);

					/**
					 *  Check net is up
					 */
						// Default value for flag
					$scope.isNetUp = true;

					// Checks whether net is up
					Offline.on('confirmed-up', function () {
						// Update flag
						$scope.isNetUp = true;
						return true;
					});

					// Checks whether net is down
					Offline.on('confirmed-down', function () {
						// Update flag
						$scope.isNetUp = false;
						return false;
					});

					/**
					 *  Resizing the windows updates various elements
					 */
					$scope.resizeContentWrapper = function (ele_id) {
						$scope.winHeight = document.documentElement.clientHeight;
						ele_id.setAttribute('style', 'height: ' + $scope.winHeight + 'px');
					};

					// Store ele in variable
					var wrap = document.getElementById('wrap');

					// On resize
					$(window).resize(function () {
						$scope.resizeContentWrapper(wrap);
					});

					// Call resize on page load
					$scope.resizeContentWrapper(wrap);

					/**
					 *  User information
					 */
					// Update info, store in localstorage and send data back to infoData
					$scope.updateInfo = function () {
						// Add latest timestamp and date
						$scope.info.date = {
							timestamp : Math.round(new Date().getTime() / 1000),
							date : new Date().toISOString()
						};
						localStorageService.set('info', $scope.info);
					};

					// Watch infoData for updates
					$scope.$watch(function () {
								return infoData.info;
							},
							function (newVal, oldVal) {
								$scope.info = infoData.info;
							}, true);

					var settings = {
						disable : 'right',
						hyperextensible : false,
						transitionSpeed : .3,
						easing : 'ease'
					};

					var snapper = new Snap({
						element : document.getElementById('main-content')
					});

					snapper.settings(settings);

					$scope.openLeft = function () {
						if ( snapper.state().state == "left" ) {
							snapper.close();
							return false;
						} else {
							snapper.open('left');
							return true;
						}
					};

				}])

		.controller('ClearDataCtrl',
				[
					'$scope',
					'localStorageService',
					'$location',
					'infoData',
					'inputData',
					'$state', function ($scope, localStorageService, $location, infoData, inputData, $state) {
					/**
					 *  Logs out the user and clears locally stored data
					 */
					$scope.confirmLogout = function () {
						localStorageService.clearAll();

						// Reset models
						infoData.info = {};

						$state.go('clear-data-confirm');
					};

					/**
					 * Once logout has been confirmed, start over
					 */
					$scope.startOver = function () {
						$state.go('info');
					};

				}])

		.controller('ListSessionCtrl',
				[
					'$scope',
					'$firebase',
					'localStorageService',
					'infoData',
					'inputData',
					'allData',
					'$location',
					function ($scope, $firebase, localStorageService, infoData, inputData, allData, $location) {

						/**
						 *  Get current key
						 */
						$scope.current_key = localStorageService.get('current_key');

						/**
						 *  Gets saved calculations from firebase
						 *
						 * @type {*}
						 */
						$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita'));

						/**
						 * Loading data preloading
						 */
						$scope.load_status = "loading";
						$scope.ele_load_status = "hide_on_loading";
						$scope.items.$on("loaded", function () {
							$scope.load_status = "loaded";
							$scope.ele_load_status = "show_on_loaded";
						});

						/**
						 * Count saved calculations
						 *
						 * @returns {y.length|*|z.length|dummy.length|length|mfn.length}
						 */
						$scope.sessionCount = function () {
							return $scope.items.$getIndex().length;
						};

						/**
						 *  Delete saved calculations
						 *
						 *  @param id
						 */
						$scope.deleteSession = function (id) {
							$scope.items.$remove(id);
							$location.path('saved-calculations');
						};

						/**
						 *  Copy a saved calculation
						 *
						 *  @param id
						 */
						$scope.copySession = function (id) {

							// Connect to firebase and retrieve saved calculations
							$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + id));

							// Copy saved data to $scope variables
							$scope.copy_info = $scope.item.info;
							$scope.copy_cal = $scope.item.input;

							// Update the timestamp and date
							$scope.copy_info.date = {
								timestamp : Math.round(new Date().getTime() / 1000),
								date : new Date().toISOString()
							};

							// Add to items object the copied data
							$scope.items.$add({
								info : $scope.copy_info,
								calculations : $scope.copy_cal
							});
						};

						/**
						 *  Use a particular saved calculation,
						 *  replaces data in local storage with this copied calculation
						 *
						 *  @param id
						 */
						$scope.useSession = function (id) {

							// @todo: need to confirm that user has saved current calculation before going further

							// Connect to firebase to retrieve saved calculation with id
							$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + id));

							// Set the data
							localStorageService.set('info', $scope.item.info);
							localStorageService.set('input', $scope.item.input);
							localStorageService.set('data', $scope.item.data);

							// Update the infoData and ChartInitFactry with new values
							infoData.info = $scope.item.meta;
							inputData = $scope.item.input;
							allData.data = $scope.item.data;

							// Set the current key in localstorage
							localStorageService.set('current_key', id);

							// Set current_key
							$scope.current_key = localStorageService.get('current_key');

//							$location.path('calculator');

							// Set running session flag to true
							infoData.info.running_session = true;
						};

					}])

		.controller('SessionsDetailCtrl',
				[
					'$rootScope',
					'$scope',
					'$routeParams',
					'$firebase',
					'$state',
					'$stateParams',
					'chartData', function ($rootScope, $scope, $routeParams, $firebase, $state, $stateParams, chartData) {

					/* Get associated session item from Firebase */
					$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + $stateParams.id));

					/* Promise for loaded data */
					$scope.item.$on("loaded", function () {

						var data = $scope.item.data;

						/**
						 * Calls the factories for each service
						 */
						$scope.updateData = function () {

							$scope.revenue_integrity = data.revenue_integrity;

							$scope.revenue_integrity_process_improvement = data.revenue_integrity_process_improvement;

							$scope.cmap = data.cmap;

							$scope.origin_and_destination = data.origin_and_destination;

							$scope.pos = data.pos;

							$scope.arr = data.arr;

							$scope.airfare_insight = data.airfare_insight;


//							localStorageService.set('data', allData);
//							localStorageService.set('input', inputData);

							// @todo: chart configs are not storing separate values for both graphs.
							// Need to find out why and stop from using this sort of if/else as makes it fragile.
							if ( $state.current.name === 'saved-calculations-detail.chart_low' ) {
								$scope.chartConfigLow = chartData.drawChart('low', data);
							} else {
								$scope.chartConfigHigh = chartData.drawChart('high', data);
							}

						};
						$scope.updateData();

						$state.go('saved-calculations-detail.chart_high');

						/**
						 * View state
						 *
						 * Saves the state of the open results view, Charts or table,
						 * when loaded. Uses state and state change success event ($stateChangeSuccess).
						 */
						$rootScope.$on('$stateChangeSuccess',
								function (event, toState, toParams, fromState, fromParams) {
									// update chart
									$scope.updateData();
								});

					});

				}])

		.controller('SessionsCtrl', ['$scope', 'FbService', 'FbService2', function ($scope, FbService, FbService2) {

			/**
			 *  Firebase
			 */
			$scope.fbtest = function () {
				$scope.text.sum = 0;
				FbService2.$bind($scope, "text");
			};

			/**
			 * Firebase: testing - not used in app
			 * @param num
			 * @param num2
			 * @returns {Number}
			 */
			$scope.sum = function (num, num2) {
				return parseInt(num + num2);
			};
		}])

		.controller('SaveSessionCtrl',
				[
					'$scope',
					'localStorageService',
					'$firebase',
					'$timeout',
					'infoData', function ($scope, localStorageService, $firebase, $timeout, infoData) {

					// Watch infoData for updates
					$scope.$watch(function () {
								return infoData.info;
							},
							function (newVal, oldVal) {
								$scope.info = infoData.info;
							}, true);

					/**
					 * Check current_key exists
					 * It means we're currently running a session
					 */
					if ( localStorageService.get('current_key') ) {
						$scope.info.running_session = true;
					} else $scope.info.running_session = false;

					// Save status flags
					$scope.saving = false;
					$scope.saved = false;

					/**
					 * Save session to Firebase
					 */
					$scope.saveSession = function () {

						// Store to Firebase address
						$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/'));

						// Set flag: saving to true
						$scope.saving = true;

						// Add the data from localstorage and add it to Firebase
						$scope.items.$add({
							info : localStorageService.get('info'),
							input : localStorageService.get('input'),
							data : localStorageService.get('data')
						}).then(function (ref) {

							// Once added retrieve the ref id and set in localstorage
							localStorageService.set('current_key', ref.name());

							// Update running_session flag
							$scope.info.running_session = true;

							// Saving has finished so reset saving flag
							$scope.saving = false;

							// And flag that it's been saved
							$scope.saved = true;

							// After a while set the saved flag back to default, this takes saved message back off screen
							$timeout(function () {
								$scope.saved = false;
							}, 2500);

						});

					};

					/**
					 * Updates the current calculation and uploads it to Firebase
					 */
					$scope.updateSession = function () {

						// we are currently running a calculation/session
						if ( $scope.info.running_session === true ) {

							// Set flag: saving to true
							$scope.saving = true;

							// Get the link to the firebase item with id key from localstorage
							$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + localStorageService.get('current_key')));

							// Set and update the firebase item with new values from localstorage
							$scope.items.$set({
								info : localStorageService.get('info'),
								input : localStorageService.get('input'),
								data : localStorageService.get('data')
							}).then(function () {

								// Saving has finished so reset saving flag
								$scope.saving = false;

								// And flag that it's been saved
								$scope.saved = true;

								// After a while set the saved flag back to default, this takes saved message back off screen
								$timeout(function () {
									$scope.saved = false;
								}, 2500);
							});
						}
					}
				}])

		.controller('TestCtrl',
				[
					'$rootScope',
					'$scope',
					'$location',
					'localStorageService',
					'$state',
					'chartData',
					'chartConfig',
					'inputData',
					'allData',
					'revenueIntegrity',
					'revenueIntegrityProcessImprovement',
					'cmap',
					'originAndDestination',
					'pointOfSale',
					'passengersBoardedData',
					'arr',
					'airfareInsight',
					'channelShift',
					function ($rootScope, $scope, $location, localStorageService, $state, chartData, chartConfig, inputData, allData, revenueIntegrity, revenueIntegrityProcessImprovement, cmap, originAndDestination, pointOfSale, passengersBoardedData, arr, airfareInsight, channelShift) {

						/**
						 * Calls the factories for each service
						 */
						$scope.updateData = function () {

							revenueIntegrity.initObject();
							$scope.revenue_integrity = allData.revenue_integrity;

							revenueIntegrityProcessImprovement.initObject();
							$scope.revenue_integrity_process_improvement = allData.revenue_integrity_process_improvement;

							cmap.initObject();
							$scope.cmap = allData.cmap;

							originAndDestination.initObject();
							$scope.origin_and_destination = allData.origin_and_destination;

							pointOfSale.initObject();
							$scope.pos = allData.pos;

							arr.initObject();
							$scope.arr = allData.arr;

							airfareInsight.initObject();
							$scope.airfare_insight = allData.airfare_insight;

//							console.log(channelShift());

							localStorageService.set('data', allData);
							localStorageService.set('input', inputData);

							// @todo: chart configs are not storing separate values for both graphs.
							// Need to find out why and stop from using this sort of if/else as makes it fragile.
							if ( $state.current.name === 'calculator.chart_low' ) {
								$scope.chartConfigLow = chartData.drawChart('low', localStorageService.get('data'));
							} else {
								$scope.chartConfigHigh = chartData.drawChart('high', localStorageService.get('data'));
							}

						};
						$scope.updateData();

						// Passengers boarded data. See variables sheet C2 - C16
						$scope.pb_data = passengersBoardedData;

						/**
						 * View state
						 *
						 * Stores the state of collapsed sections, collapsed = true|false.
						 *
						 * @type {*|Array|Choice|Undefined|Object|array|promise|Object}
						 */
						$scope.view_state = localStorageService.get('view_state');
						$scope.collapseSection = function () {
							localStorageService.set('view_state', $scope.view_state);
						};

						/**
						 * View state
						 *
						 * Initiates the process for saving the open results view, Charts or table.
						 *
						 * @type {*|Array|Choice|Undefined|Object|array|promise|Object}
						 */
						if ( localStorageService.get('results_view') ) {
							$state.go(localStorageService.get('results_view').name);
						} else {
							$state.go('calculator.chart_high');
						}

						/**
						 * View state
						 *
						 * Saves the state of the open results view, Charts or table,
						 * when loaded. Uses state and state change success event ($stateChangeSuccess).
						 */
						$rootScope.$on('$stateChangeSuccess',
								function (event, toState, toParams, fromState, fromParams) {
									// Store state of view in localstorage
//									localStorageService.set('results_view', toState);

									// update chart
									$scope.updateData();
								});

						/**
						 * Get the defaults values from inputData Factory
						 *
						 * @type {cal|*|$scope.cal}
						 */
						$scope.input = inputData;

						/**
						 * Watch inputs on calculator
						 *
						 * Watches inputData factory, if any changes detected then
						 * call updateData() to update allData factory.
						 */
						$scope.$watch(function () {
									return inputData;
								},
								function (newVal, oldVal) {
									$scope.updateData();
								}, true);

					}])

		.controller("AuthCtrl", ['$scope', '$firebaseSimpleLogin', 'localStorageService',
			function ($scope, $firebaseSimpleLogin, localStorageService) {
				var dataRef = new Firebase("https://luminous-fire-1327.firebaseio.com/");

				$scope.loginObj = $firebaseSimpleLogin(dataRef);

				$scope.loginObj.$getCurrentUser().then(
						function (user) {
							if ( user === null ) {
								$scope.isNotLoggedIn = true;
							} else {
								$scope.isNotLoggedIn = false;
							}
						}
				);

				$scope.loginUser = function () {
					$scope.loginObj.$login("password", {
						email : $scope.auth.email,
						password : $scope.auth.password
					}).then(function (user) {

						// messaging
						$scope.message = "You are logged in.";
						$scope.reason = "Welcome, " + user.email;
						$scope.isNotLoggedIn = false;

						// emit logged in message


					}, function (error) {
						$scope.message = "Login failed";
						switch (error.code) {
							case "INVALID_EMAIL" :
								$scope.reason = "The specified email address is incorrect.";
								break;
							case "INVALID_USER" :
								$scope.reason = "The specified user does not exist.";
								break;
							case "INVALID_PASSWORD" :
								$scope.reason = "The specified password is incorrect";
								break;
							case "UNKNOWN_ERROR" :
								$scope.reason = "An unknown error occurred. Please contact support@firebase.com.";
								break;
							case "USER_DENIED" :
								$scope.reason = "User denied authentication request.";
								break;
						}
					});
				};

				$scope.logoutUser = function () {
					$scope.message = "";
					$scope.loginObj.$logout();
					$scope.isNotLoggedIn = true;
				};
			}
		]);