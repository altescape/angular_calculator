'use strict';

/* Services */
angular.module('myApp.services', [])

    .factory('infoData', function (localStorageService) {
        /**
         *  Information object that holds user and session objects.
         *  These objects hold meta data about the user and session such
         *  as name, airline name, etc.
         */
        return localStorageService.get('info') ? localStorageService.get('info') : {}
    })

    .factory('inputData', function (localStorageService) {
        /**
         * Default values for inputs.
         * If it's a new session then these are the default values
         * that are entered into the input fields.
         */
        if (!localStorageService.get('input')) {
            return {
                services: {
                    op1: null,
                    op2: null,
                    op3: null,
                    op4: null,
                    op5: null,
                    op6: null,
                    op7: null,
                    op8: null,
                    op9: null
                },

                param1: 0,
                param2: 0,
                param3: 0,
                param4: 0,
                param5: 0,
                param6: 0,
                param7: 0,
                param8: 0,
                param9: 0,
                param10: 0,
                adjustment: 0
            }
        }

        return localStorageService.get('input');
    })

    .factory('chartConfig', function (infoData) {
        /**
         * Draws a chart with highcharts-ng options.
         *
         * setValue(val) function sets the value to be 'low' or 'high'
         * chartConfigPie object holds all the options for the highchart.
         * Note: that this object is not exactly like the highchart options object,
         * it is an highcharts-ng object!
         *
         * See https://github.com/pablojim/highcharts-ng for clarification.
         *
         * Note: The the service names (categories) are hard coded in here.
         */

        Highcharts.setOptions({
            colors: [
                '#E0586A',
                '#E05AAD',
                '#576CDF',
                '#5AAFE0',
                '#5DE08C',
                '#6DE05E',
                '#AFE05F',
                '#E1CE5F',
                '#E0895B'
            ]
        });

        var chartConfigTemplate = {
            currency: {
                currency: 'USD',
                symbol: '$'
            },
            options: {
                chart: {
                    type: 'pie',
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    plotBackgroundColor: 'rgba(255, 255, 255, 0)'
                },
                plotOptions: {
                    series: {
                        animation: true
                    },
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                if (this.y != 0) {
                                    return '<b>' + this.point.name + '</b>: ' + chartConfigTemplate.currency.symbol + this.point.y;
                                } else {
                                    return null;
                                }
                            },
                            style: {
                                fontFamily: 'Helvetica, Arial'
                            }
                        },
                        center: ['50%', '50%']
                    }
                },
                tooltip: {
                    enabled: true,
                    formatter: function () {
                        if (this.y != 0) {
                            return '<b>' + this.point.name + '</b>: ' + chartConfigTemplate.currency.symbol + this.point.y;
                        } else {
                            return null;
                        }
                    }
                }
            },
            title: {
                text: 0
            },
            credits: {
                enabled: false
            },
            series: [
                // Value
                {
                    name: 'High',
                    data: [],
                    innerSize: '30%',
                    dataLabels: {
                        style: {
                            fontWeight: 'bold'
                        }
                    },
                    point: {
                        events: {
                            legendItemClick: function () {
                                return false; // <== returning false will cancel the default action
                            }
                        }
                    }
                },
                // Total
                {
                    name: 'Total',
                    data: [0],
                    size: '15%',
                    dataLabels: {
                        formatter: function () {
                            return this.y > 0 ? chartConfigTemplate.currency.symbol + this.point.y : null;
                        },
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '18px',
                            textShadow: '0px 1px 2px black'
                        },
                        distance: -40
                    },
                    allowPointSelect: false,
                    enableMouseTracking: false,
                    borderWidth: 0,
                    colors: ['#006EAC']
                }
            ],
            yAxis: {
                min: 0,
                labels: {
                    overflow: 'justify'
                }
            }
        }

        var chartConfigHigh = chartConfigTemplate;
        var chartConfigLow = chartConfigTemplate;
        var chartConfigBar = chartConfigTemplate;

        return {
            high: chartConfigHigh,
            low: chartConfigLow,
            bar: chartConfigBar
        }

    })

    .factory('chartData', function (localStorageService, chartConfig, allData) {
        /**
         * Summary object where default values for service options are stored.
         * Creates an object and saves to localstorage with key called 'ls.summary'.
         * The values are then added to this object when services are chosen.
         *
         * Note: There are places where summary is used - will clarify where these are.
         *
         * Format for data should be this:
         *
         data: [
         ['Revenue Integrity', 45],
         ['Revenue Integrity Process Improvement', 26],
         ['Channel Shift', 8],
         ['Ancillary Sales', 6],
         ['CMAP', 2]
         ]
         */

        return {

            chartObj: allData,

            /**
             * Transpose data between locally stored or firebase
             *
             * @var:dataLocation = 'local' or 'firebase'
             * @var:dataSource = object from local storage or firebase.
             */
            dataSource: function (src) {
                return src;
            },

            /**
             * Chart data, pulled from localstorage (through dataSource())
             * and converted into an array that ng-highcharts can understand.
             * Returns high or low values which can be inserted into config object for ng-highcharts.
             *
             * @param va
             * @param src
             * @returns {Array}
             */
            chartData: function (va, src) {
                var chartArrayHigh = [], chartArrayLow = [];
                angular.forEach(this.dataSource(src), function (value, key) {

                    // the following is a hackey way of checking for shortname
                    var name;
                    if (value.short_name) {
                        name = value.short_name;
                    } else {
                        name = value.name;
                    }
                    // end of hackey way

                    chartArrayHigh.push([name, value.high]);
                    chartArrayLow.push([name, value.low]);
                });
                if (va === 'high') {
                    return chartArrayHigh;
                } else {
                    return chartArrayLow;
                }
            },

            /**
             * Chart total, pulled from localstorage (through dataSource())
             * and converted into an array that ng-highcharts can understand.
             * Returns high or low totals which can be inserted into config object for ng-highcharts.
             *
             * @param va
             * @param src
             * @returns {Array}
             */
            chartTotal: function (va, src) {
                var chartTotalHigh = [],
                    chartTotalLow = [],
                    totalHigh = 0,
                    totalLow = 0;
                angular.forEach(this.dataSource(src), function (value, key) {
                    chartTotalHigh.push(value.high);
                    chartTotalLow.push(value.low);
                });

                angular.forEach(chartTotalHigh, function (value, key) {
                    totalHigh += value;
                });

                angular.forEach(chartTotalLow, function (value, key) {
                    totalLow += value;
                });

                if (va === 'high') {
                    return [totalHigh];
                } else {
                    return [totalLow];
                }
            },

            currency: '$',

            /**
             * Sets the data for use in the high value chart and the low value chart.
             * Returns config object for ng-highcharts.
             *
             * src is the injected data object
             *
             * @param value
             * @param src
             * @returns {*}
             */
            drawChart: function (value, src) {

                chartConfig.low.currency.symbol = this.currency;
                chartConfig.high.currency.symbol = this.currency;

                if (value === 'low') {
                    chartConfig.low.options.chart.type = "pie";
                    chartConfig.low.series[0].data = this.chartData('low', src);
                    chartConfig.low.series[1].data = this.chartTotal('low', src);
                    return chartConfig.low;
                } else {
                    chartConfig.high.options.chart.type = "pie";
                    chartConfig.high.series[0].data = this.chartData('high', src);
                    chartConfig.high.series[1].data = this.chartTotal('high', src);
                    return chartConfig.high;
                }
            }
        };
    })

    .factory('Authorise', ['$rootScope', '$firebaseAuth', '$state', function($rootScope, $firebaseAuth, $state) {

        var FB_BASE_URL = "https://luminous-fire-1327.firebaseio.com";
        var ref = new Firebase(FB_BASE_URL);
        var authObj = $firebaseAuth(ref);
        var authData = authObj.$getAuth();

        // This splits the defualt uid response from Firebase
        // into a number - which is what it was originally. On the update
        // they introduced more auth services so changed uid of '1' to
        // 'simplelogin:1'.
        // This function returns '1' or false.
        var num_uid = function () {
            var user = authObj.$getAuth();
            if (user) {
                var uid = user.uid;
                var result = uid.split(":");
                return result[1];
            }
            return false;
        };

        var check_login_status = function () {
            var logged_in_user = authObj.$getAuth();
            if (logged_in_user) {
                $rootScope.$broadcast('isLoggedInMessage', true);
                $rootScope.$broadcast('isAuthorised', {status: true, msg: logged_in_user.password.email});
            } else {
                $rootScope.$broadcast('isAuthorised', {status: false, msg: "Logged out"});
                $state.go('auth');
            }
        };

        var login = function (email, password) {
            authObj.$authWithPassword({
                email: email,
                password: password
            })
                .then(function(result) {
                    $rootScope.$broadcast('authEvent', { status: true, msg: result });
                    $rootScope.$broadcast('isLoggedInMessage', true);
                    $state.go('info');
                })
                .catch(function(error) {
                    $rootScope.$broadcast('authEvent', { status: false, msg: error.toString() });
                    $rootScope.$broadcast('isLoggedInMessage', false);
                })
        };

        var logout = function () {
            authObj.$unauth();
            $rootScope.$broadcast('isLoggedInMessage', false);
            $rootScope.$broadcast('clearInfoData', true);
        };

        // Forgotten password
        var retrieve_password = function (email) {
            authObj.$resetPassword({
                email: email
            })
                .then(function () {
                    $rootScope.$broadcast('passwordUtil', {
                        status: true,
                        msg: "Check your inbox for your new temporary password. You can then <a ui-sref=\"change-password\" href=\"/#/change-password\"><strong>change your password here</strong></a> to something more memorable."
                    });
                })
                .catch(function (error) {
                    $rootScope.$broadcast('passwordUtil', { status: false, msg: error.toString()});
                })
        };

        // Change password
        var change_password = function (email, old_password, new_password) {
            authObj.$changePassword({
                email: email,
                oldPassword: old_password,
                newPassword: new_password
            })
                .then(function () {
                    $rootScope.$broadcast('passwordUtil', {
                        status: true,
                        msg: "Your password has been changed. <a ui-sref=\"auth\" href=\"/#/auth\"><strong>Sign in here</strong></a>."
                    });
                })
                .catch(function (error) {
                    $rootScope.$broadcast('passwordUtil', { status: false, msg: error.toString()});
                })
        };

        return {
            fb_base_url: FB_BASE_URL,
            ref: ref,
            authObj: authObj,
            authData: authData,
            num_uid: num_uid,
            check_login_status: check_login_status,
            login: login,
            logout: logout,
            retrieve_password: retrieve_password,
            change_password: change_password
        }
    }])

    .factory('passengersBoardedData', function () {

        var cost_per_pb = {
            core_passenger_services_cost_per_pb: { // [variables] C4/D4
                name: "Core passenger services cost per PB (Res, ticketing, fares, DCS)",
                cost_per_pb: {
                    current_provider: 1.2,
                    sita: 0.8
                }
            },
            direct_dist_costs_per_pb: { // [variables] E5~
                name: "Direct distribution costs per PB",
                current_channel_mix_total: 0,
                channel_shift_over_5_yrs_total: 0,
                steady_state_channel_mix_total: 0,
                call_centre: { // [variables] C6/D6
                    name: "Call centre",
                    cost_per_pb: {
                        current_provider: 1.21,
                        sita: 1.21
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 10,
                            channel_shift_over_5_yrs: 0
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                ecommerce: { // [variables] C7/D7
                    name: "Ecommerce",
                    cost_per_pb: {
                        current_provider: 1,
                        sita: 1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 7,
                            channel_shift_over_5_yrs: 6
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                travel_agent: { // [variables] C8/D8
                    name: "Travel agent/OTA/Corporate direct (split GUI/API)",
                    cost_per_pb: {
                        current_provider: 1,
                        sita: 1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 0,
                            channel_shift_over_5_yrs: 0
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                mobile: { // [variables] C9/D9
                    name: "Mobile",
                    cost_per_pb: {
                        current_provider: 1,
                        sita: 1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 0,
                            channel_shift_over_5_yrs: 2
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                }
            },
            indirect_dist_costs_per_pb: { // [variables] C12/D12
                name: "Indirect disribution costs per PB",
                current_channel_mix_total: 0,
                channel_shift_over_5_yrs_total: 0,
                steady_state_channel_mix_total: 0,
                amadeus: { // [variables] C13/D13
                    name: "Amadeus",
                    cost_per_pb: {
                        current_provider: 5.1,
                        sita: 5.1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 53,
                            channel_shift_over_5_yrs: -2
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                sabre: { // [variables] C14/D14
                    name: "sabre",
                    cost_per_pb: {
                        current_provider: 5.1,
                        sita: 5.1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 15,
                            channel_shift_over_5_yrs: -1
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                galileo: { // [variables] C15/D15
                    name: "Galileo",
                    cost_per_pb: {
                        current_provider: 5.1,
                        sita: 5.1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 15,
                            channel_shift_over_5_yrs: -5
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                },
                abacus: { // [variables] C16/D16
                    name: "Abacus",
                    cost_per_pb: {
                        current_provider: 5.1,
                        sita: 5.1
                    },
                    channel: (function () {
                        var n = {
                            current_channel_mix: 0,
                            channel_shift_over_5_yrs: 0
                        };
                        return {
                            current_channel_mix: n.current_channel_mix,
                            channel_shift_over_5_yrs: n.channel_shift_over_5_yrs,
                            steady_state_channel_mix: n.current_channel_mix + n.channel_shift_over_5_yrs
                        }
                    })()
                }
            }
        };

        // Direct distribution costs per PB. [Variables]:B6-B9

        /**
         * Get totals for current channel mix, channel shift over 5 years, and steady state channel mix,
         * from the direct distribution costs per PB.
         *
         * @param column
         * @returns {*} (results are percentages)
         */
        var directDistChannelTotals = function channelTotals(column) {
            var c = cost_per_pb.direct_dist_costs_per_pb;
            return c.call_centre.channel[column] +
                c.ecommerce.channel[column] +
                c.travel_agent.channel[column] +
                c.mobile.channel[column];
        };
        cost_per_pb.direct_dist_costs_per_pb.current_channel_mix_total = directDistChannelTotals('current_channel_mix');
        cost_per_pb.direct_dist_costs_per_pb.channel_shift_over_5_yrs_total = directDistChannelTotals('channel_shift_over_5_yrs');
        cost_per_pb.direct_dist_costs_per_pb.steady_state_channel_mix_total = directDistChannelTotals('steady_state_channel_mix');

        // Indirect disribution costs per PB [Variables]:B13-B16

        /**
         * Get totals for current channel mix, channel shift over 5 years, and steady state channel mix,
         * from the indirect distribution costs per PB.
         *
         * @param column
         * @returns {*} (results are percentages)
         */
        var indirectDistChannelTotals = function channelTotals(column) {
            var c = cost_per_pb.indirect_dist_costs_per_pb;
            return c.amadeus.channel[column] + c.sabre.channel[column] + c.galileo.channel[column] + c.abacus.channel[column];
        };
        cost_per_pb.indirect_dist_costs_per_pb.current_channel_mix_total = indirectDistChannelTotals('current_channel_mix');
        cost_per_pb.indirect_dist_costs_per_pb.channel_shift_over_5_yrs_total = indirectDistChannelTotals('channel_shift_over_5_yrs');
        cost_per_pb.indirect_dist_costs_per_pb.steady_state_channel_mix_total = indirectDistChannelTotals('steady_state_channel_mix');

        // Probably not needed but worth keeping in case
        var overall_current_channel_mix_total = directDistChannelTotals('current_channel_mix') + indirectDistChannelTotals('current_channel_mix');
        var overall_channel_shift_total = directDistChannelTotals('channel_shift_over_5_yrs') + indirectDistChannelTotals('channel_shift_over_5_yrs');
        var overall_steady_state_channel_mix_total = directDistChannelTotals('steady_state_channel_mix') + indirectDistChannelTotals('steady_state_channel_mix');

        return cost_per_pb;

    })

    .factory('allData', function () {
        return {
            airfare_insight: {
                name: "Airfare Insight",
                short_name: "AI",
                high: 0,
                low: 0,
                summary: {}
            },
            ancillary_sales: {
                name: "Ancillary Sales",
                short_name: "AS",
                high: 0,
                low: 0,
                summary: {}
            },
            arr: {
                name: "ARR",
                short_name: "ARR",
                high: 0,
                low: 0,
                summary: {}
            },
            channel_shift: {
                name: "Channel Shift",
                short_name: "CS",
                high: 0,
                low: 0,
                summary: {}
            },
            cmap: {
                name: "Weight and Balance",
                short_name: "W&B",
                high: 0,
                low: 0,
                summary: {}
            },
            origin_and_destination: {
                name: "Origin and Destination",
                short_name: "O&D",
                high: 0,
                low: 0,
                summary: {}
            },
            pos: {
                name: "Point of Sale",
                short_name: "POS",
                high: 0,
                low: 0,
                summary: {}
            },
            revenue_integrity: {
                name: "Revenue Integrity",
                short_name: "RI",
                high: 0,
                low: 0,
                summary: {}
            },
            revenue_integrity_process_improvement: {
                name: "Revenue Integrity Process Improvement",
                short_name: "RIPI",
                high: 0,
                low: 0,
                summary: {}
            }
        }
    })

    .factory('revenueIntegrity', function (inputData, allData) {
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            REVENUE_IMPROVEMENT_HIGH: 1,	// [Revenue Integrity]:C6
            REVENUE_IMPROVEMENT_LOW: 0.1,	// [Revenue Integrity]:D6
            COST_SAVING_HIGH: 5,	// [Revenue Integrity]:C8
            COST_SAVING_LOW: 3,	// [Revenue Integrity]:D8
            REAL_TIME_HIGH: 2, // [Revenue Integrity]:C10
            REAL_TIME_LOW: 1,	// [Revenue Integrity]:D10

            revenue: function () {
                return inputData.param6;
            },

            distribution_costs: function () { // [Revenue Integrity] C4/D4
                return inputData.param7 * (inputData.param8 / 100);
            },

            revenue_improvement: function (value) { // [Revenue Integrity] C6/D6
                if (value === 'low') return this.REVENUE_IMPROVEMENT_LOW / 100;
                return this.REVENUE_IMPROVEMENT_HIGH / 100;
            },

            value_1: function (value) { // [Revenue Integrity] C7/D7
                return this.revenue_improvement(value) * this.revenue()
            },

            cost_saving: function (value) { // [Revenue Integrity] C8/D8
                if (value === 'low') return this.COST_SAVING_LOW / 100;
                return this.COST_SAVING_HIGH / 100;
            },

            value_2: function (value) { // [Revenue Integrity] C9/D9
                return this.cost_saving(value) * this.distribution_costs();
            },

            real_time: function (value) { // [Revenue Integrity] C10/D10
                if (value === 'low') return this.REAL_TIME_LOW / 100;
                return this.REAL_TIME_HIGH / 100;
            },

            wtf_1: function (value) { // [Revenue Integrity] C11/D11
                return this.real_time(value) * this.revenue();
            },

            total: function (value) { // [Revenue Integrity] C12/D12
                return this.wtf_1(value) + this.value_2(value) + this.value_1(value);
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op1) {
                    allData.revenue_integrity.high = 0;
                    allData.revenue_integrity.low = 0;
                    return;
                }
                allData.revenue_integrity.high = this.result();
                allData.revenue_integrity.low = this.result('low');

                allData.revenue_integrity.summary = {
                    revenue: {
                        name: "Revenue",
                        unit: "currency",
                        high: this.revenue(),
                        low: this.revenue()
                    },
                    dist_costs: {
                        name: "Distribution costs",
                        unit: "currency",
                        high: this.distribution_costs().toFixed(2),
                        low: this.distribution_costs().toFixed(2)
                    },
                    revenue_improvement: {
                        name: "Revenue improvement",
                        unit: "percentage",
                        high: this.REVENUE_IMPROVEMENT_HIGH,
                        low: this.REVENUE_IMPROVEMENT_LOW
                    },
                    value_1: {
                        name: "Value 1",
                        unit: "currency",
                        high: this.value_1('high').toFixed(2),
                        low: this.value_1('low').toFixed(2)
                    },
                    cost_saving: {
                        name: "Cost saving",
                        unit: "percentage",
                        high: this.COST_SAVING_HIGH,
                        low: this.COST_SAVING_LOW
                    },
                    value_2: {
                        name: "Value 2",
                        unit: "currency",
                        high: this.value_2('high').toFixed(2),
                        low: this.value_2('low').toFixed(2)
                    },
                    real_time: {
                        name: "Real-time",
                        unit: "percentage",
                        high: this.REAL_TIME_HIGH,
                        low: this.REAL_TIME_LOW
                    },
                    wtf_1: {
                        name: "*",
                        unit: "currency",
                        high: this.wtf_1('high').toFixed(2),
                        low: this.wtf_1('low').toFixed(2)
                    },
                    total: {
                        name: "Total",
                        unit: "currency",
                        high: this.total('high').toFixed(2),
                        low: this.total('low').toFixed(2)
                    }
                }
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(( (this.real_time(value) * inputData.param6) + (this.cost_saving(value) * (inputData.param7 * inputData.param8 / 100)) + (this.revenue_improvement(value) * inputData.param6) ) / inputData.adjustment);
            }
        }
    })

    .factory('revenueIntegrityProcessImprovement', function (inputData, allData) {
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             * PB is passengers boarded
             */
            current_PB_LIVE_IN_SYSTEM: 3.6 / 100,	// [Revenue Integrity]:C17
            MISC_CONST_1: 1.8,	// [Revenue Integrity]:C20
            MISC_CONST_2: 1.6,	// [Revenue Integrity]:C21
            CANCEL_1: 0.0034 / 100,	// [Revenue Integrity]:G30
            QUEUE: 2.4916 / 100,	// [Revenue Integrity]:G31
            APPLY_TTL: 23.0518 / 100,	// [Revenue Integrity]:G32
            CANCEL_2: 2.3052 / 100,	// [Revenue Integrity]:G33
            CANCEL_3: 0.1330 / 100,	// [Revenue Integrity]:G34
            CANCEL_4: 1.0752 / 100,	// [Revenue Integrity]:G35
            CANCEL_5: 0.0012 / 100,	// [Revenue Integrity]:G36
            CANCEL_6: 5.4547 / 100,	// [Revenue Integrity]:G37
            CANCEL_7: 0.6698 / 100,	// [Revenue Integrity]:G38
            MISC_CONST_3: 10 / 100,	// [Revenue Integrity]:C40
            MISC_CONST_4: (10 / 100) / 2,	// [Revenue Integrity]:D40
            MISC_CONST_5: 12,	// [Revenue Integrity]:C44
            MISC_CONST_6: 3 / 100,	// [Revenue Integrity]:C46
            MISC_CONST_7: 0.2,	// [Revenue Integrity]:C51
            MISC_CONST_8: 0.1,	// [Revenue Integrity]:D51
            MISC_CONST_9: 450,	// [Revenue Integrity]:C48
            MISC_CONST_10: 2,	// [Revenue Integrity]:C56

            pnrs: function () {	// REF 1 | [Revenue Integrity]:C19/D19
                return Math.round(inputData.param1 * this.current_PB_LIVE_IN_SYSTEM)
            },
            segments: function () {  // REF 2 | [Revenue Integrity]:C20/D20
                return this.pnrs() * this.MISC_CONST_1;
            },
            passengers: function () {	// REF 3 | [Revenue Integrity]:C21/D21
                return this.pnrs() * this.MISC_CONST_2;
            },
            av_psj_per_pnr: function () {	// REF 4 | [Revenue Integrity]:C22/D22
                return parseFloat(this.segments() / this.pnrs() * this.passengers() / this.pnrs()).toFixed(2);
            },
            psj: function () {	// REF 5 | [Revenue Integrity]:C23/D23
                return Math.round(this.av_psj_per_pnr() * this.pnrs());
            },
            total_checks: function (value) {	// REF 6 | [Revenue Integrity]:C39/D39
                var g30 = this.psj(value) * this.CANCEL_1,
                    g31 = this.psj(value) * this.QUEUE,
                    g32 = this.psj(value) * this.APPLY_TTL,
                    g33 = this.psj(value) * this.CANCEL_2,
                    g34 = this.psj(value) * this.CANCEL_3,
                    g35 = this.psj(value) * this.CANCEL_4,
                    g36 = this.psj(value) * this.CANCEL_5,
                    g37 = this.psj(value) * this.CANCEL_6,
                    g38 = this.psj(value) * this.CANCEL_7;

                if (value === 'low') {
                    g30 = g30 / 2;
                    g31 = g31 / 2;
                    g32 = g32 / 2;
                    g33 = g33 / 2;
                    g34 = g34 / 2;
                    g35 = g35 / 2;
                }

                return Math.round(g30 + g31 + g32 + g33 + g34 + g35 + g36 + g37 + g38);
            },
            seats_resold: function (value) {	// REF 7 | [Revenue Integrity]:C41/D41
                if (value === 'low') return Math.round(this.MISC_CONST_4 * this.total_checks(value));
                return Math.round(this.MISC_CONST_3 * this.total_checks(value));
            },
            additional_revenue: function (value) {	// REF 8 | [Revenue Integrity]:C43/D43
                return Math.round(inputData.param9 * this.seats_resold(value));
            },
            annual_additional_revenue: function (value) {	// REF 9 | [Revenue Integrity]:C44/D44
                return this.additional_revenue(value) * this.MISC_CONST_5;
            },
            no_show_per_annum: function () {	// REF 10 | [Revenue Integrity]:C47/D47
                return Math.round(this.MISC_CONST_6 * inputData.param1);
            },
            no_shows_avoided: function (value) {	// REF 11 | [Revenue Integrity]:C52/D52
                if (value === 'low') return this.no_show_per_annum() * this.MISC_CONST_8;
                return this.no_show_per_annum() * this.MISC_CONST_7;
            },
            gds_cost_reduction: function (value) {	// REF 12 | [Revenue Integrity]:C53/D53
                return this.MISC_CONST_9 * this.no_shows_avoided(value);
            },
            process_improvement: function (value) {	// REF 13 | [Revenue Integrity]:C56/D56
                return Math.round(this.annual_additional_revenue(value) + this.gds_cost_reduction(value) / this.MISC_CONST_10);
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op2) {
                    allData.revenue_integrity_process_improvement.high = 0;
                    allData.revenue_integrity_process_improvement.low = 0;
                    allData.revenue_integrity_process_improvement.summary = {};
                    return;
                }
                allData.revenue_integrity_process_improvement.high = this.result();
                allData.revenue_integrity_process_improvement.low = this.result('low');

                allData.revenue_integrity_process_improvement.summary = {
                    pnrs: {
                        name: "PNRS",
                        high: this.pnrs(),
                        low: this.pnrs()
                    },
                    segments: {
                        name: "Segments",
                        high: this.segments(),
                        low: this.segments()
                    },
                    passengers: {
                        name: "Passengers",
                        high: this.passengers(),
                        low: this.passengers()
                    },
                    av_psj_per_pnr: {
                        name: "Average PSJ per PNR",
                        high: this.av_psj_per_pnr(),
                        low: this.av_psj_per_pnr()
                    },
                    psj: {
                        name: "PSJ",
                        high: this.psj(),
                        low: this.psj()
                    },
                    total_checks: {
                        name: "Total",
                        high: this.total_checks(),
                        low: this.total_checks('low')
                    },
                    seats_resold: {
                        name: "Seats resold",
                        high: this.seats_resold(),
                        low: this.seats_resold('low')
                    },
                    additional_revenue: {
                        name: "Additional revenue",
                        high: this.additional_revenue(),
                        low: this.additional_revenue('low')
                    },
                    annual_additional_revenue: {
                        name: "Annual additional revenue",
                        high: this.annual_additional_revenue(),
                        low: this.annual_additional_revenue('low')
                    },
                    no_show_per_annum: {
                        name: "No show per annum",
                        high: this.no_show_per_annum(),
                        low: this.no_show_per_annum('low')
                    },
                    no_shows_avoided: {
                        name: "No shows avoided",
                        high: this.no_shows_avoided(),
                        low: this.no_shows_avoided('low')
                    },
                    gds_cost_reduction: {
                        name: "GDS cost reduction",
                        high: this.gds_cost_reduction(),
                        low: this.gds_cost_reduction('low')
                    },
                    process_improvement: {
                        name: "Process improvement",
                        high: this.process_improvement(),
                        low: this.process_improvement('low')
                    }
                };
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.process_improvement(value) / inputData.adjustment);
            }
        }
    })

    .factory('cmap', function (inputData, allData) { // services: option 5
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            MISC_CONST_1: 0.5 / 100,
            MISC_CONST_2: 0.25 / 100,
            MISC_CONST_3: 1 / 100,
            MISC_CONST_4: 0.5 / 100,

            fuel_cost: function () {  // REF 14 | [Weight and Balance]:C3
                return Math.round((inputData.param10 / 100) * inputData.param7);
            },

            cmap_savings: function (value) {  // REF 15 | [Weight and Balance]:C5/D5
                if (value === 'low') return this.fuel_cost() * this.MISC_CONST_2;
                return this.fuel_cost() * this.MISC_CONST_1;
            },

            portable_water: function (value) {  // REF 16 | [Weight and Balance]:C6/D6
                if (value === 'low') return this.fuel_cost() * this.MISC_CONST_4;
                return this.fuel_cost() * this.MISC_CONST_3;
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op5) {
                    allData.cmap.high = 0;
                    allData.cmap.low = 0;
                    allData.cmap.summary = {};
                    return;
                }
                allData.cmap.high = this.result();
                allData.cmap.low = this.result('low');

                allData.cmap.fuel_cost = {
                    name: "Fuel cost",
                    value: this.fuel_cost()
                };

                allData.cmap.summary = {
                    cmap_savings: {
                        name: "CMAP savings",
                        high: this.cmap_savings(),
                        low: this.cmap_savings('low')
                    },
                    portable_water: {
                        name: "Portable water",
                        high: this.portable_water(),
                        low: this.portable_water('low')
                    }
                }
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.cmap_savings(value) / inputData.adjustment);
            }

        }
    })

    .factory('originAndDestination', function (inputData, allData) { // services: option 6
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            MISC_CONST_1: 2 / 100,
            MISC_CONST_2: 1 / 100,

            revenue: function () { // REF 18 | [O&D] C3
                return inputData.param6;
            },

            os_impact: function (value) { // REF 19 | [O&D] C5/D5
                if (value === 'low') return this.revenue() * this.MISC_CONST_2;
                return this.revenue() * this.MISC_CONST_1;
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op6) {
                    allData.origin_and_destination.high = 0;
                    allData.origin_and_destination.low = 0;
                    allData.origin_and_destination.summary = {};
                    return;
                }
                allData.origin_and_destination.high = this.result('high');
                allData.origin_and_destination.low = this.result('low');

                allData.origin_and_destination.revenue = this.revenue();

                allData.origin_and_destination.summary = {
                    os_impact: {
                        name: "O&S Impact",
                        high: this.os_impact('high'),
                        low: this.os_impact('low')
                    }
                };

            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.os_impact(value) / inputData.adjustment);
            }
        }
    })

    .factory('pointOfSale', function (inputData, allData) { // services: option 7
        return {
            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            MISC_CONST_1: 0.5 / 100,
            MISC_CONST_2: 0.25 / 100,

            /* Calculation functions */
            revenue: function () { // REF 21 | [POS] C3
                return inputData.param6;
            },

            os_impact: function (value) { // REF 22 | [POS] C5/D5
                if (value === 'low') return this.revenue() * this.MISC_CONST_2;
                return this.revenue() * this.MISC_CONST_1;
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op7) {
                    allData.pos.high = 0;
                    allData.pos.low = 0;
                    allData.pos.summary = {};
                    return;
                }
                allData.pos.high = this.result('high');
                allData.pos.low = this.result('low');

                allData.pos.revenue = this.revenue();

                allData.pos.summary = {
                    os_impact: {
                        name: "O&S Impact",
                        high: this.os_impact('high'),
                        low: this.os_impact('low')
                    }
                };
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.os_impact(value) / inputData.adjustment);
            }
        }
    })

    .factory('arr', function (inputData, allData, passengersBoardedData) { // services option 9
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            TIME_TO_MANUALLY_REISSUE_TICKET_HIGH: 30,
            TIME_TO_MANUALLY_REISSUE_TICKET_LOW: 20,
            MISC_PERCENTAGE_1: 10 / 100,
            MISC_PERCENTAGE_2: 20 / 100,

            /* Calculation Functions */
            totalTicketsIssued: function () { // REF 23 | [ARR] C3/D3
                return inputData.param3;
            },

            ticketsIssuedByDirectChannels: function () { // REF 24 | [ARR] C4/D4
                return this.totalTicketsIssued() * (passengersBoardedData.direct_dist_costs_per_pb.steady_state_channel_mix_total / 100);
            },

            ticketsReissued: function () { // REF 25 | [ARR] C5/D5
                return inputData.param4;
            },

            totalTicketsReissued: function () { // REF 25 | [ARR] C6/D6
                return this.ticketsIssuedByDirectChannels() * (this.ticketsReissued() / 100);
            },

            averageLabourCost: function () { // REF 26 | [ARR] C7/D7
                return parseInt(inputData.param5, 10).toFixed(2);
            },

            timeToIssueManualReissue: function (value) { // REF 27 | [ARR] C8/D8
                if (value === 'low') return this.TIME_TO_MANUALLY_REISSUE_TICKET_LOW;
                return this.TIME_TO_MANUALLY_REISSUE_TICKET_HIGH;
            },

            timeToIssueAutoReissue: function (value) { // REF 28 | [ARR] C9/D9
                if (value === 'low') return Math.round(this.timeToIssueManualReissue(value) * this.MISC_PERCENTAGE_2);
                return Math.round(this.timeToIssueManualReissue(value) * this.MISC_PERCENTAGE_1);
            },

            timeSavedPerTicket: function (value) { // REF 29 | [ARR] C10/D10
                if (value === 'low') return this.TIME_TO_MANUALLY_REISSUE_TICKET_LOW - this.timeToIssueAutoReissue(value);
                return this.TIME_TO_MANUALLY_REISSUE_TICKET_HIGH - this.timeToIssueAutoReissue(value);
            },

            costSavingPerReissue: function (value) { // REF 30 | [ARR] C11/D11
                return this.timeSavedPerTicket(value) * this.averageLabourCost()
            },

            totalCostSaving: function (value) { // REF 31 | [ARR] C12/D12
                return Math.round(this.costSavingPerReissue(value) * this.totalTicketsReissued());
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op9) {
                    allData.arr.high = 0;
                    allData.arr.low = 0;
                    allData.arr.summary = {};
                    return;
                }
                allData.arr.high = this.result();
                allData.arr.low = this.result('low');

                allData.arr.summary = {
                    total_tickets_issued: {
                        name: "Total number of tickets issued",
                        high: this.totalTicketsIssued(),
                        low: this.totalTicketsIssued()
                    },
                    tickets_issued_by_direct_channels: {
                        name: "Tickets issued through direct channels",
                        high: Math.round(this.ticketsIssuedByDirectChannels()),
                        low: Math.round(this.ticketsIssuedByDirectChannels())
                    },
                    tickets_reissued: {
                        name: "Tickets reissued",
                        unit: "percentage",
                        high: this.ticketsReissued(),
                        low: this.ticketsReissued()
                    },
                    total_tickets_reissued: {
                        name: "Total tickets reissued",
                        high: Math.round(this.totalTicketsReissued()),
                        low: Math.round(this.totalTicketsReissued())
                    },
                    average_labour_cost: {
                        name: "Average labour cost",
                        unit: "currency",
                        high: this.averageLabourCost(),
                        low: this.averageLabourCost()
                    },
                    time_to_issue_manual_reissue: {
                        name: "Time to manually reissue a ticket (mins)",
                        unit: "minutes",
                        high: this.timeToIssueManualReissue('high'),
                        low: this.timeToIssueManualReissue('low')
                    },
                    time_to_issue_auto_reissue: {
                        name: "Time to issue automated reissue",
                        unit: "minutes",
                        high: this.timeToIssueAutoReissue('high'),
                        low: this.timeToIssueAutoReissue('low')
                    },
                    time_saved_per_ticket: {
                        name: "Time saved per ticket",
                        unit: "minutes",
                        high: this.timeSavedPerTicket('high'),
                        low: this.timeSavedPerTicket('low')
                    },
                    cost_saving_per_reissue: {
                        name: "Cost saving per reissue",
                        unit: "currency",
                        high: this.costSavingPerReissue('high'),
                        low: this.costSavingPerReissue('low')
                    },
                    total_cost_saving: {
                        name: "Total cost saving",
                        unit: "currency",
                        high: Math.round(this.totalCostSaving('high')),
                        low: Math.round(this.totalCostSaving('low'))
                    }
                }
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.totalCostSaving(value) / inputData.adjustment);
            }
        }
    })

    .factory('airfareInsight', function (inputData, allData) {
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            AIRFARE_INSIGHT_PERC_HIGH: 1,
            AIRFARE_INSIGHT_PERC_LOW: 0.5,

            /* Calculation Functions */
            airfareInsight: function (value) { // REF 32 | [Airfare Insight] D2/D3
                if (value === 'low') return inputData.param6 * (this.AIRFARE_INSIGHT_PERC_LOW / 100);
                return inputData.param6 * (this.AIRFARE_INSIGHT_PERC_HIGH / 100);
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op8) {
                    allData.airfare_insight.high = 0;
                    allData.airfare_insight.low = 0;
                    allData.airfare_insight.summary = {};
                    return;
                }
                allData.airfare_insight.high = this.result();
                allData.airfare_insight.low = this.result('low');

                allData.airfare_insight.summary = {
                    percentages: {
                        name: "Percentages",
                        unit: "percentage",
                        high: this.AIRFARE_INSIGHT_PERC_HIGH,
                        low: this.AIRFARE_INSIGHT_PERC_LOW
                    },
                    airfare_insight: {
                        name: "Airfare Insight",
                        unit: "currency",
                        high: this.airfareInsight('high').toFixed(2),
                        low: this.airfareInsight('low').toFixed(2)
                    }
                }
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round(this.airfareInsight(value) / inputData.adjustment);
            }
        }
    })

    .factory('channelShift', function (inputData, allData, passengersBoardedData) {
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */

            CURRENT__PAX_BOARDED__TOTAL: 1250355, // [Channel shift] E20
            EXPECTED_PAX_GROWTH_PER_YEAR: inputData.param2 / 100,  // [Channel shift] I21/M21/Q21/U21/Y21
            CURRENT__PAX_BOARDED__TOTAL_ETICKETS_ISSUED: 1856002, // [Channel shift] E22
            CURRENT__PAX_BOARDED__TOTAL_EMDS_ISSUED: 102245, // [Channel shift] E23
            CURRENT__PAX_BOARDED__TOTAL_REISSUES: 25665, // [Channel shift] E24
            CURRENT__PAX_BOARDED__TOTAL_OTHER_AIRLINES_BOOKED: 65871, // [Channel shift] E25

            PSS: {
                CURRENT_PROVIDER: passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider,
                SITA: passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita
            },

            /* Calculation Functions */
            calcFunctions: function () { // REF No. | [SHEET] CELL No.
                /* return . . . */
            },

            totals: function () {

                // total passengers boarded E20
                var total_passengers_boarded__current = this.CURRENT__PAX_BOARDED__TOTAL,
                    total_passengers_boarded__year_1 = Math.round(total_passengers_boarded__current + total_passengers_boarded__current * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_passengers_boarded__year_2 = Math.round(total_passengers_boarded__year_1 + total_passengers_boarded__year_1 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_passengers_boarded__year_3 = Math.round(total_passengers_boarded__year_2 + total_passengers_boarded__year_2 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_passengers_boarded__year_4 = Math.round(total_passengers_boarded__year_3 + total_passengers_boarded__year_3 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_passengers_boarded__year_5 = Math.round(total_passengers_boarded__year_4 + total_passengers_boarded__year_4 * (this.EXPECTED_PAX_GROWTH_PER_YEAR));

                // total etickets issued E22
                var total_etickets_issued__current = this.CURRENT__PAX_BOARDED__TOTAL_ETICKETS_ISSUED,
                    total_etickets_issued__year_1 = Math.round(total_etickets_issued__current + total_etickets_issued__current * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_etickets_issued__year_2 = Math.round(total_etickets_issued__year_1 + total_etickets_issued__year_1 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_etickets_issued__year_3 = Math.round(total_etickets_issued__year_2 + total_etickets_issued__year_2 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_etickets_issued__year_4 = Math.round(total_etickets_issued__year_3 + total_etickets_issued__year_3 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_etickets_issued__year_5 = Math.round(total_etickets_issued__year_4 + total_etickets_issued__year_4 * (this.EXPECTED_PAX_GROWTH_PER_YEAR));

                // total EMDs issued E23
                var total_emds_issued__current = this.CURRENT__PAX_BOARDED__TOTAL_EMDS_ISSUED,
                    total_emds_issued__year_1 = Math.round(total_emds_issued__current + total_emds_issued__current * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_emds_issued__year_2 = Math.round(total_emds_issued__year_1 + total_emds_issued__year_1 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_emds_issued__year_3 = Math.round(total_emds_issued__year_2 + total_emds_issued__year_2 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_emds_issued__year_4 = Math.round(total_emds_issued__year_3 + total_emds_issued__year_3 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_emds_issued__year_5 = Math.round(total_emds_issued__year_4 + total_emds_issued__year_4 * (this.EXPECTED_PAX_GROWTH_PER_YEAR));

                // total reissues E24
                var total_reissues__current = this.CURRENT__PAX_BOARDED__TOTAL_REISSUES,
                    total_reissues__year_1 = Math.round(total_reissues__current + total_reissues__current * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_reissues__year_2 = Math.round(total_reissues__year_1 + total_reissues__year_1 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_reissues__year_3 = Math.round(total_reissues__year_2 + total_reissues__year_2 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_reissues__year_4 = Math.round(total_reissues__year_3 + total_reissues__year_3 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_reissues__year_5 = Math.round(total_reissues__year_4 + total_reissues__year_4 * (this.EXPECTED_PAX_GROWTH_PER_YEAR));

                // total other airlines booked E25
                var total_other_airlines_booked__current = this.CURRENT__PAX_BOARDED__TOTAL_OTHER_AIRLINES_BOOKED,
                    total_other_airlines_booked__year_1 = Math.round(total_other_airlines_booked__current + total_other_airlines_booked__current * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_other_airlines_booked__year_2 = Math.round(total_other_airlines_booked__year_1 + total_other_airlines_booked__year_1 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_other_airlines_booked__year_3 = Math.round(total_other_airlines_booked__year_2 + total_other_airlines_booked__year_2 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_other_airlines_booked__year_4 = Math.round(total_other_airlines_booked__year_3 + total_other_airlines_booked__year_3 * (this.EXPECTED_PAX_GROWTH_PER_YEAR)),
                    total_other_airlines_booked__year_5 = Math.round(total_other_airlines_booked__year_4 + total_other_airlines_booked__year_4 * (this.EXPECTED_PAX_GROWTH_PER_YEAR));

                return {
                    total_passengers_boarded: {
                        current: total_passengers_boarded__current,
                        year_1: total_passengers_boarded__year_1,
                        year_2: total_passengers_boarded__year_2,
                        year_3: total_passengers_boarded__year_3,
                        year_4: total_passengers_boarded__year_4,
                        year_5: total_passengers_boarded__year_5
                    },
                    expected_passenger_growth_per_year: {
                        current: this.EXPECTED_PAX_GROWTH_PER_YEAR,
                        year_1: this.EXPECTED_PAX_GROWTH_PER_YEAR,
                        year_2: this.EXPECTED_PAX_GROWTH_PER_YEAR,
                        year_3: this.EXPECTED_PAX_GROWTH_PER_YEAR,
                        year_4: this.EXPECTED_PAX_GROWTH_PER_YEAR,
                        year_5: this.EXPECTED_PAX_GROWTH_PER_YEAR
                    },
                    total_etickets_issued: {
                        current: total_etickets_issued__current,
                        year_1: total_etickets_issued__year_1,
                        year_2: total_etickets_issued__year_2,
                        year_3: total_etickets_issued__year_3,
                        year_4: total_etickets_issued__year_4,
                        year_5: total_etickets_issued__year_5
                    },
                    total_emds_issued: {
                        current: total_emds_issued__current,
                        year_1: total_emds_issued__year_1,
                        year_2: total_emds_issued__year_2,
                        year_3: total_emds_issued__year_3,
                        year_4: total_emds_issued__year_4,
                        year_5: total_emds_issued__year_5
                    },
                    total_reissues: {
                        current: total_reissues__current,
                        year_1: total_reissues__year_1,
                        year_2: total_reissues__year_2,
                        year_3: total_reissues__year_3,
                        year_4: total_reissues__year_4,
                        year_5: total_reissues__year_5
                    },
                    total_other_airlines_booked: {
                        current: total_other_airlines_booked__current,
                        year_1: total_other_airlines_booked__year_1,
                        year_2: total_other_airlines_booked__year_2,
                        year_3: total_other_airlines_booked__year_3,
                        year_4: total_other_airlines_booked__year_4,
                        year_5: total_other_airlines_booked__year_5
                    }
                }
            },

            direct: function () {

                // Pax boarded
                var pax_boarded_1 = Math.round((passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_2 = Math.round((passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_3 = Math.round((passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_4 = Math.round((passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_total = pax_boarded_1 + pax_boarded_2 + pax_boarded_3 + pax_boarded_4;

                // Call centre [channel shift] ROW 6
                var call_centre__year_1__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.channel_shift_over_5_yrs / 5,
                    call_centre__year_1__perc_pax_boarded = call_centre__year_1__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix,
                    call_centre__year_2__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.channel_shift_over_5_yrs / 5,
                    call_centre__year_2__perc_pax_boarded = call_centre__year_2__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix,
                    call_centre__year_3__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.channel_shift_over_5_yrs / 5,
                    call_centre__year_3__perc_pax_boarded = call_centre__year_3__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix,
                    call_centre__year_4__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.channel_shift_over_5_yrs / 5,
                    call_centre__year_4__perc_pax_boarded = call_centre__year_4__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix,
                    call_centre__year_5__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.channel_shift_over_5_yrs / 5,
                    call_centre__year_5__perc_pax_boarded = call_centre__year_5__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix;

                // Ecommerce [channel shift] ROW 7
                var ecommerce__year_1__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.channel_shift_over_5_yrs / 5,
                    ecommerce__year_1__perc_pax_boarded = ecommerce__year_1__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix,

                    ecommerce__year_2__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.channel_shift_over_5_yrs / 5,
                    ecommerce__year_2__perc_pax_boarded = ecommerce__year_2__channel_shift + ecommerce__year_1__perc_pax_boarded,

                    ecommerce__year_3__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.channel_shift_over_5_yrs / 5,
                    ecommerce__year_3__perc_pax_boarded = ecommerce__year_3__channel_shift + ecommerce__year_2__perc_pax_boarded,

                    ecommerce__year_4__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.channel_shift_over_5_yrs / 5,
                    ecommerce__year_4__perc_pax_boarded = ecommerce__year_4__channel_shift + ecommerce__year_3__perc_pax_boarded,
                    ecommerce__year_5__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.channel_shift_over_5_yrs / 5,
                    ecommerce__year_5__perc_pax_boarded = ecommerce__year_5__channel_shift + ecommerce__year_4__perc_pax_boarded;

                // a2a [channel shift] ROW 8
                var a2a__year_1__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.channel_shift_over_5_yrs / 5,
                    a2a__year_1__perc_pax_boarded = a2a__year_1__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix,
                    a2a__year_2__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.channel_shift_over_5_yrs / 5,
                    a2a__year_2__perc_pax_boarded = a2a__year_2__channel_shift + a2a__year_1__perc_pax_boarded,
                    a2a__year_3__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.channel_shift_over_5_yrs / 5,
                    a2a__year_3__perc_pax_boarded = a2a__year_3__channel_shift + a2a__year_2__perc_pax_boarded,
                    a2a__year_4__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.channel_shift_over_5_yrs / 5,
                    a2a__year_4__perc_pax_boarded = a2a__year_4__channel_shift + a2a__year_3__perc_pax_boarded,
                    a2a__year_5__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.channel_shift_over_5_yrs / 5,
                    a2a__year_5__perc_pax_boarded = a2a__year_5__channel_shift + a2a__year_4__perc_pax_boarded;

                // mobile [channel shift] ROW 9
                var mobile__year_1__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.channel_shift_over_5_yrs / 5,
                    mobile__year_1__perc_pax_boarded = mobile__year_1__channel_shift + passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix,
                    mobile__year_2__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.channel_shift_over_5_yrs / 5,
                    mobile__year_2__perc_pax_boarded = mobile__year_2__channel_shift + mobile__year_1__perc_pax_boarded,
                    mobile__year_3__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.channel_shift_over_5_yrs / 5,
                    mobile__year_3__perc_pax_boarded = mobile__year_3__channel_shift + mobile__year_2__perc_pax_boarded,
                    mobile__year_4__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.channel_shift_over_5_yrs / 5,
                    mobile__year_4__perc_pax_boarded = mobile__year_4__channel_shift + mobile__year_3__perc_pax_boarded,
                    mobile__year_5__channel_shift = passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.channel_shift_over_5_yrs / 5,
                    mobile__year_5__perc_pax_boarded = mobile__year_5__channel_shift + mobile__year_4__perc_pax_boarded;

                return {
                    perc_pax_boarded: passengersBoardedData.direct_dist_costs_per_pb.current_channel_mix_total, // [channel shift] D5
                    pax_boarded: pax_boarded_total, // [channel shift] E5
                    call_centre: { // [channel shift] ROW 6
                        cost_per_pb: {
                            current_provider: passengersBoardedData.direct_dist_costs_per_pb.call_centre.cost_per_pb.current_provider.toFixed(2), // [channel shift] B6
                            sita: passengersBoardedData.direct_dist_costs_per_pb.call_centre.cost_per_pb.sita.toFixed(2) // [channel shift] C6
                        },
                        current: {
                            perc_pax_boarded: passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix, // [channel shift] D6
                            pax_boarded: pax_boarded_1
                        },
                        year_1: {
                            channel_shift: call_centre__year_1__channel_shift, // [channel shift] F6
                            perc_pax_boarded: call_centre__year_1__perc_pax_boarded, // [channel shift] G6
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100), // [channel shift] H6
                                sita: this.totals().total_passengers_boarded.year_1 * (call_centre__year_1__perc_pax_boarded / 100) // [channel shift] I6
                            }
                        },
                        year_2: {
                            channel_shift: call_centre__year_2__channel_shift, // [channel shift] J6
                            perc_pax_boarded: call_centre__year_2__perc_pax_boarded, // [channel shift] K6
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100), // [channel shift] L6
                                sita: this.totals().total_passengers_boarded.year_2 * (call_centre__year_2__perc_pax_boarded / 100) // [channel shift] M6
                            }
                        },
                        year_3: {
                            channel_shift: call_centre__year_3__channel_shift, // [channel shift] N6
                            perc_pax_boarded: call_centre__year_3__perc_pax_boarded, // [channel shift] O6
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100), // [channel shift] P6
                                sita: this.totals().total_passengers_boarded.year_3 * (call_centre__year_3__perc_pax_boarded / 100) // [channel shift] Q6
                            }
                        },
                        year_4: {
                            channel_shift: call_centre__year_4__channel_shift, // [channel shift] R6
                            perc_pax_boarded: call_centre__year_4__perc_pax_boarded, // [channel shift] S6
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100), // [channel shift] T6
                                sita: this.totals().total_passengers_boarded.year_4 * (call_centre__year_4__perc_pax_boarded / 100) // [channel shift] U6
                            }
                        },
                        year_5: {
                            channel_shift: call_centre__year_5__channel_shift, // [channel shift] V6
                            perc_pax_boarded: call_centre__year_5__perc_pax_boarded, // [channel shift] W6
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.direct_dist_costs_per_pb.call_centre.channel.current_channel_mix / 100), // [channel shift] X6
                                sita: this.totals().total_passengers_boarded.year_5 * (call_centre__year_5__perc_pax_boarded / 100) // [channel shift] Y6
                            }
                        }
                    },
                    ecommerce: { // [channel shift] ROW 7
                        cost_per_pb: {
                            current_provider: passengersBoardedData.direct_dist_costs_per_pb.ecommerce.cost_per_pb.current_provider,
                            sita: passengersBoardedData.direct_dist_costs_per_pb.ecommerce.cost_per_pb.sita
                        },
                        current: {
                            perc_pax_boarded: passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix,
                            pax_boarded: pax_boarded_2
                        },
                        year_1: {
                            channel_shift: ecommerce__year_1__channel_shift, // [channel shift] F7
                            perc_pax_boarded: ecommerce__year_1__perc_pax_boarded, // [channel shift] G7
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100), // [channel shift] H7
                                sita: this.totals().total_passengers_boarded.year_1 * (ecommerce__year_1__perc_pax_boarded / 100) // [channel shift] I7
                            }
                        },
                        year_2: {
                            channel_shift: ecommerce__year_2__channel_shift, // [channel shift] J7
                            perc_pax_boarded: ecommerce__year_2__perc_pax_boarded, // [channel shift] K7
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100), // [channel shift] L7
                                sita: this.totals().total_passengers_boarded.year_2 * (ecommerce__year_2__perc_pax_boarded / 100) // [channel shift] M7
                            }
                        },
                        year_3: {
                            channel_shift: ecommerce__year_3__channel_shift, // [channel shift] N7
                            perc_pax_boarded: ecommerce__year_3__perc_pax_boarded, // [channel shift] O7
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100), // [channel shift] P7
                                sita: this.totals().total_passengers_boarded.year_3 * (ecommerce__year_3__perc_pax_boarded / 100) // [channel shift] Q7
                            }
                        },
                        year_4: {
                            channel_shift: ecommerce__year_4__channel_shift, // [channel shift] R7
                            perc_pax_boarded: ecommerce__year_4__perc_pax_boarded, // [channel shift] S7
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100), // [channel shift] T7
                                sita: this.totals().total_passengers_boarded.year_4 * (ecommerce__year_4__perc_pax_boarded / 100) // [channel shift] U7
                            }
                        },
                        year_5: {
                            channel_shift: ecommerce__year_5__channel_shift, // [channel shift] V7
                            perc_pax_boarded: ecommerce__year_5__perc_pax_boarded, // [channel shift] W7
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.direct_dist_costs_per_pb.ecommerce.channel.current_channel_mix / 100), // [channel shift] X7
                                sita: this.totals().total_passengers_boarded.year_5 * (ecommerce__year_5__perc_pax_boarded / 100) // [channel shift] Y7
                            }
                        }
                    },
                    a2a: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.direct_dist_costs_per_pb.travel_agent.cost_per_pb.current_provider,
                            sita: passengersBoardedData.direct_dist_costs_per_pb.travel_agent.cost_per_pb.sita
                        },
                        current: {
                            perc_pax_boarded: passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix,
                            pax_boarded: pax_boarded_3
                        },
                        year_1: {
                            channel_shift: a2a__year_1__channel_shift,
                            perc_pax_boarded: a2a__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100), // [channel shift] H8
                                sita: this.totals().total_passengers_boarded.year_1 * (a2a__year_1__perc_pax_boarded / 100) // [channel shift] I8
                            }
                        },
                        year_2: {
                            channel_shift: a2a__year_2__channel_shift,
                            perc_pax_boarded: a2a__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100), // [channel shift] L8
                                sita: this.totals().total_passengers_boarded.year_2 * (a2a__year_2__perc_pax_boarded / 100) // [channel shift] M8
                            }
                        },
                        year_3: {
                            channel_shift: a2a__year_3__channel_shift,
                            perc_pax_boarded: a2a__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100), // [channel shift] P8
                                sita: this.totals().total_passengers_boarded.year_3 * (a2a__year_3__perc_pax_boarded / 100) // [channel shift] Q8
                            }
                        },
                        year_4: {
                            channel_shift: a2a__year_4__channel_shift,
                            perc_pax_boarded: a2a__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100), // [channel shift] T8
                                sita: this.totals().total_passengers_boarded.year_4 * (a2a__year_4__perc_pax_boarded / 100) // [channel shift] U8
                            }
                        },
                        year_5: {
                            channel_shift: a2a__year_5__channel_shift,
                            perc_pax_boarded: a2a__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.direct_dist_costs_per_pb.travel_agent.channel.current_channel_mix / 100), // [channel shift] X8
                                sita: this.totals().total_passengers_boarded.year_5 * (a2a__year_5__perc_pax_boarded / 100) // [channel shift] Y8
                            }
                        }
                    },
                    mobile: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.direct_dist_costs_per_pb.mobile.cost_per_pb.current_provider,
                            sita: passengersBoardedData.direct_dist_costs_per_pb.mobile.cost_per_pb.sita
                        },
                        current: {
                            perc_pax_boarded: passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix,
                            pax_boarded: pax_boarded_4
                        },
                        year_1: {
                            channel_shift: mobile__year_1__channel_shift,
                            perc_pax_boarded: mobile__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100), // [channel shift] H9
                                sita: this.totals().total_passengers_boarded.year_1 * (mobile__year_1__perc_pax_boarded / 100) // [channel shift] I9
                            }
                        },
                        year_2: {
                            channel_shift: mobile__year_2__channel_shift,
                            perc_pax_boarded: mobile__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100), // [channel shift] L9
                                sita: this.totals().total_passengers_boarded.year_2 * (mobile__year_2__perc_pax_boarded / 100) // [channel shift] M9
                            }
                        },
                        year_3: {
                            channel_shift: mobile__year_3__channel_shift,
                            perc_pax_boarded: mobile__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100), // [channel shift] P9
                                sita: this.totals().total_passengers_boarded.year_3 * (mobile__year_3__perc_pax_boarded / 100) // [channel shift] Q9
                            }
                        },
                        year_4: {
                            channel_shift: mobile__year_4__channel_shift,
                            perc_pax_boarded: mobile__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100), // [channel shift] T9
                                sita: this.totals().total_passengers_boarded.year_4 * (mobile__year_4__perc_pax_boarded / 100) // [channel shift] U9
                            }
                        },
                        year_5: {
                            channel_shift: mobile__year_5__channel_shift,
                            perc_pax_boarded: mobile__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.direct_dist_costs_per_pb.mobile.channel.current_channel_mix / 100), // [channel shift] X9
                                sita: this.totals().total_passengers_boarded.year_5 * (mobile__year_5__perc_pax_boarded / 100) // [channel shift] Y9
                            }
                        }
                    }
                }
            },

            indirect: function () {
                var pax_boarded_1 = Math.round((passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_2 = Math.round((passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_3 = Math.round((passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_4 = Math.round((passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100) * this.totals().total_passengers_boarded.current),
                    pax_boarded_total = pax_boarded_1 + pax_boarded_2 + pax_boarded_3 + pax_boarded_4;

                // amadeus [channel shift] ROW 13
                var gds_amadeus__year_1__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.channel_shift_over_5_yrs / 5,
                    gds_amadeus__year_1__perc_pax_boarded = gds_amadeus__year_1__channel_shift + passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix,
                    gds_amadeus__year_2__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.channel_shift_over_5_yrs / 5,
                    gds_amadeus__year_2__perc_pax_boarded = gds_amadeus__year_2__channel_shift + gds_amadeus__year_1__perc_pax_boarded,
                    gds_amadeus__year_3__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.channel_shift_over_5_yrs / 5,
                    gds_amadeus__year_3__perc_pax_boarded = gds_amadeus__year_3__channel_shift + gds_amadeus__year_2__perc_pax_boarded,
                    gds_amadeus__year_4__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.channel_shift_over_5_yrs / 5,
                    gds_amadeus__year_4__perc_pax_boarded = gds_amadeus__year_4__channel_shift + gds_amadeus__year_3__perc_pax_boarded,
                    gds_amadeus__year_5__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.channel_shift_over_5_yrs / 5,
                    gds_amadeus__year_5__perc_pax_boarded = gds_amadeus__year_5__channel_shift + gds_amadeus__year_4__perc_pax_boarded;

                // SABRE [channel shift] ROW 14
                var gds_sabre__year_1__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.channel_shift_over_5_yrs / 5,
                    gds_sabre__year_1__perc_pax_boarded = gds_sabre__year_1__channel_shift + passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix,
                    gds_sabre__year_2__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.channel_shift_over_5_yrs / 5,
                    gds_sabre__year_2__perc_pax_boarded = gds_sabre__year_2__channel_shift + gds_sabre__year_1__perc_pax_boarded,
                    gds_sabre__year_3__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.channel_shift_over_5_yrs / 5,
                    gds_sabre__year_3__perc_pax_boarded = gds_sabre__year_3__channel_shift + gds_sabre__year_2__perc_pax_boarded,
                    gds_sabre__year_4__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.channel_shift_over_5_yrs / 5,
                    gds_sabre__year_4__perc_pax_boarded = gds_sabre__year_4__channel_shift + gds_sabre__year_3__perc_pax_boarded,
                    gds_sabre__year_5__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.channel_shift_over_5_yrs / 5,
                    gds_sabre__year_5__perc_pax_boarded = gds_sabre__year_5__channel_shift + gds_sabre__year_4__perc_pax_boarded;

                // Galileo [channel shift] ROW 15
                var gds_galileo__year_1__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.channel_shift_over_5_yrs / 5,
                    gds_galileo__year_1__perc_pax_boarded = gds_galileo__year_1__channel_shift + passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix,
                    gds_galileo__year_2__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.channel_shift_over_5_yrs / 5,
                    gds_galileo__year_2__perc_pax_boarded = gds_galileo__year_2__channel_shift + gds_galileo__year_1__perc_pax_boarded,
                    gds_galileo__year_3__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.channel_shift_over_5_yrs / 5,
                    gds_galileo__year_3__perc_pax_boarded = gds_galileo__year_3__channel_shift + gds_galileo__year_2__perc_pax_boarded,
                    gds_galileo__year_4__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.channel_shift_over_5_yrs / 5,
                    gds_galileo__year_4__perc_pax_boarded = gds_galileo__year_4__channel_shift + gds_galileo__year_3__perc_pax_boarded,
                    gds_galileo__year_5__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.channel_shift_over_5_yrs / 5,
                    gds_galileo__year_5__perc_pax_boarded = gds_galileo__year_5__channel_shift + gds_galileo__year_4__perc_pax_boarded;

                // Abacus [channel shift] ROW 16
                var gds_abacus__year_1__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.channel_shift_over_5_yrs / 5,
                    gds_abacus__year_1__perc_pax_boarded = gds_abacus__year_1__channel_shift + passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix,
                    gds_abacus__year_2__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.channel_shift_over_5_yrs / 5,
                    gds_abacus__year_2__perc_pax_boarded = gds_abacus__year_2__channel_shift + gds_abacus__year_1__perc_pax_boarded,
                    gds_abacus__year_3__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.channel_shift_over_5_yrs / 5,
                    gds_abacus__year_3__perc_pax_boarded = gds_abacus__year_3__channel_shift + gds_abacus__year_2__perc_pax_boarded,
                    gds_abacus__year_4__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.channel_shift_over_5_yrs / 5,
                    gds_abacus__year_4__perc_pax_boarded = gds_abacus__year_4__channel_shift + gds_abacus__year_3__perc_pax_boarded,
                    gds_abacus__year_5__channel_shift = passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.channel_shift_over_5_yrs / 5,
                    gds_abacus__year_5__perc_pax_boarded = gds_abacus__year_5__channel_shift + gds_abacus__year_4__perc_pax_boarded;

                return {
                    perc_pax_boarded: passengersBoardedData.indirect_dist_costs_per_pb.current_channel_mix_total,
                    pax_boarded: pax_boarded_total,
                    amadeus: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.indirect_dist_costs_per_pb.amadeus.cost_per_pb.current_provider,
                            sita: passengersBoardedData.indirect_dist_costs_per_pb.amadeus.cost_per_pb.sita
                        },
                        current: {
                            pax_boarded: pax_boarded_1,
                            perc_pax_boarded: passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix
                        },
                        year_1: {
                            channel_shift: gds_amadeus__year_1__channel_shift,
                            perc_pax_boarded: gds_amadeus__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100), // [channel shift] H13
                                sita: this.totals().total_passengers_boarded.year_1 * (gds_amadeus__year_1__perc_pax_boarded / 100) // [channel shift] I13
                            }
                        },
                        year_2: {
                            channel_shift: gds_amadeus__year_2__channel_shift,
                            perc_pax_boarded: gds_amadeus__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100), // [channel shift] L13
                                sita: this.totals().total_passengers_boarded.year_2 * (gds_amadeus__year_2__perc_pax_boarded / 100) // [channel shift] M13
                            }
                        },
                        year_3: {
                            channel_shift: gds_amadeus__year_3__channel_shift,
                            perc_pax_boarded: gds_amadeus__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100), // [channel shift] P13
                                sita: this.totals().total_passengers_boarded.year_3 * (gds_amadeus__year_3__perc_pax_boarded / 100) // [channel shift] Q13
                            }
                        },
                        year_4: {
                            channel_shift: gds_amadeus__year_4__channel_shift,
                            perc_pax_boarded: gds_amadeus__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100), // [channel shift] T13
                                sita: this.totals().total_passengers_boarded.year_4 * (gds_amadeus__year_4__perc_pax_boarded / 100) // [channel shift] U13
                            }
                        },
                        year_5: {
                            channel_shift: gds_amadeus__year_5__channel_shift,
                            perc_pax_boarded: gds_amadeus__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.indirect_dist_costs_per_pb.amadeus.channel.current_channel_mix / 100), // [channel shift] X13
                                sita: this.totals().total_passengers_boarded.year_5 * (gds_amadeus__year_5__perc_pax_boarded / 100) // [channel shift] Y13
                            }
                        }
                    },
                    sabre: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.indirect_dist_costs_per_pb.sabre.cost_per_pb.current_provider,
                            sita: passengersBoardedData.indirect_dist_costs_per_pb.sabre.cost_per_pb.sita
                        },
                        current: {
                            pax_boarded: pax_boarded_2,
                            perc_pax_boarded: passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix
                        },
                        year_1: {
                            channel_shift: gds_sabre__year_1__channel_shift,
                            perc_pax_boarded: gds_sabre__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100), // [channel shift] H14
                                sita: this.totals().total_passengers_boarded.year_1 * (gds_sabre__year_1__perc_pax_boarded / 100) // [channel shift] I14
                            }
                        },
                        year_2: {
                            channel_shift: gds_sabre__year_2__channel_shift,
                            perc_pax_boarded: gds_sabre__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100), // [channel shift] L14
                                sita: this.totals().total_passengers_boarded.year_2 * (gds_sabre__year_2__perc_pax_boarded / 100) // [channel shift] M14
                            }
                        },
                        year_3: {
                            channel_shift: gds_sabre__year_3__channel_shift,
                            perc_pax_boarded: gds_sabre__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100), // [channel shift] P14
                                sita: this.totals().total_passengers_boarded.year_3 * (gds_sabre__year_3__perc_pax_boarded / 100) // [channel shift] Q14
                            }
                        },
                        year_4: {
                            channel_shift: gds_sabre__year_4__channel_shift,
                            perc_pax_boarded: gds_sabre__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100), // [channel shift] T14
                                sita: this.totals().total_passengers_boarded.year_4 * (gds_sabre__year_4__perc_pax_boarded / 100) // [channel shift] U14
                            }
                        },
                        year_5: {
                            channel_shift: gds_sabre__year_5__channel_shift,
                            perc_pax_boarded: gds_sabre__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.indirect_dist_costs_per_pb.sabre.channel.current_channel_mix / 100), // [channel shift] X14
                                sita: this.totals().total_passengers_boarded.year_5 * (gds_sabre__year_5__perc_pax_boarded / 100) // [channel shift] Y14
                            }
                        }
                    },
                    galileo: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.indirect_dist_costs_per_pb.galileo.cost_per_pb.current_provider,
                            sita: passengersBoardedData.indirect_dist_costs_per_pb.galileo.cost_per_pb.sita
                        },
                        current: {
                            pax_boarded: pax_boarded_3,
                            perc_pax_boarded: passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix
                        },
                        year_1: {
                            channel_shift: gds_galileo__year_1__channel_shift,
                            perc_pax_boarded: gds_galileo__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100), // [channel shift] H15
                                sita: this.totals().total_passengers_boarded.year_1 * (gds_galileo__year_1__perc_pax_boarded / 100) // [channel shift] I15
                            }
                        },
                        year_2: {
                            channel_shift: gds_galileo__year_2__channel_shift,
                            perc_pax_boarded: gds_galileo__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100), // [channel shift] L15
                                sita: this.totals().total_passengers_boarded.year_2 * (gds_galileo__year_2__perc_pax_boarded / 100) // [channel shift] M15
                            }
                        },
                        year_3: {
                            channel_shift: gds_galileo__year_3__channel_shift,
                            perc_pax_boarded: gds_galileo__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100), // [channel shift] P15
                                sita: this.totals().total_passengers_boarded.year_3 * (gds_galileo__year_3__perc_pax_boarded / 100) // [channel shift] Q15
                            }
                        },
                        year_4: {
                            channel_shift: gds_galileo__year_4__channel_shift,
                            perc_pax_boarded: gds_galileo__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100), // [channel shift] T15
                                sita: this.totals().total_passengers_boarded.year_4 * (gds_galileo__year_4__perc_pax_boarded / 100) // [channel shift] U15
                            }
                        },
                        year_5: {
                            channel_shift: gds_galileo__year_5__channel_shift,
                            perc_pax_boarded: gds_galileo__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.indirect_dist_costs_per_pb.galileo.channel.current_channel_mix / 100), // [channel shift] X15
                                sita: this.totals().total_passengers_boarded.year_5 * (gds_galileo__year_5__perc_pax_boarded / 100) // [channel shift] Y15
                            }
                        }
                    },
                    abacus: {
                        cost_per_pb: {
                            current_provider: passengersBoardedData.indirect_dist_costs_per_pb.abacus.cost_per_pb.current_provider,
                            sita: passengersBoardedData.indirect_dist_costs_per_pb.abacus.cost_per_pb.sita
                        },
                        current: {
                            pax_boarded: pax_boarded_4,
                            perc_pax_boarded: passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix
                        },
                        year_1: {
                            channel_shift: gds_abacus__year_1__channel_shift,
                            perc_pax_boarded: gds_abacus__year_1__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_1 * (passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100), // [channel shift] H16
                                sita: this.totals().total_passengers_boarded.year_1 * (gds_abacus__year_1__perc_pax_boarded / 100) // [channel shift] I16
                            }
                        },
                        year_2: {
                            channel_shift: gds_abacus__year_2__channel_shift,
                            perc_pax_boarded: gds_abacus__year_2__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_2 * (passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100), // [channel shift] L16
                                sita: this.totals().total_passengers_boarded.year_2 * (gds_abacus__year_2__perc_pax_boarded / 100) // [channel shift] M16
                            }
                        },
                        year_3: {
                            channel_shift: gds_abacus__year_3__channel_shift,
                            perc_pax_boarded: gds_abacus__year_3__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_3 * (passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100), // [channel shift] P16
                                sita: this.totals().total_passengers_boarded.year_3 * (gds_abacus__year_3__perc_pax_boarded / 100) // [channel shift] Q16
                            }
                        },
                        year_4: {
                            channel_shift: gds_abacus__year_4__channel_shift,
                            perc_pax_boarded: gds_abacus__year_4__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_4 * (passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100), // [channel shift] T16
                                sita: this.totals().total_passengers_boarded.year_4 * (gds_abacus__year_4__perc_pax_boarded / 100) // [channel shift] U16
                            }
                        },
                        year_5: {
                            channel_shift: gds_abacus__year_5__channel_shift,
                            perc_pax_boarded: gds_abacus__year_5__perc_pax_boarded,
                            pax_boarded: {
                                current: this.totals().total_passengers_boarded.year_5 * (passengersBoardedData.indirect_dist_costs_per_pb.abacus.channel.current_channel_mix / 100), // [channel shift] X16
                                sita: this.totals().total_passengers_boarded.year_5 * (gds_abacus__year_5__perc_pax_boarded / 100) // [channel shift] Y16
                            }
                        }
                    }
                }
            },

            // need to add calcs here to enter data into the objects below
            costs: function () {

                // ********************
                // COST PER PB
                // - CURRENT
                // -- DIRECT. [channel shift] B28 - B33
                var cost_per_pb__current__direct__call_centre = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.direct_dist_costs_per_pb.call_centre.cost_per_pb.current_provider,
                    cost_per_pb__current__direct__ecommerce = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.direct_dist_costs_per_pb.ecommerce.cost_per_pb.current_provider,
                    cost_per_pb__current__direct__a2a = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.direct_dist_costs_per_pb.travel_agent.cost_per_pb.current_provider,
                    cost_per_pb__current__direct__mobile = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.direct_dist_costs_per_pb.mobile.cost_per_pb.current_provider,
                    cost_per_pb__current__direct__other_1 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider,
                    cost_per_pb__current__direct__other_2 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider;

                // -- INDIRECT. [channel shift] B35 - B40
                var cost_per_pb__current__indirect__amadeus = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.indirect_dist_costs_per_pb.amadeus.cost_per_pb.current_provider,
                    cost_per_pb__current__indirect__sabre = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.indirect_dist_costs_per_pb.sabre.cost_per_pb.current_provider,
                    cost_per_pb__current__indirect__galileo = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.indirect_dist_costs_per_pb.galileo.cost_per_pb.current_provider,
                    cost_per_pb__current__indirect__abacus = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider + passengersBoardedData.indirect_dist_costs_per_pb.abacus.cost_per_pb.current_provider,
                    cost_per_pb__current__indirect__other_1 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider,
                    cost_per_pb__current__indirect__other_2 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.current_provider;

                // - SITA
                // -- DIRECT. [channel shift] C28 - C33
                var cost_per_pb__sita__direct__call_centre = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.direct_dist_costs_per_pb.call_centre.cost_per_pb.sita,
                    cost_per_pb__sita__direct__ecommerce = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.direct_dist_costs_per_pb.ecommerce.cost_per_pb.sita,
                    cost_per_pb__sita__direct__a2a = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.direct_dist_costs_per_pb.travel_agent.cost_per_pb.sita,
                    cost_per_pb__sita__direct__mobile = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.direct_dist_costs_per_pb.mobile.cost_per_pb.sita,
                    cost_per_pb__sita__direct__other_1 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita,
                    cost_per_pb__sita__direct__other_2 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita;

                // -- INDIRECT. [channel shift] C35 - C40
                var cost_per_pb__sita__indirect__amadeus = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.indirect_dist_costs_per_pb.amadeus.cost_per_pb.sita,
                    cost_per_pb__sita__indirect__sabre = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.indirect_dist_costs_per_pb.sabre.cost_per_pb.sita,
                    cost_per_pb__sita__indirect__galileo = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.indirect_dist_costs_per_pb.galileo.cost_per_pb.sita,
                    cost_per_pb__sita__indirect__abacus = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita + passengersBoardedData.indirect_dist_costs_per_pb.abacus.cost_per_pb.sita,
                    cost_per_pb__sita__indirect__other_1 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita,
                    cost_per_pb__sita__indirect__other_2 = passengersBoardedData.core_passenger_services_cost_per_pb.cost_per_pb.sita;

                // ********************
                // CURRENT
                // - CURRENT
                // -- DIRECT
                var current__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.current.pax_boarded,
                    current__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.current.pax_boarded,
                    current__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.current.pax_boarded,
                    current__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.current.pax_boarded,
                    current__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    current__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    current__current__direct__total = current__current__direct__call_centre + current__current__direct__ecommerce + current__current__direct__a2a + current__current__direct__mobile + current__current__direct__other_1 + current__current__direct__other_2;

                // -- INDIRECT
                var current__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.current.pax_boarded,
                    current__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.current.pax_boarded,
                    current__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.current.pax_boarded,
                    current__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.current.pax_boarded,
                    current__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    current__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    current__current__indirect__total = current__current__indirect__amadeus + current__current__indirect__sabre + current__current__indirect__galileo + current__current__indirect__abacus + current__current__indirect__other_1 + current__current__indirect__other_2;

                // - SITA
                // -- DIRECT
                var current__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.current.pax_boarded,
                    current__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.current.pax_boarded,
                    current__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.current.pax_boarded,
                    current__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.current.pax_boarded,
                    current__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    current__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    current__sita__direct__total = current__sita__direct__call_centre + current__sita__direct__ecommerce + current__sita__direct__a2a + current__sita__direct__mobile + current__sita__direct__other_1 + current__sita__direct__other_2;

                // -- INDIRECT
                var current__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.current.pax_boarded,
                    current__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.current.pax_boarded,
                    current__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.current.pax_boarded,
                    current__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.current.pax_boarded,
                    current__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    current__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    current__sita__indirect__total = current__sita__indirect__amadeus + current__sita__indirect__sabre + current__sita__indirect__galileo + current__sita__indirect__abacus + current__sita__indirect__other_1 + current__sita__indirect__other_2;

                // = TOTALS
                var current__current__total = current__current__direct__total + current__current__indirect__total,
                    current__sita__total = current__sita__direct__total + current__sita__indirect__total,
                    current__supplier_does_not_shift__difference = current__current__total - current__sita__total;

                // ********************
                // YEAR 1
                // - CURRENT
                // -- DIRECT
                var year_1__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_1.pax_boarded.current,
                    year_1__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_1.pax_boarded.current,
                    year_1__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_1.pax_boarded.current,
                    year_1__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_1.pax_boarded.current,
                    year_1__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_1__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_1__current__direct__total = year_1__current__direct__call_centre + year_1__current__direct__ecommerce + year_1__current__direct__a2a + year_1__current__direct__mobile + year_1__current__direct__other_1 + year_1__current__direct__other_2;

                // -- INDIRECT
                var year_1__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_1.pax_boarded.current,
                    year_1__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_1.pax_boarded.current,
                    year_1__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_1.pax_boarded.current,
                    year_1__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_1.pax_boarded.current,
                    year_1__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_1__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_1__current__indirect__total = year_1__current__indirect__amadeus + year_1__current__indirect__sabre + year_1__current__indirect__galileo + year_1__current__indirect__abacus + year_1__current__indirect__other_1 + year_1__current__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_1__current__totals = year_1__current__direct__total + year_1__current__indirect__total;

                // -----------------------
                // - CURRENT WITH CHANNEL SHIFT
                // -- DIRECT
                var year_1__current_with_channel_shift__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_1__current_with_channel_shift__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_1__current_with_channel_shift__direct__total = year_1__current_with_channel_shift__direct__call_centre + year_1__current_with_channel_shift__direct__ecommerce + year_1__current_with_channel_shift__direct__a2a + year_1__current_with_channel_shift__direct__mobile + year_1__current_with_channel_shift__direct__other_1 + year_1__current_with_channel_shift__direct__other_2;

                // -- INDIRECT
                var year_1__current_with_channel_shift__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_1.pax_boarded.sita,
                    year_1__current_with_channel_shift__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_1__current_with_channel_shift__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_1__current_with_channel_shift__indirect__total = year_1__current_with_channel_shift__indirect__amadeus + year_1__current_with_channel_shift__indirect__sabre + year_1__current_with_channel_shift__indirect__galileo + year_1__current_with_channel_shift__indirect__abacus + year_1__current_with_channel_shift__indirect__other_1 + year_1__current_with_channel_shift__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_1__current_with_channel_shift__totals = year_1__current_with_channel_shift__direct__total + year_1__current_with_channel_shift__indirect__total;

                // -----------------------
                // - SITA
                // -- DIRECT
                var year_1__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.year_1.pax_boarded.sita,
                    year_1__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.year_1.pax_boarded.sita,
                    year_1__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.year_1.pax_boarded.sita,
                    year_1__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.year_1.pax_boarded.sita,
                    year_1__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    year_1__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    year_1__sita__direct__total = year_1__sita__direct__call_centre + year_1__sita__direct__ecommerce + year_1__sita__direct__a2a + year_1__sita__direct__mobile + year_1__sita__direct__other_1 + year_1__sita__direct__other_2;

                // -- INDIRECT
                var year_1__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.year_1.pax_boarded.sita,
                    year_1__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.year_1.pax_boarded.sita,
                    year_1__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.year_1.pax_boarded.sita,
                    year_1__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.year_1.pax_boarded.sita,
                    year_1__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    year_1__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    year_1__sita__indirect__total = year_1__sita__indirect__amadeus + year_1__sita__indirect__sabre + year_1__sita__indirect__galileo + year_1__sita__indirect__abacus + year_1__sita__indirect__other_1 + year_1__sita__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_1__sita__totals = year_1__sita__direct__total + year_1__sita__indirect__total;

                // DIFFERENCES
                var year_1__difference__supplier_does_not_shift = year_1__current__totals - year_1__sita__totals,
                    year_1__difference__supplier_shifts = year_1__current_with_channel_shift__totals - year_1__sita__totals;

                // INT/DECIMAL CONVERSIONS
                year_1__difference__supplier_does_not_shift = parseFloat(year_1__difference__supplier_does_not_shift.toFixed(2));
                year_1__difference__supplier_shifts = parseFloat(year_1__difference__supplier_shifts.toFixed(2));


                // ********************
                // YEAR 2
                // - CURRENT
                // -- DIRECT
                var year_2__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_2.pax_boarded.current,
                    year_2__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_2.pax_boarded.current,
                    year_2__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_2.pax_boarded.current,
                    year_2__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_2.pax_boarded.current,
                    year_2__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_2__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_2__current__direct__total = year_2__current__direct__call_centre + year_2__current__direct__ecommerce + year_2__current__direct__a2a + year_2__current__direct__mobile + year_2__current__direct__other_1 + year_2__current__direct__other_2;

                // -- INDIRECT
                var year_2__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_2.pax_boarded.current,
                    year_2__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_2.pax_boarded.current,
                    year_2__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_2.pax_boarded.current,
                    year_2__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_2.pax_boarded.current,
                    year_2__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_2__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_2__current__indirect__total = year_2__current__indirect__amadeus + year_2__current__indirect__sabre + year_2__current__indirect__galileo + year_2__current__indirect__abacus + year_2__current__indirect__other_1 + year_2__current__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_2__current__totals = year_2__current__direct__total + year_2__current__indirect__total;

                // -----------------------
                // - CURRENT WITH CHANNEL SHIFT
                // -- DIRECT
                var year_2__current_with_channel_shift__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_2__current_with_channel_shift__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_2__current_with_channel_shift__direct__total = year_2__current_with_channel_shift__direct__call_centre + year_2__current_with_channel_shift__direct__ecommerce + year_2__current_with_channel_shift__direct__a2a + year_2__current_with_channel_shift__direct__mobile + year_2__current_with_channel_shift__direct__other_1 + year_2__current_with_channel_shift__direct__other_2;

                // -- INDIRECT
                var year_2__current_with_channel_shift__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_2.pax_boarded.sita,
                    year_2__current_with_channel_shift__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_2__current_with_channel_shift__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_2__current_with_channel_shift__indirect__total = year_2__current_with_channel_shift__indirect__amadeus + year_2__current_with_channel_shift__indirect__sabre + year_2__current_with_channel_shift__indirect__galileo + year_2__current_with_channel_shift__indirect__abacus + year_2__current_with_channel_shift__indirect__other_1 + year_2__current_with_channel_shift__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_2__current_with_channel_shift__totals = year_2__current_with_channel_shift__direct__total + year_2__current_with_channel_shift__indirect__total;

                // -----------------------
                // - SITA
                // -- DIRECT
                var year_2__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.year_2.pax_boarded.sita,
                    year_2__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.year_2.pax_boarded.sita,
                    year_2__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.year_2.pax_boarded.sita,
                    year_2__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.year_2.pax_boarded.sita,
                    year_2__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    year_2__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    year_2__sita__direct__total = year_2__sita__direct__call_centre + year_2__sita__direct__ecommerce + year_2__sita__direct__a2a + year_2__sita__direct__mobile + year_2__sita__direct__other_1 + year_2__sita__direct__other_2;

                // -- INDIRECT
                var year_2__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.year_2.pax_boarded.sita,
                    year_2__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.year_2.pax_boarded.sita,
                    year_2__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.year_2.pax_boarded.sita,
                    year_2__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.year_2.pax_boarded.sita,
                    year_2__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    year_2__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    year_2__sita__indirect__total = year_2__sita__indirect__amadeus + year_2__sita__indirect__sabre + year_2__sita__indirect__galileo + year_2__sita__indirect__abacus + year_2__sita__indirect__other_1 + year_2__sita__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_2__sita__totals = year_2__sita__direct__total + year_2__sita__indirect__total;

                // DIFFERENCES
                var year_2__difference__supplier_does_not_shift = year_2__current__totals - year_2__sita__totals,
                    year_2__difference__supplier_shifts = year_2__current_with_channel_shift__totals - year_2__sita__totals;

                // INT/DECIMAL CONVERSIONS
                year_2__difference__supplier_does_not_shift = parseFloat(year_2__difference__supplier_does_not_shift.toFixed(2));
                year_2__difference__supplier_shifts = parseFloat(year_2__difference__supplier_shifts.toFixed(2));


                // ********************
                // YEAR 3
                // - CURRENT
                // -- DIRECT
                var year_3__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_3.pax_boarded.current,
                    year_3__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_3.pax_boarded.current,
                    year_3__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_3.pax_boarded.current,
                    year_3__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_3.pax_boarded.current,
                    year_3__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_3__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_3__current__direct__total = year_3__current__direct__call_centre + year_3__current__direct__ecommerce + year_3__current__direct__a2a + year_3__current__direct__mobile + year_3__current__direct__other_1 + year_3__current__direct__other_2;

                // -- INDIRECT
                var year_3__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_3.pax_boarded.current,
                    year_3__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_3.pax_boarded.current,
                    year_3__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_3.pax_boarded.current,
                    year_3__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_3.pax_boarded.current,
                    year_3__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_3__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_3__current__indirect__total = year_3__current__indirect__amadeus + year_3__current__indirect__sabre + year_3__current__indirect__galileo + year_3__current__indirect__abacus + year_3__current__indirect__other_1 + year_3__current__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_3__current__totals = year_3__current__direct__total + year_3__current__indirect__total;

                // -----------------------
                // - CURRENT WITH CHANNEL SHIFT
                // -- DIRECT
                var year_3__current_with_channel_shift__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_3__current_with_channel_shift__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_3__current_with_channel_shift__direct__total = year_3__current_with_channel_shift__direct__call_centre + year_3__current_with_channel_shift__direct__ecommerce + year_3__current_with_channel_shift__direct__a2a + year_3__current_with_channel_shift__direct__mobile + year_3__current_with_channel_shift__direct__other_1 + year_3__current_with_channel_shift__direct__other_2;

                // -- INDIRECT
                var year_3__current_with_channel_shift__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_3.pax_boarded.sita,
                    year_3__current_with_channel_shift__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_3__current_with_channel_shift__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_3__current_with_channel_shift__indirect__total = year_3__current_with_channel_shift__indirect__amadeus + year_3__current_with_channel_shift__indirect__sabre + year_3__current_with_channel_shift__indirect__galileo + year_3__current_with_channel_shift__indirect__abacus + year_3__current_with_channel_shift__indirect__other_1 + year_3__current_with_channel_shift__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_3__current_with_channel_shift__totals = year_3__current_with_channel_shift__direct__total + year_3__current_with_channel_shift__indirect__total;

                // -----------------------
                // - SITA
                // -- DIRECT
                var year_3__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.year_3.pax_boarded.sita,
                    year_3__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.year_3.pax_boarded.sita,
                    year_3__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.year_3.pax_boarded.sita,
                    year_3__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.year_3.pax_boarded.sita,
                    year_3__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    year_3__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    year_3__sita__direct__total = year_3__sita__direct__call_centre + year_3__sita__direct__ecommerce + year_3__sita__direct__a2a + year_3__sita__direct__mobile + year_3__sita__direct__other_1 + year_3__sita__direct__other_2;

                // -- INDIRECT
                var year_3__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.year_3.pax_boarded.sita,
                    year_3__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.year_3.pax_boarded.sita,
                    year_3__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.year_3.pax_boarded.sita,
                    year_3__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.year_3.pax_boarded.sita,
                    year_3__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    year_3__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    year_3__sita__indirect__total = year_3__sita__indirect__amadeus + year_3__sita__indirect__sabre + year_3__sita__indirect__galileo + year_3__sita__indirect__abacus + year_3__sita__indirect__other_1 + year_3__sita__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_3__sita__totals = year_3__sita__direct__total + year_3__sita__indirect__total;

                // DIFFERENCES
                var year_3__difference__supplier_does_not_shift = year_3__current__totals - year_3__sita__totals,
                    year_3__difference__supplier_shifts = year_3__current_with_channel_shift__totals - year_3__sita__totals;

                // INT/DECIMAL CONVERSIONS
                year_3__difference__supplier_does_not_shift = parseFloat(year_3__difference__supplier_does_not_shift.toFixed(2));
                year_3__difference__supplier_shifts = parseFloat(year_3__difference__supplier_shifts.toFixed(2));


                // ********************
                // YEAR 4
                // - CURRENT
                // -- DIRECT
                var year_4__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_4.pax_boarded.current,
                    year_4__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_4.pax_boarded.current,
                    year_4__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_4.pax_boarded.current,
                    year_4__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_4.pax_boarded.current,
                    year_4__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_4__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_4__current__direct__total = year_4__current__direct__call_centre + year_4__current__direct__ecommerce + year_4__current__direct__a2a + year_4__current__direct__mobile + year_4__current__direct__other_1 + year_4__current__direct__other_2;

                // -- INDIRECT
                var year_4__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_4.pax_boarded.current,
                    year_4__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_4.pax_boarded.current,
                    year_4__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_4.pax_boarded.current,
                    year_4__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_4.pax_boarded.current,
                    year_4__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_4__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_4__current__indirect__total = year_4__current__indirect__amadeus + year_4__current__indirect__sabre + year_4__current__indirect__galileo + year_4__current__indirect__abacus + year_4__current__indirect__other_1 + year_4__current__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_4__current__totals = year_4__current__direct__total + year_4__current__indirect__total;

                // -----------------------
                // - CURRENT WITH CHANNEL SHIFT
                // -- DIRECT
                var year_4__current_with_channel_shift__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_4__current_with_channel_shift__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_4__current_with_channel_shift__direct__total = year_4__current_with_channel_shift__direct__call_centre + year_4__current_with_channel_shift__direct__ecommerce + year_4__current_with_channel_shift__direct__a2a + year_4__current_with_channel_shift__direct__mobile + year_4__current_with_channel_shift__direct__other_1 + year_4__current_with_channel_shift__direct__other_2;

                // -- INDIRECT
                var year_4__current_with_channel_shift__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_4.pax_boarded.sita,
                    year_4__current_with_channel_shift__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_4__current_with_channel_shift__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_4__current_with_channel_shift__indirect__total = year_4__current_with_channel_shift__indirect__amadeus + year_4__current_with_channel_shift__indirect__sabre + year_4__current_with_channel_shift__indirect__galileo + year_4__current_with_channel_shift__indirect__abacus + year_4__current_with_channel_shift__indirect__other_1 + year_4__current_with_channel_shift__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_4__current_with_channel_shift__totals = year_4__current_with_channel_shift__direct__total + year_4__current_with_channel_shift__indirect__total;

                // -----------------------
                // - SITA
                // -- DIRECT
                var year_4__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.year_4.pax_boarded.sita,
                    year_4__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.year_4.pax_boarded.sita,
                    year_4__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.year_4.pax_boarded.sita,
                    year_4__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.year_4.pax_boarded.sita,
                    year_4__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    year_4__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    year_4__sita__direct__total = year_4__sita__direct__call_centre + year_4__sita__direct__ecommerce + year_4__sita__direct__a2a + year_4__sita__direct__mobile + year_4__sita__direct__other_1 + year_4__sita__direct__other_2;

                // -- INDIRECT
                var year_4__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.year_4.pax_boarded.sita,
                    year_4__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.year_4.pax_boarded.sita,
                    year_4__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.year_4.pax_boarded.sita,
                    year_4__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.year_4.pax_boarded.sita,
                    year_4__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    year_4__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    year_4__sita__indirect__total = year_4__sita__indirect__amadeus + year_4__sita__indirect__sabre + year_4__sita__indirect__galileo + year_4__sita__indirect__abacus + year_4__sita__indirect__other_1 + year_4__sita__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_4__sita__totals = year_4__sita__direct__total + year_4__sita__indirect__total;

                // DIFFERENCES
                var year_4__difference__supplier_does_not_shift = year_4__current__totals - year_4__sita__totals,
                    year_4__difference__supplier_shifts = year_4__current_with_channel_shift__totals - year_4__sita__totals;

                // INT/DECIMAL CONVERSIONS
                year_4__difference__supplier_does_not_shift = parseFloat(year_4__difference__supplier_does_not_shift.toFixed(2));
                year_4__difference__supplier_shifts = parseFloat(year_4__difference__supplier_shifts.toFixed(2));


                // ********************
                // YEAR 5
                // - CURRENT
                // -- DIRECT
                var year_5__current__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_5.pax_boarded.current,
                    year_5__current__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_5.pax_boarded.current,
                    year_5__current__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_5.pax_boarded.current,
                    year_5__current__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_5.pax_boarded.current,
                    year_5__current__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_5__current__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_5__current__direct__total = year_5__current__direct__call_centre + year_5__current__direct__ecommerce + year_5__current__direct__a2a + year_5__current__direct__mobile + year_5__current__direct__other_1 + year_5__current__direct__other_2;

                // -- INDIRECT
                var year_5__current__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_5.pax_boarded.current,
                    year_5__current__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_5.pax_boarded.current,
                    year_5__current__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_5.pax_boarded.current,
                    year_5__current__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_5.pax_boarded.current,
                    year_5__current__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_5__current__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_5__current__indirect__total = year_5__current__indirect__amadeus + year_5__current__indirect__sabre + year_5__current__indirect__galileo + year_5__current__indirect__abacus + year_5__current__indirect__other_1 + year_5__current__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_5__current__totals = year_5__current__direct__total + year_5__current__indirect__total;

                // -----------------------
                // - CURRENT WITH CHANNEL SHIFT
                // -- DIRECT
                var year_5__current_with_channel_shift__direct__call_centre = cost_per_pb__current__direct__call_centre * this.direct().call_centre.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__direct__ecommerce = cost_per_pb__current__direct__ecommerce * this.direct().ecommerce.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__direct__a2a = cost_per_pb__current__direct__a2a * this.direct().a2a.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__direct__mobile = cost_per_pb__current__direct__mobile * this.direct().mobile.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__direct__other_1 = cost_per_pb__current__direct__other_1 * 0,
                    year_5__current_with_channel_shift__direct__other_2 = cost_per_pb__current__direct__other_2 * 0,
                    year_5__current_with_channel_shift__direct__total = year_5__current_with_channel_shift__direct__call_centre + year_5__current_with_channel_shift__direct__ecommerce + year_5__current_with_channel_shift__direct__a2a + year_5__current_with_channel_shift__direct__mobile + year_5__current_with_channel_shift__direct__other_1 + year_5__current_with_channel_shift__direct__other_2;

                // -- INDIRECT
                var year_5__current_with_channel_shift__indirect__amadeus = cost_per_pb__current__indirect__amadeus * this.indirect().amadeus.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__indirect__sabre = cost_per_pb__current__indirect__sabre * this.indirect().sabre.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__indirect__galileo = cost_per_pb__current__indirect__galileo * this.indirect().galileo.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__indirect__abacus = cost_per_pb__current__indirect__abacus * this.indirect().abacus.year_5.pax_boarded.sita,
                    year_5__current_with_channel_shift__indirect__other_1 = cost_per_pb__current__indirect__other_1 * 0,
                    year_5__current_with_channel_shift__indirect__other_2 = cost_per_pb__current__indirect__other_2 * 0,
                    year_5__current_with_channel_shift__indirect__total = year_5__current_with_channel_shift__indirect__amadeus + year_5__current_with_channel_shift__indirect__sabre + year_5__current_with_channel_shift__indirect__galileo + year_5__current_with_channel_shift__indirect__abacus + year_5__current_with_channel_shift__indirect__other_1 + year_5__current_with_channel_shift__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_5__current_with_channel_shift__totals = year_5__current_with_channel_shift__direct__total + year_5__current_with_channel_shift__indirect__total;

                // -----------------------
                // - SITA
                // -- DIRECT
                var year_5__sita__direct__call_centre = cost_per_pb__sita__direct__call_centre * this.direct().call_centre.year_5.pax_boarded.sita,
                    year_5__sita__direct__ecommerce = cost_per_pb__sita__direct__ecommerce * this.direct().ecommerce.year_5.pax_boarded.sita,
                    year_5__sita__direct__a2a = cost_per_pb__sita__direct__a2a * this.direct().a2a.year_5.pax_boarded.sita,
                    year_5__sita__direct__mobile = cost_per_pb__sita__direct__mobile * this.direct().mobile.year_5.pax_boarded.sita,
                    year_5__sita__direct__other_1 = cost_per_pb__sita__direct__other_1 * 0,
                    year_5__sita__direct__other_2 = cost_per_pb__sita__direct__other_2 * 0,
                    year_5__sita__direct__total = year_5__sita__direct__call_centre + year_5__sita__direct__ecommerce + year_5__sita__direct__a2a + year_5__sita__direct__mobile + year_5__sita__direct__other_1 + year_5__sita__direct__other_2;

                // -- INDIRECT
                var year_5__sita__indirect__amadeus = cost_per_pb__sita__indirect__amadeus * this.indirect().amadeus.year_5.pax_boarded.sita,
                    year_5__sita__indirect__sabre = cost_per_pb__sita__indirect__sabre * this.indirect().sabre.year_5.pax_boarded.sita,
                    year_5__sita__indirect__galileo = cost_per_pb__sita__indirect__galileo * this.indirect().galileo.year_5.pax_boarded.sita,
                    year_5__sita__indirect__abacus = cost_per_pb__sita__indirect__abacus * this.indirect().abacus.year_5.pax_boarded.sita,
                    year_5__sita__indirect__other_1 = cost_per_pb__sita__indirect__other_1 * 0,
                    year_5__sita__indirect__other_2 = cost_per_pb__sita__indirect__other_2 * 0,
                    year_5__sita__indirect__total = year_5__sita__indirect__amadeus + year_5__sita__indirect__sabre + year_5__sita__indirect__galileo + year_5__sita__indirect__abacus + year_5__sita__indirect__other_1 + year_5__sita__indirect__other_2;

                // - CURRENT
                // - TOTALS
                var year_5__sita__totals = year_5__sita__direct__total + year_5__sita__indirect__total;

                // DIFFERENCES
                var year_5__difference__supplier_does_not_shift = year_5__current__totals - year_5__sita__totals,
                    year_5__difference__supplier_shifts = year_5__current_with_channel_shift__totals - year_5__sita__totals;

                // INT/DECIMAL CONVERSIONS
                year_5__difference__supplier_does_not_shift = parseFloat(year_5__difference__supplier_does_not_shift.toFixed(2));
                year_5__difference__supplier_shifts = parseFloat(year_5__difference__supplier_shifts.toFixed(2));


                // ALL DIFFERENCE TOTALS
                var total__difference__supplier_does_not_shift = year_1__difference__supplier_does_not_shift + year_2__difference__supplier_does_not_shift + year_3__difference__supplier_does_not_shift + year_4__difference__supplier_does_not_shift + year_5__difference__supplier_does_not_shift,
                    total__difference__supplier_shifts = year_1__difference__supplier_shifts + year_2__difference__supplier_shifts + year_3__difference__supplier_shifts + year_4__difference__supplier_shifts + year_5__difference__supplier_shifts;

                return {
                    cost_per_pb: {
                        current: {
                            direct: {
                                call_centre: cost_per_pb__current__direct__call_centre, // [channel shift] B28
                                ecommerce: cost_per_pb__current__direct__ecommerce, // [channel shift] B29
                                a2a: cost_per_pb__current__direct__a2a, // [channel shift] B30
                                mobile: cost_per_pb__current__direct__mobile, // [channel shift] B31
                                other_2: cost_per_pb__current__direct__other_1, // [channel shift] B32
                                other_1: cost_per_pb__current__direct__other_2 // [channel shift] B33
                            },
                            indirect: {
                                amadeus: cost_per_pb__current__indirect__amadeus, // [channel shift] B35
                                sabre: cost_per_pb__current__indirect__sabre, // [channel shift] B36
                                galileo: cost_per_pb__current__indirect__galileo, // [channel shift] B37
                                abacus: cost_per_pb__current__indirect__abacus, // [channel shift] B38,
                                other_1: cost_per_pb__current__indirect__other_1, // [channel shift] B39,
                                other_2: cost_per_pb__current__indirect__other_2// [channel shift] B40
                            }
                        },
                        sita: {
                            direct: {
                                call_centre: cost_per_pb__sita__direct__call_centre, // [channel shift] C28
                                ecommerce: cost_per_pb__sita__direct__ecommerce, // [channel shift] C29,
                                a2a: cost_per_pb__sita__direct__a2a, // [channel shift] C30,
                                mobile: cost_per_pb__sita__direct__mobile, // [channel shift] C31,
                                other_1: cost_per_pb__sita__direct__other_1, // [channel shift] C32,
                                other_2: cost_per_pb__sita__direct__other_2 // [channel shift] C33,
                            },
                            indirect: {
                                amadeus: cost_per_pb__sita__indirect__amadeus, // [channel shift] C35
                                sabre: cost_per_pb__sita__indirect__sabre, // [channel shift] C36
                                galileo: cost_per_pb__sita__indirect__galileo, // [channel shift] C37
                                abacus: cost_per_pb__sita__indirect__abacus, // [channel shift] C38
                                other_1: cost_per_pb__sita__indirect__other_1, // [channel shift] C39
                                other_2: cost_per_pb__sita__indirect__other_2 // [channel shift] C40
                            }
                        }
                    },
                    current: {
                        current: {
                            direct: {
                                total: current__current__direct__total,
                                call_centre: current__current__direct__call_centre,
                                ecommerce: current__current__direct__ecommerce,
                                a2a: current__current__direct__a2a,
                                mobile: current__current__direct__mobile,
                                other_1: current__current__direct__other_1,
                                other_2: current__current__direct__other_2
                            },
                            indirect: {
                                total: current__current__indirect__total,
                                amadeus: current__current__indirect__amadeus,
                                sabre: current__current__indirect__sabre,
                                galileo: current__current__indirect__galileo,
                                abacus: current__current__indirect__abacus,
                                other_1: current__current__indirect__other_1,
                                other_2: current__current__indirect__other_2
                            },
                            total: current__current__total
                        },
                        sita: {
                            direct: {
                                total: current__sita__direct__total,
                                call_centre: current__sita__direct__call_centre,
                                ecommerce: current__sita__direct__ecommerce,
                                a2a: current__sita__direct__a2a,
                                mobile: current__sita__direct__mobile,
                                other_1: current__sita__direct__other_1,
                                other_2: current__sita__direct__other_2
                            },
                            indirect: {
                                total: current__sita__indirect__total,
                                amadeus: current__sita__indirect__amadeus,
                                sabre: current__sita__indirect__sabre,
                                galileo: current__sita__indirect__galileo,
                                abacus: current__sita__indirect__abacus,
                                other_1: current__sita__indirect__other_1,
                                other_2: current__sita__indirect__other_2
                            },
                            total: current__sita__total
                        },
                        supplier_does_not_shift__difference: current__supplier_does_not_shift__difference,
                        supplier_shifts__difference: 0
                    },
                    year_1: {
                        current: {
                            direct: {
                                total: year_1__current__direct__total,
                                call_centre: year_1__current__direct__call_centre,
                                ecommerce: year_1__current__direct__ecommerce,
                                a2a: year_1__current__direct__a2a,
                                mobile: year_1__current__direct__mobile,
                                other_1: year_1__current__direct__other_1,
                                other_2: year_1__current__direct__other_2
                            },
                            indirect: {
                                total: year_1__current__indirect__total,
                                amadeus: year_1__current__indirect__amadeus,
                                sabre: year_1__current__indirect__sabre,
                                galileo: year_1__current__indirect__galileo,
                                abacus: year_1__current__indirect__abacus,
                                other_1: year_1__current__indirect__other_1,
                                other_2: year_1__current__indirect__other_2
                            },
                            total: year_1__current__totals
                        },
                        current_with_channel_shift: {
                            direct: {
                                total: year_1__current_with_channel_shift__direct__total,
                                call_centre: year_1__current_with_channel_shift__direct__call_centre,
                                ecommerce: year_1__current_with_channel_shift__direct__ecommerce,
                                a2a: year_1__current_with_channel_shift__direct__a2a,
                                mobile: year_1__current_with_channel_shift__direct__mobile,
                                other_1: year_1__current_with_channel_shift__direct__other_1,
                                other_2: year_1__current_with_channel_shift__direct__other_2
                            },
                            indirect: {
                                total: year_1__current_with_channel_shift__indirect__total,
                                amadeus: year_1__current_with_channel_shift__indirect__amadeus,
                                sabre: year_1__current_with_channel_shift__indirect__sabre,
                                galileo: year_1__current_with_channel_shift__indirect__galileo,
                                abacus: year_1__current_with_channel_shift__indirect__abacus,
                                other_1: year_1__current_with_channel_shift__indirect__other_1,
                                other_2: year_1__current_with_channel_shift__indirect__other_2
                            },
                            total: year_1__current_with_channel_shift__totals
                        },
                        sita: {
                            direct: {
                                total: year_1__sita__direct__total,
                                call_centre: year_1__sita__direct__call_centre,
                                ecommerce: year_1__sita__direct__ecommerce,
                                a2a: year_1__sita__direct__a2a,
                                mobile: year_1__sita__direct__mobile,
                                other_1: year_1__sita__direct__other_1,
                                other_2: year_1__sita__direct__other_2
                            },
                            indirect: {
                                total: year_1__sita__indirect__total,
                                amadeus: year_1__sita__indirect__amadeus,
                                sabre: year_1__sita__indirect__sabre,
                                galileo: year_1__sita__indirect__galileo,
                                abacus: year_1__sita__indirect__abacus,
                                other_1: year_1__sita__indirect__other_1,
                                other_2: year_1__sita__indirect__other_2
                            },
                            total: year_1__sita__totals
                        },
                        supplier_does_not_shift__difference: year_1__difference__supplier_does_not_shift,
                        supplier_shifts__difference: year_1__difference__supplier_shifts
                    },
                    year_2: {
                        current: {
                            direct: {
                                total: year_2__current__direct__total,
                                call_centre: year_2__current__direct__call_centre,
                                ecommerce: year_2__current__direct__ecommerce,
                                a2a: year_2__current__direct__a2a,
                                mobile: year_2__current__direct__mobile,
                                other_1: year_2__current__direct__other_1,
                                other_2: year_2__current__direct__other_2
                            },
                            indirect: {
                                total: year_2__current__indirect__total,
                                amadeus: year_2__current__indirect__amadeus,
                                sabre: year_2__current__indirect__sabre,
                                galileo: year_2__current__indirect__galileo,
                                abacus: year_2__current__indirect__abacus,
                                other_1: year_2__current__indirect__other_1,
                                other_2: year_2__current__indirect__other_2
                            },
                            total: year_2__current__totals
                        },
                        current_with_channel_shift: {
                            direct: {
                                total: year_2__current_with_channel_shift__direct__total,
                                call_centre: year_2__current_with_channel_shift__direct__call_centre,
                                ecommerce: year_2__current_with_channel_shift__direct__ecommerce,
                                a2a: year_2__current_with_channel_shift__direct__a2a,
                                mobile: year_2__current_with_channel_shift__direct__mobile,
                                other_1: year_2__current_with_channel_shift__direct__other_1,
                                other_2: year_2__current_with_channel_shift__direct__other_2
                            },
                            indirect: {
                                total: year_2__current_with_channel_shift__indirect__total,
                                amadeus: year_2__current_with_channel_shift__indirect__amadeus,
                                sabre: year_2__current_with_channel_shift__indirect__sabre,
                                galileo: year_2__current_with_channel_shift__indirect__galileo,
                                abacus: year_2__current_with_channel_shift__indirect__abacus,
                                other_1: year_2__current_with_channel_shift__indirect__other_1,
                                other_2: year_2__current_with_channel_shift__indirect__other_2
                            },
                            total: year_2__current_with_channel_shift__totals
                        },
                        sita: {
                            direct: {
                                total: year_2__sita__direct__total,
                                call_centre: year_2__sita__direct__call_centre,
                                ecommerce: year_2__sita__direct__ecommerce,
                                a2a: year_2__sita__direct__a2a,
                                mobile: year_2__sita__direct__mobile,
                                other_1: year_2__sita__direct__other_1,
                                other_2: year_2__sita__direct__other_2
                            },
                            indirect: {
                                total: year_2__sita__indirect__total,
                                amadeus: year_2__sita__indirect__amadeus,
                                sabre: year_2__sita__indirect__sabre,
                                galileo: year_2__sita__indirect__galileo,
                                abacus: year_2__sita__indirect__abacus,
                                other_1: year_2__sita__indirect__other_1,
                                other_2: year_2__sita__indirect__other_2
                            },
                            total: year_2__sita__totals
                        },
                        supplier_does_not_shift__difference: year_2__difference__supplier_does_not_shift,
                        supplier_shifts__difference: year_2__difference__supplier_shifts
                    },
                    year_3: {
                        current: {
                            direct: {
                                total: year_3__current__direct__total,
                                call_centre: year_3__current__direct__call_centre,
                                ecommerce: year_3__current__direct__ecommerce,
                                a2a: year_3__current__direct__a2a,
                                mobile: year_3__current__direct__mobile,
                                other_1: year_3__current__direct__other_1,
                                other_2: year_3__current__direct__other_2
                            },
                            indirect: {
                                total: year_3__current__indirect__total,
                                amadeus: year_3__current__indirect__amadeus,
                                sabre: year_3__current__indirect__sabre,
                                galileo: year_3__current__indirect__galileo,
                                abacus: year_3__current__indirect__abacus,
                                other_1: year_3__current__indirect__other_1,
                                other_2: year_3__current__indirect__other_2
                            },
                            total: year_3__current__totals
                        },
                        current_with_channel_shift: {
                            direct: {
                                total: year_3__current_with_channel_shift__direct__total,
                                call_centre: year_3__current_with_channel_shift__direct__call_centre,
                                ecommerce: year_3__current_with_channel_shift__direct__ecommerce,
                                a2a: year_3__current_with_channel_shift__direct__a2a,
                                mobile: year_3__current_with_channel_shift__direct__mobile,
                                other_1: year_3__current_with_channel_shift__direct__other_1,
                                other_2: year_3__current_with_channel_shift__direct__other_2
                            },
                            indirect: {
                                total: year_3__current_with_channel_shift__indirect__total,
                                amadeus: year_3__current_with_channel_shift__indirect__amadeus,
                                sabre: year_3__current_with_channel_shift__indirect__sabre,
                                galileo: year_3__current_with_channel_shift__indirect__galileo,
                                abacus: year_3__current_with_channel_shift__indirect__abacus,
                                other_1: year_3__current_with_channel_shift__indirect__other_1,
                                other_2: year_3__current_with_channel_shift__indirect__other_2
                            },
                            total: year_3__current_with_channel_shift__totals
                        },
                        sita: {
                            direct: {
                                total: year_3__sita__direct__total,
                                call_centre: year_3__sita__direct__call_centre,
                                ecommerce: year_3__sita__direct__ecommerce,
                                a2a: year_3__sita__direct__a2a,
                                mobile: year_3__sita__direct__mobile,
                                other_1: year_3__sita__direct__other_1,
                                other_2: year_3__sita__direct__other_2
                            },
                            indirect: {
                                total: year_3__sita__indirect__total,
                                amadeus: year_3__sita__indirect__amadeus,
                                sabre: year_3__sita__indirect__sabre,
                                galileo: year_3__sita__indirect__galileo,
                                abacus: year_3__sita__indirect__abacus,
                                other_1: year_3__sita__indirect__other_1,
                                other_2: year_3__sita__indirect__other_2
                            },
                            total: year_3__sita__totals
                        },
                        supplier_does_not_shift__difference: year_3__difference__supplier_does_not_shift,
                        supplier_shifts__difference: year_3__difference__supplier_shifts
                    },
                    year_4: {
                        current: {
                            direct: {
                                total: year_4__current__direct__total,
                                call_centre: year_4__current__direct__call_centre,
                                ecommerce: year_4__current__direct__ecommerce,
                                a2a: year_4__current__direct__a2a,
                                mobile: year_4__current__direct__mobile,
                                other_1: year_4__current__direct__other_1,
                                other_2: year_4__current__direct__other_2
                            },
                            indirect: {
                                total: year_4__current__indirect__total,
                                amadeus: year_4__current__indirect__amadeus,
                                sabre: year_4__current__indirect__sabre,
                                galileo: year_4__current__indirect__galileo,
                                abacus: year_4__current__indirect__abacus,
                                other_1: year_4__current__indirect__other_1,
                                other_2: year_4__current__indirect__other_2
                            },
                            total: year_4__current__totals
                        },
                        current_with_channel_shift: {
                            direct: {
                                total: year_4__current_with_channel_shift__direct__total,
                                call_centre: year_4__current_with_channel_shift__direct__call_centre,
                                ecommerce: year_4__current_with_channel_shift__direct__ecommerce,
                                a2a: year_4__current_with_channel_shift__direct__a2a,
                                mobile: year_4__current_with_channel_shift__direct__mobile,
                                other_1: year_4__current_with_channel_shift__direct__other_1,
                                other_2: year_4__current_with_channel_shift__direct__other_2
                            },
                            indirect: {
                                total: year_4__current_with_channel_shift__indirect__total,
                                amadeus: year_4__current_with_channel_shift__indirect__amadeus,
                                sabre: year_4__current_with_channel_shift__indirect__sabre,
                                galileo: year_4__current_with_channel_shift__indirect__galileo,
                                abacus: year_4__current_with_channel_shift__indirect__abacus,
                                other_1: year_4__current_with_channel_shift__indirect__other_1,
                                other_2: year_4__current_with_channel_shift__indirect__other_2
                            },
                            total: year_4__current_with_channel_shift__totals
                        },
                        sita: {
                            direct: {
                                total: year_4__sita__direct__total,
                                call_centre: year_4__sita__direct__call_centre,
                                ecommerce: year_4__sita__direct__ecommerce,
                                a2a: year_4__sita__direct__a2a,
                                mobile: year_4__sita__direct__mobile,
                                other_1: year_4__sita__direct__other_1,
                                other_2: year_4__sita__direct__other_2
                            },
                            indirect: {
                                total: year_4__sita__indirect__total,
                                amadeus: year_4__sita__indirect__amadeus,
                                sabre: year_4__sita__indirect__sabre,
                                galileo: year_4__sita__indirect__galileo,
                                abacus: year_4__sita__indirect__abacus,
                                other_1: year_4__sita__indirect__other_1,
                                other_2: year_4__sita__indirect__other_2
                            },
                            total: year_4__sita__totals
                        },
                        supplier_does_not_shift__difference: year_4__difference__supplier_does_not_shift,
                        supplier_shifts__difference: year_4__difference__supplier_shifts
                    },
                    year_5: {
                        current: {
                            direct: {
                                total: year_5__current__direct__total,
                                call_centre: year_5__current__direct__call_centre,
                                ecommerce: year_5__current__direct__ecommerce,
                                a2a: year_5__current__direct__a2a,
                                mobile: year_5__current__direct__mobile,
                                other_1: year_5__current__direct__other_1,
                                other_2: year_5__current__direct__other_2
                            },
                            indirect: {
                                total: year_5__current__indirect__total,
                                amadeus: year_5__current__indirect__amadeus,
                                sabre: year_5__current__indirect__sabre,
                                galileo: year_5__current__indirect__galileo,
                                abacus: year_5__current__indirect__abacus,
                                other_1: year_5__current__indirect__other_1,
                                other_2: year_5__current__indirect__other_2
                            },
                            total: year_5__current__totals
                        },
                        current_with_channel_shift: {
                            direct: {
                                total: year_5__current_with_channel_shift__direct__total,
                                call_centre: year_5__current_with_channel_shift__direct__call_centre,
                                ecommerce: year_5__current_with_channel_shift__direct__ecommerce,
                                a2a: year_5__current_with_channel_shift__direct__a2a,
                                mobile: year_5__current_with_channel_shift__direct__mobile,
                                other_1: year_5__current_with_channel_shift__direct__other_1,
                                other_2: year_5__current_with_channel_shift__direct__other_2
                            },
                            indirect: {
                                total: year_5__current_with_channel_shift__indirect__total,
                                amadeus: year_5__current_with_channel_shift__indirect__amadeus,
                                sabre: year_5__current_with_channel_shift__indirect__sabre,
                                galileo: year_5__current_with_channel_shift__indirect__galileo,
                                abacus: year_5__current_with_channel_shift__indirect__abacus,
                                other_1: year_5__current_with_channel_shift__indirect__other_1,
                                other_2: year_5__current_with_channel_shift__indirect__other_2
                            },
                            total: year_5__current_with_channel_shift__totals
                        },
                        sita: {
                            direct: {
                                total: year_5__sita__direct__total,
                                call_centre: year_5__sita__direct__call_centre,
                                ecommerce: year_5__sita__direct__ecommerce,
                                a2a: year_5__sita__direct__a2a,
                                mobile: year_5__sita__direct__mobile,
                                other_1: year_5__sita__direct__other_1,
                                other_2: year_5__sita__direct__other_2
                            },
                            indirect: {
                                total: year_5__sita__indirect__total,
                                amadeus: year_5__sita__indirect__amadeus,
                                sabre: year_5__sita__indirect__sabre,
                                galileo: year_5__sita__indirect__galileo,
                                abacus: year_5__sita__indirect__abacus,
                                other_1: year_5__sita__indirect__other_1,
                                other_2: year_5__sita__indirect__other_2
                            },
                            total: year_5__sita__totals
                        },
                        supplier_does_not_shift__difference: year_5__difference__supplier_does_not_shift,
                        supplier_shifts__difference: year_5__difference__supplier_shifts
                    },
                    total__supplier_does_not_shift__difference: total__difference__supplier_does_not_shift,
                    total__supplier_shifts__difference: total__difference__supplier_shifts
                }
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {

                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op3) {
                    allData.channel_shift.high = 0;
                    allData.channel_shift.low = 0;
                    allData.channel_shift.summary = {};
                    return;
                }
                allData.channel_shift.high = this.result('high');
                allData.channel_shift.low = this.result('low');

                allData.channel_shift.summary = {
                    name: "Channel Shift"
                }
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                if (value === 'high') {
                    return Math.round((this.costs().total__supplier_does_not_shift__difference / inputData.adjustment) / 5);
                }
                return Math.round((this.costs().total__supplier_shifts__difference / inputData.adjustment) / 5);
            }
        }

    })

    .factory('ancillarySales', function (inputData, allData, channelShift) {
        return {

            /**
             * Constants
             *
             * These are percentages and divided by 100 to get point value to multiply by.
             */
            MISC_PERCENTAGE_1_HIGH: 0.04, // [summary] B26
            MISC_PERCENTAGE_1_LOW: 0.02, // [summary] C26
            PERCENTAGES: {
                ECOMMERCE: {
                    Y1: 0.3 / 100,
                    Y2: 0.4 / 100,
                    Y3: 0.6 / 100,
                    Y4: 0.8 / 100,
                    Y5: 0.8 / 100
                },
                CALL_CENTRE: {
                    Y1: 0.02 / 100,
                    Y2: 0.08 / 100,
                    Y3: 0.12 / 100,
                    Y4: 0.15 / 100,
                    Y5: 0.15 / 100
                },
                MOBILE: {
                    Y1: 0.02 / 100,
                    Y2: 0.08 / 100,
                    Y3: 0.12 / 100,
                    Y4: 0.15 / 100,
                    Y5: 0.15 / 100
                }
            },

            /* Calculation Functions */
            ecommerceRevenueY1: function () { // [Ancillary sales] C4.
                return parseInt(Math.round(inputData.param6 * channelShift.direct().ecommerce.year_1.perc_pax_boarded), 10); // ([channel shift]:G7)
            },
            ecommerceRevenueY2: function () { // [Ancillary sales] E4.
                return parseInt(Math.round(inputData.param6 * channelShift.direct().ecommerce.year_2.perc_pax_boarded), 10); // ([channel shift]:K7)
            },
            ecommerceRevenueY3: function () { // [Ancillary sales] G4.
                return parseInt(Math.round(inputData.param6 * channelShift.direct().ecommerce.year_3.perc_pax_boarded), 10); // ([channel shift]:O7)
            },
            ecommerceRevenueY4: function () { // [Ancillary sales] I4.
                return parseInt(Math.round(inputData.param6 * channelShift.direct().ecommerce.year_4.perc_pax_boarded), 10); // ([channel shift]:S7)
            },
            ecommerceRevenueY5: function () { // [Ancillary sales] K4.
                return parseInt(Math.round(inputData.param6 * channelShift.direct().ecommerce.year_5.perc_pax_boarded), 10); // ([channel shift]:W7)
            },

            callCentreRevenueY1: function () { // [Ancillary sales] C4.
                return inputData.param6 * channelShift.direct().call_centre.year_1.perc_pax_boarded; // ([channel shift]:G6)
            },
            callCentreRevenueY2: function () { // [Ancillary sales] E4.
                return inputData.param6 * channelShift.direct().call_centre.year_2.perc_pax_boarded; // ([channel shift]:K6)
            },
            callCentreRevenueY3: function () { // [Ancillary sales] G4.
                return inputData.param6 * channelShift.direct().call_centre.year_3.perc_pax_boarded; // ([channel shift]:O6)
            },
            callCentreRevenueY4: function () { // [Ancillary sales] I4.
                return inputData.param6 * channelShift.direct().call_centre.year_4.perc_pax_boarded; // ([channel shift]:S6)
            },
            callCentreRevenueY5: function () { // [Ancillary sales] K4.
                return inputData.param6 * channelShift.direct().call_centre.year_5.perc_pax_boarded; // ([channel shift]:W6)
            },

            /**
             * Function to get the calculations for each year and then return year object
             * @param year
             * @param val
             * @returns {{ecommerce: , call_centre: , mobile: , total: *}}
             */
            salesYear: function (year, val) {

                var misc_percentage_1 = 0;
                if (val === 'high') {
                    misc_percentage_1 = this.MISC_PERCENTAGE_1_HIGH;
                } else {
                    misc_percentage_1 = this.MISC_PERCENTAGE_1_LOW;
                }

                var ecommerceRevenue,
                    callCentreRevenue,
                    ecommerceSalesPercentage,
                    callCentreSalesPercentage,
                    mobileSalesPercentage;

                switch (year) {
                    case 1 :
                        ecommerceRevenue = this.ecommerceRevenueY1();
                        callCentreRevenue = this.callCentreRevenueY1();
                        ecommerceSalesPercentage = this.PERCENTAGES.ECOMMERCE.Y1;
                        callCentreSalesPercentage = this.PERCENTAGES.CALL_CENTRE.Y1;
                        mobileSalesPercentage = this.PERCENTAGES.MOBILE.Y1;
                        break;
                    case 2 :
                        ecommerceRevenue = this.ecommerceRevenueY2();
                        callCentreRevenue = this.callCentreRevenueY2();
                        ecommerceSalesPercentage = this.PERCENTAGES.ECOMMERCE.Y2;
                        callCentreSalesPercentage = this.PERCENTAGES.CALL_CENTRE.Y2;
                        mobileSalesPercentage = this.PERCENTAGES.MOBILE.Y2;
                        break;
                    case 3 :
                        ecommerceRevenue = this.ecommerceRevenueY3();
                        callCentreRevenue = this.callCentreRevenueY3();
                        ecommerceSalesPercentage = this.PERCENTAGES.ECOMMERCE.Y3;
                        callCentreSalesPercentage = this.PERCENTAGES.CALL_CENTRE.Y3;
                        mobileSalesPercentage = this.PERCENTAGES.MOBILE.Y3;
                        break;
                    case 4 :
                        ecommerceRevenue = this.ecommerceRevenueY4();
                        callCentreRevenue = this.callCentreRevenueY4();
                        ecommerceSalesPercentage = this.PERCENTAGES.ECOMMERCE.Y4;
                        callCentreSalesPercentage = this.PERCENTAGES.CALL_CENTRE.Y4;
                        mobileSalesPercentage = this.PERCENTAGES.MOBILE.Y4;
                        break;
                    case 5 :
                        ecommerceRevenue = this.ecommerceRevenueY5();
                        callCentreRevenue = this.callCentreRevenueY5();
                        ecommerceSalesPercentage = this.PERCENTAGES.ECOMMERCE.Y5;
                        callCentreSalesPercentage = this.PERCENTAGES.CALL_CENTRE.Y5;
                        mobileSalesPercentage = this.PERCENTAGES.MOBILE.Y5;
                        break;
                }

                var calculation = function (revenue, percentage_1, percentage_2) {
                    return revenue * percentage_1 * percentage_2
                };

                var ecommerceSales = calculation(ecommerceRevenue, misc_percentage_1, ecommerceSalesPercentage),
                    callCentreSales = calculation(callCentreRevenue, misc_percentage_1, callCentreSalesPercentage),
                    mobileSales = calculation(0, misc_percentage_1, mobileSalesPercentage);

                var totals = ecommerceSales + callCentreSales + mobileSales;

                return {
                    ecommerce: {
                        name: 'Ecommerce',
                        unit: "currency",
                        value: Math.round(ecommerceSales)
                    },
                    call_centre: {
                        name: 'Call centre',
                        unit: "currency",
                        value: Math.round(callCentreSales)
                    },
                    mobile: {
                        name: 'Mobile',
                        unit: "currency",
                        value: Math.round(mobileSales)
                    },
                    total: {
                        name: 'Total',
                        unit: "currency",
                        value: Math.round(totals)
                    }
                }
            },

            /**
             * Build the years object
             * @returns {{year_1: {high: *, low: *}, year_2: {high: *, low: *}, year_3: {high: *, low: *}, year_4: {high: *, low: *}, year_5: {high: *, low: *}}}
             */
            ancillarySalesRevenueYears: function () {
                return {
                    year_1: {
                        name: 'Year 1',
                        high: this.salesYear(1, 'high'),
                        low: this.salesYear(1, 'low')
                    },
                    year_2: {
                        name: 'Year 2',
                        high: this.salesYear(2, 'high'),
                        low: this.salesYear(2, 'low')
                    },
                    year_3: {
                        name: 'Year 3',
                        high: this.salesYear(3, 'high'),
                        low: this.salesYear(3, 'low')
                    },
                    year_4: {
                        name: 'Year 4',
                        high: this.salesYear(4, 'high'),
                        low: this.salesYear(4, 'low')
                    },
                    year_5: {
                        name: 'Year 5',
                        high: this.salesYear(5, 'high'),
                        low: this.salesYear(5, 'low')
                    }
                }
            },

            /**
             * Calculates the final totals for high and low values
             * @returns {{high: *, low: *}}
             */
            ancillarySalesRevenueTotals: function () {
                var sales = this.ancillarySalesRevenueYears(),
                    total_high = sales.year_1.high.total.value + sales.year_2.high.total.value + sales.year_3.high.total.value + sales.year_4.high.total.value + sales.year_5.high.total.value,
                    total_low = sales.year_1.low.total.value + sales.year_2.low.total.value + sales.year_3.low.total.value + sales.year_4.low.total.value + sales.year_5.low.total.value;

                return {
                    high: total_high,
                    low: total_low
                }
            },

            /**
             * Builds final object
             * @returns {{years: {}, totals: {}}}
             */
            ancillarySalesRevenue: function () {
                var newObj = {
                    years: {},
                    totals: {}
                };
                newObj.years = this.ancillarySalesRevenueYears();
                newObj.totals = this.ancillarySalesRevenueTotals();
                return newObj;
            },

            chartValue: function (value) {
                var result;
                if (value === 'high') {
                    result = this.ancillarySalesRevenue().totals.high;
                } else {
                    result = this.ancillarySalesRevenue().totals.low;
                }
                return result;
            },

            /**
             * allData
             *
             * Writes data to allData object
             */
            initObject: function () {
                // If option is not selected then return empty object with default values (0)
                if (inputData.services && !inputData.services.op4) {
                    allData.ancillary_sales.high = 0;
                    allData.ancillary_sales.low = 0;
                    allData.ancillary_sales.summary = {};
                    return;
                }

                allData.ancillary_sales.high = this.result('high');
                allData.ancillary_sales.low = this.result('low');
                allData.ancillary_sales.summary = this.ancillarySalesRevenue();
            },

            /**
             * Resulting value
             *
             * @param value : value is 'high' or 'low'.
             * @returns {number}
             */
            result: function (value) {
                return Math.round((this.chartValue(value) / inputData.adjustment) / 5);
            }
        }
    });