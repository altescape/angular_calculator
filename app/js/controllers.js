'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

	/* General information */
		.controller('InfoCtrl', ['$scope', 'localStorageService', 'InfoFctry', function ($scope, localStorageService, InfoFctry) {

			/* Fast click, removes time delay on click on mobile */
			FastClick.attach(document.body, null);

			/* Check net is up */
			$scope.isNetUp = true;

			Offline.on('confirmed-up', function () {
				$scope.isNetUp = true;
				return true;
			});

			Offline.on('confirmed-down', function () {
				$scope.isNetUp = false;
				return false;
			});

			/* Resizing function */
			$scope.resizeContentWrapper = function (ele_id) {
				$scope.winHeight = document.documentElement.clientHeight;
				ele_id.setAttribute('style', 'height: ' + $scope.winHeight + 'px');
			};
			$scope.wrap = document.getElementById('wrap');
			$(window).resize(function () {
				$scope.resizeContentWrapper($scope.wrap);
			});
			$scope.resizeContentWrapper($scope.wrap);

			/* User information */
			$scope.info = InfoFctry.info;
			$scope.info.date = {
				timestamp : Math.round(new Date().getTime() / 1000),
				date : new Date().toISOString()
			};

			$scope.updateInfo = function () {
				localStorageService.set('info', $scope.info);
				InfoFctry.info = $scope.info;
			};

			/* Watches InfoFcty */
			$scope.$watch(function () {
						return InfoFctry.info;
					},
					function (newVal, oldVal) {
						$scope.info = InfoFctry.info;
					}, true);
		}])

		.controller('LogOutCtrl', ['$scope', 'localStorageService', '$location', 'InfoFctry', function ($scope, localStorageService, $location, InfoFctry) {
			/* Logs out the user and clears locally stored data */
			$scope.confirmLogout = function () {
				localStorageService.clearAll();
				InfoFctry.user = {};
				InfoFctry.session = {};
				$location.path('confirm-logout');
			};

			$scope.startOver = function () {
				$location.path('user');
			};
		}])

		.controller('ListSessionCtrl', [
			'$scope',
			'$firebase',
			'localStorageService',
			'InfoFctry',
			'ChartInitFctry',
			'$location',
			function ($scope, $firebase, localStorageService, InfoFctry, ChartInitFctry, $location) {


				/* Gets session items from firebase */
				$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita'));

				/* Loading data */
				$scope.load_status = "loading";
				$scope.ele_load_status = "hide_on_loading";
				$scope.items.$on("loaded", function () {
					$scope.load_status = "loaded";
					$scope.ele_load_status = "show_on_loaded";
				});

				/* Count sessions */
				$scope.sessionCount = function () {
					return $scope.items.$getIndex().length;
				};

				/* Delete associated session */
				$scope.deleteSession = function (id) {
					$scope.items.$remove(id);
					$location.path('sessions');
				};

				/* Copy a session */
				$scope.copySession = function (id) {

					$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + id));
					$scope.copy_info = $scope.item.meta;
					$scope.copy_cal = $scope.item.calculations;

					$scope.copy_info.date = {
						timestamp : Math.round(new Date().getTime() / 1000),
						date : new Date().toISOString()
					};

					$scope.items.$add({
						meta : $scope.copy_info,
						calculations : $scope.copy_cal
					});
				};

				/* Use associated session, replaces local storage with associated session */
				$scope.useSession = function (id) {
					$scope.item = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + id));
					localStorageService.set('info', $scope.item.meta);
					localStorageService.set('cal', $scope.item.calculations);
					localStorageService.set('summary', $scope.item.summary);

					InfoFctry.info = $scope.item.meta;
					ChartInitFctry.cal = $scope.item.calculations;

					localStorageService.set('current_key', id);
				};

			}])

		.controller('SessionsCtrl', ['$scope', 'FbService', 'FbService2', function ($scope, FbService, FbService2) {

			/* Firebase */
			$scope.fbtest = function () {
				$scope.text.sum = 0;
				FbService2.$bind($scope, "text");
			};

			$scope.sum = function (num, num2) {
				return parseInt(num + num2);
			};
		}])

		.controller('SaveSessionCtrl', ['$scope', 'localStorageService', '$firebase', '$timeout', function ($scope, localStorageService, $firebase, $timeout) {

			// Saves new session
			$scope.running_session = false;

			if ( localStorageService.get('current_key') ) {
				$scope.running_session = true;
			}

			$scope.saveSession = function () {
				$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita'));
				$scope.items.$add({
					meta : localStorageService.get('info'),
					calculations : localStorageService.get('cal'),
					summary : localStorageService.get('summary')
				}).then(function (ref) {
					localStorageService.set('current_key', ref.name());
					$scope.running_session = true;
				})
			};

			// Update the current session, takes key from localstorage
			$scope.saving = false;
			$scope.saved = false;

			$scope.updateSession = function () {
				if ( $scope.running_session === true ) {
					$scope.saving = true;
					$scope.items = $firebase(new Firebase('https://luminous-fire-1327.firebaseio.com/sita/' + localStorageService.get('current_key')));

					$scope.items.$set({
						meta : localStorageService.get('info'),
						calculations : localStorageService.get('cal'),
						summary : localStorageService.get('summary')
					}).then(function () {
						$scope.saving = false;
						$scope.saved = true;

						$timeout(function () {
							$scope.saved = false;
						}, 2500);
					});
				}
			}
		}]);