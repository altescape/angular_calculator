'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

    .controller('InfoCtrl',
    [
        '$rootScope',
        '$scope',
        'localStorageService',
        'infoData',
        '$interval',

        function ($rootScope,
                  $scope,
                  localStorageService,
                  infoData,
                  $interval) {

            //Fast click, removes time delay for click on mobile
            //FastClick.attach(document.body, null);

            // Listen for clearInfoData broadcast
            $scope.$on('clearInfoData', function (event, msg) {
                if (msg === true) {
                    // reset parts only, there is other stuff stored here
                    infoData.currency = {currency: 'USD', symbol: '$'};
                    infoData.airline = {code: ''};
                    infoData.opportunity = {name: ''};
                    infoData.session = {name: ''};

                    // Clear local storage
                    localStorageService.clearAll()
                }
            });

            // Check for clear infoData broadcast
            $scope.$on('isLoggedInMessage', function (event, msg) {
                infoData.loggedIn = msg;
            });

            // Set OfflineState to down
            $scope.OfflineState = 'down';
            // then after 2 secs check actual state and then every 2 secs
            $interval(function () {
                $scope.OfflineState = Offline.state;
            }, 200);

            // Resizing the windows updates various elements
            $scope.resizeContentWrapper = function (ele_id) {
                $scope.winHeight = document.documentElement.clientHeight;
                if (ele_id) {
                    ele_id.setAttribute('style', 'height: ' + $scope.winHeight + 'px');
                }
            };

            // Store ele in variable
            var wrap = document.getElementById('wrap');

            // On resize
            $(window).resize(function () {
                $scope.resizeContentWrapper(wrap);
            });

            // Call resize on page load
            $scope.resizeContentWrapper(wrap);

            // User information
            // Update info, store in localstorage and send data back to infoData
            $scope.updateInfo = function () {
                // Add latest timestamp and date
                $scope.info.date = {
                    timestamp: Math.round(new Date().getTime() / 1000),
                    date: new Date().toISOString()
                };

                // Currency
                $scope.setCurrency();

                localStorageService.set('info', $scope.info);
            };

            // Called when infoData updates, changes to infoData go here
            $scope.$watch(function () {
                    return infoData;
                },
                function (newVal, oldVal) {
                    $scope.info = infoData;
                    $scope.updateInfo();
                }, true);

            // Currency symbols
            $scope.currency_symbols = {
                'Dollar': '$', // Dollar
                'Euro': '€', // Euro
                'Colón': '₡', // Colón
                'Pound': '£', // Pound
                'Sheqel': '₪', // Sheqel
                'Rupee': '₹', // Rupee
                'Yen': '¥', // Yen
                'Won': '₩', // Won
                'Naira': '₦', // Naira
                'Peso': '₱', // Peso
                'Zloty': 'zł', // Zloty
                'Guarani': '₲', // Guarani
                'Baht': '฿', // Baht
                'Hryvnia': '₴', // Hryvnia
                'Dong': '₫' // Dong
            };

            // Set currency function
            $scope.setCurrency = function () {
                var currency_symbols = {
                    'ARS': $scope.currency_symbols['Dollar'], // Dollar
                    'AUD': $scope.currency_symbols['Dollar'], // Australian Dollar
                    'USD': $scope.currency_symbols['Dollar'], // US Dollar
                    'EUR': $scope.currency_symbols['Euro'], // Euro
                    'CRC': $scope.currency_symbols['Colón'], // Costa Rican Colón
                    'EGP': $scope.currency_symbols['Pound'], // Egyptian Pound
                    'FKP': $scope.currency_symbols['Pound'], // Falkland Islands Pound
                    'GIP': $scope.currency_symbols['Pound'], // Gibraltar Pound
                    'GBP': $scope.currency_symbols['Pound'], // British Pound Sterling
                    'ILS': $scope.currency_symbols['Sheqel'], // Israeli New Sheqel
                    'INR': $scope.currency_symbols['Rupee'], // Indian Rupee
                    'JPY': $scope.currency_symbols['Yen'], // Japanese Yen
                    'KRW': $scope.currency_symbols['Won'], // South Korean Won
                    'NGN': $scope.currency_symbols['Naira'], // Nigerian Naira
                    'PHP': $scope.currency_symbols['Peso'], // Philippine Peso
                    'PLN': $scope.currency_symbols['Zloty'], // Polish Zloty
                    'PYG': $scope.currency_symbols['Guarani'], // Paraguayan Guarani
                    'THB': $scope.currency_symbols['Baht'], // Thai Baht
                    'UAH': $scope.currency_symbols['Hryvnia'], // Ukrainian Hryvnia
                    'VND': $scope.currency_symbols['Dong'] // Vietnamese Dong
                };

                if ($scope.info) {
                    var selected_currency = $scope.info.currency;

                    if (selected_currency) {
                        if (currency_symbols[selected_currency.currency] === undefined) {
                            $scope.info.currency.symbol = '(' + selected_currency.currency + ')';
                        } else {
                            $scope.info.currency.symbol = currency_symbols[selected_currency.currency];
                        }
                    } else {
                        $scope.info.currency = {
                            currency: 'USD',
                            symbol: '$'
                        };
                        $scope.setCurrency();
                    }
                }
            };

            // Menu active from state names
            $scope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    switch (toState.name) {
                        case 'home' :
                            $scope.navActive = 'home';
                            break;
                        case 'info' :
                            $scope.navActive = 'info';
                            break;
                        case 'new-calculation' :
                            $scope.navActive = 'new';
                            break;
                        case 'calculator.index' :
                            $scope.navActive = 'calculator';
                            break;
                        case 'calculator.chart_high' :
                            $scope.navActive = 'calculator';
                            break;
                        case 'calculator.chart_low' :
                            $scope.navActive = 'calculator';
                            break;
                        case 'calculator.test' :
                            $scope.navActive = 'calculator';
                            break;
                        case 'saved-calculations' :
                            $scope.navActive = 'my-calculations';
                            break;
                        case 'saved-calculations-detail' :
                            $scope.navActive = 'my-calculations';
                            break;
                        case 'clear-data' :
                            $scope.navActive = 'settings';
                            break;
                        case 'auth' :
                            $scope.navActive = 'auth';
                            break;
                    }
                });

        }])

    .controller('ClearDataCtrl',
    [
        '$scope',
        '$window',
        'localStorageService',
        '$location',
        'infoData',
        'inputData',
        'allData',
        '$state',
        '$timeout',
        '$templateCache',
        function ($scope, $window, localStorageService, $location, infoData, inputData, allData, $state, $timeout, $templateCache) {
            /**
             *  Logs out the user and clears locally stored data
             */
            $scope.orig = angular.copy($scope.input);

            $scope.confirmClearData = function () {

                localStorageService.clearAll();

                $scope.input = angular.copy($scope.orig);

                $templateCache.removeAll();

                // Reset factories
                infoData = {};
                inputData = {};
                allData = {};

                // Reset models
                $scope.info = {
                    data: "reset"
                };
                $scope.input = {
                    data: "reset"
                };

                // Redirect to next step
                $state.transitionTo('clear-data-confirm');
                $timeout(function () {
                    $window.location.reload();
                }, 10);
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
        '$state',
        'localStorageService',
        '$modal',
        '$timeout',
        'infoData',
        'inputData',
        'allData',
        '$location',
        '$firebase',
        function ($scope, $state, localStorageService, $modal, $timeout, infoData, inputData, allData, $location, $firebase) {

            $scope.createNewSession = function () {
                $state.go('new-calculation');
                $scope.$emit('createNewSession', true);
            };

            var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
            var auth_ref = new Firebase(fb_base_url);
            var authData = auth_ref.getAuth();
            var num_uid = function () {
                var uid = authData.uid;
                var result = uid.split(":");
                return result[1];
            };

            if (authData) {
                var url = fb_base_url + '/user_data/' + num_uid() + "/";
                var ref = new Firebase(url);
                var sync = $firebase(ref);
                var items = sync.$asArray();

                // Promise for loaded data
                items.$loaded().then(
                    function () {
                        $scope.items = items;
                        $scope.load_status = "loaded";
                        $scope.ele_load_status = "show_on_loaded";
                    }
                );

                $scope.current_key = localStorageService.get('current_key');
                $scope.load_status = "loading";
                $scope.ele_load_status = "hide_on_loading";

                // Count calculations
                $scope.sessionCount = function () {
                    return items.length;
                };

                // Delete calculation
                $scope.deleteSession = function (id) {
                    var itemRef = new Firebase(url + "/" + id);
                    var onComplete = function (error) {
                        if (error) {
                            console.log('Sync failed');
                        } else {
                            $scope.deleteItemId = id;
                            $state.go('saved-calculations');
                        }
                    };
                    itemRef.remove(onComplete);
                };

                // Copy calculation
                $scope.copySession = function (id) {
                    var url = fb_base_url + '/user_data/' + num_uid() + "/" + id;
                    var ref = new Firebase(url);
                    var sync = $firebase(ref);
                    var items = sync.$asObject();

                    /* Promise for loaded data */
                    items.$loaded().then(
                        function () {
                            // Copy saved data
                            var copy_of_data = items.data,
                                copy_of_info = items.info,
                                copy_of_input = items.input;

                            // Update the timestamp and date
                            copy_of_info.date = {
                                timestamp: Math.round(new Date().getTime() / 1000),
                                date: new Date().toISOString()
                            };

                            // Add to items object the copied data
                            $scope.items.$add({
                                data: copy_of_data,
                                info: copy_of_info,
                                input: copy_of_input
                            });
                        }
                    );
                };

                /**
                 *  Use a particular saved calculation,
                 *  replaces data in local storage with this copied calculation
                 *
                 *  @param id
                 */
                $scope.useSession = function (id) {
                    $scope.id = id;
                    var modalInstance = $modal.open({
                        templateUrl: 'useSession.html',
                        controller: 'ModalConfirmUseCtrl',
                        size: 'sm',
                        resolve: {
                            id: function () {
                                return id;
                            }
                        }
                    });

                };
            } else { $state.go('auth'); }
        }])

    .controller('ModalConfirmUseCtrl',
    [
        '$scope',
        '$window',
        'localStorageService',
        '$state',
        'allData',
        'infoData',
        'inputData',
        '$modalInstance',
        'id',
        '$firebase',
        function ($scope, $window, localStorageService, $state, allData, infoData, inputData, $modalInstance, id, $firebase) {

        $scope.id = id;

        $scope.ok = function () {

            // Check logged in
            var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
            var auth_ref = new Firebase(fb_base_url);
            var authData = auth_ref.getAuth();
            var num_uid = function () {
                var uid = authData.uid;
                var result = uid.split(":");
                return result[1];
            };

            if (authData) {
                var url = fb_base_url + '/user_data/' + num_uid() + "/" + id;
                var ref = new Firebase(url);
                var sync = $firebase(ref);
                var item = sync.$asObject();

                /* Promise for loaded data */
                item.$loaded().then(
                    function () {
                        // Set the locally stored data
                        localStorageService.set('data', item.data);
                        localStorageService.set('info', item.info);
                        localStorageService.set('input', item.input);

                        // Update the factories
                        allData = item.data;
                        infoData = item.info;
                        inputData = item.input;

                        // Set localstorage
                        localStorageService.set('current_key', id);

                        // Set current_key
                        $scope.current_key = localStorageService.get('current_key');

                        // Set running session flag to true
                        infoData.running_session = true;

                        $window.location.reload();
                        $modalInstance.close();
                    }
                );
            } else { $state.go('auth'); }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }])

    .controller('SessionsDetailCtrl',
    [
        '$rootScope',
        '$scope',
        '$routeParams',
        '$firebase',
        '$firebaseAuth',
        'Authorisation',
        '$state',
        '$stateParams',
        'chartData',
        function ($rootScope, $scope, $routeParams, $firebase, $firebaseAuth, Authorisation, $state, $stateParams, chartData) {

            var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
            var auth_ref = new Firebase(fb_base_url);
            var authData = auth_ref.getAuth();
            var num_uid = function () {
                var uid = authData.uid;
                var result = uid.split(":");
                return result[1];
            };

            if (authData) {
                var url = fb_base_url + '/user_data/' + num_uid() + "/" + $stateParams.id;
                var ref = new Firebase(url);
                var sync = $firebase(ref);
                var item = sync.$asObject();

                /* Promise for loaded data */
                item.$loaded().then(
                    function () {
                        $scope.item = item;
                        // check data exists if not then use default
                        if ($scope.item.data) {
                            var data = $scope.item.data;
                        } else {
                            var data = chartData.chartObj;
                        }
                        $scope.currency = item.info.currency.symbol;
                        chartData.currency = $scope.currency;

                        // Calls the factories for each service
                        $scope.updateData = function () {
                            $scope.revenue_integrity = data.revenue_integrity;
                            $scope.revenue_integrity_process_improvement = data.revenue_integrity_process_improvement;
                            $scope.cmap = data.cmap;
                            $scope.origin_and_destination = data.origin_and_destination;
                            $scope.pos = data.pos;
                            $scope.arr = data.arr;
                            $scope.airfare_insight = data.airfare_insight;

                            if ($state.current.name === 'saved-calculations-detail.chart_low') {
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

                    }
                );

            } else { $state.go('auth'); }


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

    .controller('NewSessionCtrl',
    [
        '$scope',
        'localStorageService',
        'inputData',
        'infoData',
        'allData',
        '$state',
        '$timeout',
        '$window', function ($scope, localStorageService, inputData, infoData, allData, $state, $timeout, $window) {

        /**
         * Check for create new session broadcast
         */
        $scope.$on('createNewSession', function (event, msg) {
            $scope.createNewSession();
        });

        $scope.createNewSession = function () {

            if (runningSession()) {

                confirmOverwrite();
                $state.go('info');

                return true
            }

            $state.go('info');

            return false;
        };

        $scope.info.running_session = (localStorageService.get('current_key') !== null) ? true : false;

        var runningSession = function () {
            return $scope.info.running_session;
        };

        var confirmOverwrite = function () {
            return $scope.wipeData();
        };

        $scope.wipeData = function () {
            clearInfoData();
            clearLocalStorage();
            clearInputData();

            return true;
        };

        var clearInfoData = function () {
            // Broadcast clear data message to InfoCtrl
            $scope.$emit('clearInfoData', true);
        };

        var clearInputData = function () {
            // cant clear input data so do hard refresh
            $timeout(function () {
                // Urksome...
                $window.location.reload();
            }, 10);

        };

        var clearLocalStorage = function () {
            return localStorageService.clearAll();
        };


    }])

    .controller('SaveSessionCtrl',
    [
        '$scope',
        '$state',
        'localStorageService',
        '$firebase',
        '$timeout',
        'infoData',
        'inputData',
        'allData', function ($scope, $state, localStorageService, $firebase, $timeout, infoData, inputData, allData) {

        $scope.info.running_session = (localStorageService.get('current_key') !== null) ? true : false;
        $scope.saving = false;
        $scope.saved = false;

        var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
        var auth_ref = new Firebase(fb_base_url);
        var authData = auth_ref.getAuth();
        var num_uid = function () {
            var uid = authData.uid;
            var result = uid.split(":");
            return result[1];
        };
        if (!authData) { $state.go('auth'); }

        /**
         * Save session to Firebase
         */
        $scope.saveNewSession = function () {

            if (authData) {
                // Logged in, so get current user id and append to firebase address
                $scope.saving = true;
                var url = fb_base_url + "/user_data/" + num_uid() + "/";
                var ref = new Firebase(url);
                var sync = $firebase(ref);
                var items = sync.$asArray();

                // Add the data from localstorage and add it to Firebase
                items.$add({
                    info: localStorageService.get('info')
                }).then(function (reference) {
                    localStorageService.set('current_key', reference.name());
                    $scope.info.running_session = true;
                    $scope.saving = false;
                    $scope.saved = true;
                    $timeout(function () {
                        $scope.saved = false;
                    }, 2500);
                });
            } else { $state.go('auth'); }
        };

        /**
         * Updates the current calculation and uploads it to Firebase
         */
        $scope.updateSession = function () {
            if (authData) {
                // Logged in and currently running a calculation/session
                if ($scope.info.running_session === true) {
                    $scope.saving = true;
                    var url = fb_base_url + '/user_data/' + num_uid() + "/" + localStorageService.get('current_key');
                    var ref = new Firebase(url);
                    var sync = $firebase(ref);
                    var obj = sync.$asObject();

                    obj.$bindTo($scope, 'fb').then(function () {
                        $scope.fb.info = localStorageService.get('info');
                        $scope.fb.input = localStorageService.get('input');
                        $scope.fb.data = localStorageService.get('data');
                    }).then(function () {
                        $scope.saving = false;
                        $scope.saved = true;
                        $timeout(function () {
                            $scope.saved = false;
                        }, 2500);
                    });
                }
            } else { $state.go('auth'); }
        };

    }])

    .controller('CalcCtrl',
    [
        '$rootScope',
        '$scope',
        '$location',
        'localStorageService',
        '$state',
        'chartData',
        'chartConfig',
        'infoData',
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
        'ancillarySales',
        '$firebase',
        '$interval',
        function ($rootScope, $scope, $location, localStorageService, $state, chartData, chartConfig, infoData, inputData, allData, revenueIntegrity, revenueIntegrityProcessImprovement, cmap, originAndDestination, pointOfSale, passengersBoardedData, arr, airfareInsight, channelShift, ancillarySales, $firebase, $interval) {
            // Bind to Firebase
            var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
            var auth_ref = new Firebase(fb_base_url);
            var authData = auth_ref.getAuth();

            var num_uid = function () {
                var uid = authData.uid;
                var result = uid.split(":");
                return result[1];
            };

            var syncToFirebase = function () {
                if (authData) {
                    // Logged in and running a calculation/session
                    if ($scope.info.running_session === true) {
                        $scope.saving = true;
                        var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
                        var url = fb_base_url + "/user_data/" + num_uid() + "/" + localStorageService.get('current_key');
                        var ref = new Firebase(url);
                        var obj = $firebase(ref);
                        obj.$set({
                            info: localStorageService.get('info'),
                            input: localStorageService.get('input'),
                            data: localStorageService.get('data')
                        });
                    }
                } else {
                    $state.go('auth');
                }
            };
            syncToFirebase();

            /**
             * Calls the factories for each service
             */
            $scope.updateData = function () {

                revenueIntegrity.initObject();
                $scope.revenue_integrity = allData.revenue_integrity;

                revenueIntegrityProcessImprovement.initObject();
                $scope.revenue_integrity_process_improvement = allData.revenue_integrity_process_improvement;

                channelShift.initObject();
                $scope.channel_shift = allData.channel_shift;

                ancillarySales.initObject();
                $scope.ancillary_sales = allData.ancillary_sales;

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

                localStorageService.set('data', allData);
                localStorageService.set('input', inputData);

                $scope.input = inputData;

                syncToFirebase();

                // TODO-mike separate values for both graph types
                // chart configs are not storing separate values for both graphs.
                // Need to find out why and stop from using this sort of if/else as makes it fragile.
                if ($state.current.name === 'calculator.chart_low') {
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
             * Saves the state of the open results view, Charts or table,
             * when loaded. Uses state and state change success event ($stateChangeSuccess).
             */
            $scope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    // Store state of view in localstorage
                    localStorageService.set('results_view', toState);
                    $scope.resultsView = toState.name;
                    // update chart
                    $scope.updateData();
                });


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
                    // put save here
                }, true);

            // Add currency to calculation
            $scope.currency = infoData.currency.symbol;
            chartData.currency = $scope.currency;

        }])

    .controller('AuthCtrl', ['$rootScope', '$scope', '$state', '$firebase', 'Authorisation',
        function ($rootScope, $scope, $state, $firebase, Authorisation) {

            var fb_base_url = "https://luminous-fire-1327.firebaseio.com";
            var ref = new Firebase(fb_base_url);
            var authData = ref.getAuth();

            if (authData) {
                $scope.$emit('isLoggedInMessage', true);
                $scope.user = authData.password;
                $scope.logged_in = true;
            } else {
                $scope.$emit('isLoggedInMessage', false);
                $scope.logged_in = false;
            }

            $scope.loginUser = function () {
                $scope.show_loader = true;
                ref.authWithPassword({
                    email: $scope.auth.email,
                    password: $scope.auth.password
                }, function (error, authData) {
                    if (error) {
                        $scope.show_loader = false;
                        $scope.message = "Login failed";
                        // Get error codes and print relevent message
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
                    } else {
                        $scope.show_loader = false;
                        $scope.logged_in = true;
                        $scope.$emit('isLoggedInMessage', true);
                        $state.go('info');
                    }
                });
            };

            $scope.logoutUser = function () {
                $scope.logged_in = false;
                $scope.$emit('isLoggedInMessage', false);
                $scope.$emit('clearInfoData', true);
                $scope.message = "";
                ref.unauth();
            };

            // For forgotten password
            $scope.retrievePassword = function () {
                $scope.show_loader = true;
                var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/");
                ref.resetPassword({
                    email: $scope.auth.email
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_USER":
                                $scope.reason = "The specified user account does not exist.";
                                break;
                            default:
                                $scope.reason = "Error resetting password" + error;
                        }
                    } else {
                        $scope.show_loader = false;
                        $scope.message = true;
                        $scope.reason = "Password reset email sent successfully!";
                    }
                });
            };

            $scope.changePassword = function () {
                $scope.show_loader = true;
                var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/");
                ref.changePassword({
                    email: $scope.auth.email,
                    oldPassword: $scope.auth.old_password,
                    newPassword: $scope.auth.new_password
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_PASSWORD":
                                $scope.reason = "The specified user account password is incorrect.";
                                break;
                            case "INVALID_USER":
                                $scope.reason = "The specified user account does not exist.";
                                break;
                            default:
                                $scope.reason = "Error changing password:" + error;
                        }
                    } else {
                        $scope.show_loader = false;
                        $scope.message = true;
                        $scope.reason = "User password changed successfully!";
                    }
                });
            };
        }
    ]);
