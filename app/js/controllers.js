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

		.controller('LogOutCtrl',
				[
					'$scope',
					'localStorageService',
					'$location',
					'infoData',
					'inputData', function ($scope, localStorageService, $location, infoData, inputData) {
					/**
					 *  Logs out the user and clears locally stored data
					 */
					$scope.confirmLogout = function () {
						localStorageService.clearAll();

						// Reset models
						infoData.info = {};
						inputData.cal = {
							"services" : {},
							"param1" : 6500000,
							"param2" : 3,
							"param3" : 3611111,
							"param4" : 10,
							"param5" : 7,
							"param6" : 2500000000,
							"param7" : 2565000000,
							"param8" : 15,
							"param9" : 100,
							"param10" : 34,
							"adjustment" : 1000000
						};

						$location.path('confirm-logout');
					};

					/**
					 * Once logout has been confirmed, start over
					 */
					$scope.startOver = function () {
						$location.path('user');
					};

				}])

		.controller('ListSessionCtrl',
				[
					'$scope',
					'$firebase',
					'localStorageService',
					'infoData',
					'inputData',
					'$location',
					function ($scope, $firebase, localStorageService, infoData, inputData, $location) {

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
							$scope.copy_info = $scope.item.meta;
							$scope.copy_cal = $scope.item.calculations;

							// Update the timestamp and date
							$scope.copy_info.date = {
								timestamp : Math.round(new Date().getTime() / 1000),
								date : new Date().toISOString()
							};

							// Add to items object the copied data
							$scope.items.$add({
								meta : $scope.copy_info,
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

							// need to confirm that user has saved current calculation before going further

							// Connect to firebase to retrieve saved calculation with id
							$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + id));

							// Set the data
							localStorageService.set('info', $scope.item.meta);
							localStorageService.set('cal', $scope.item.calculations);
							localStorageService.set('summary', $scope.item.summary);

							// Update the infoData and ChartInitFactry with new values
							infoData.info = $scope.item.meta;
							inputData.cal = $scope.item.calculations;

							// Set the current key in localstorage
							localStorageService.set('current_key', id);

							// Set current_key
							$scope.current_key = localStorageService.get('current_key');

							$location.path('calculator');

							// Set running session flag to true
							infoData.info.running_session = true;
						};

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
							meta : localStorageService.get('info'),
							calculations : localStorageService.get('cal'),
							summary : localStorageService.get('summary')
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
								meta : localStorageService.get('info'),
								calculations : localStorageService.get('cal'),
								summary : localStorageService.get('summary')
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
					'$scope',
					'localStorageService',
					'chartData',
					'inputData',
					'allData',
					'revenueIntegrity',
					'revenueIntegrityProcessImprovement',
					'cmap',
					'originAndDestination',
					'pointOfSale',
					'passengersBoardedData',
					'airfareInsight',
					function ($scope,
										localStorageService,
										chartData,
										inputData,
										allData,
										revenueIntegrity,
										revenueIntegrityProcessImprovement,
										cmap,
										originAndDestination,
										pointOfSale,
										passengersBoardedData,
										airfareInsight) {

						/**
						 * Calls the factories for each service
						 */
						$scope.updateData = function () {
							revenueIntegrity.writeToObj();
							$scope.revenue_integrity = allData.revenue_integrity;

							revenueIntegrityProcessImprovement.writeToObj();
							$scope.revenue_integrity_process_improvement = allData.revenue_integrity_process_improvement;

							cmap.writeToObj();
							$scope.cmap = allData.cmap;

							originAndDestination.writeToObj();
							$scope.origin_and_destination = allData.origin_and_destination;

							pointOfSale.writeToObj();
							$scope.pos = allData.pos;

							airfareInsight.writeToObj();
							$scope.arr = allData.arr;

						};

						// See variables sheet C2 - C16
						$scope.pb_data = passengersBoardedData;

						/**
						 * Watches inputData factory, if any changes detected then
						 * call updateData() and allData factory will be updated
						 */
						$scope.$watch(function () {
									return inputData;
								},
								function (newVal, oldVal) {
									$scope.updateData();
								}, true);

						$scope.updateData();

					}]);