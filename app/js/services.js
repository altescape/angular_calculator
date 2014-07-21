'use strict';

/* Services */

angular.module('myApp.services', []).

		factory('InfoFctry',function (localStorageService) {
			/**
			 *	Information object that holds user and session objects.
			 *	These objects hold meta data about the user and session such
			 *	as name, airline name, etc.
			 */
			return {
				info : localStorageService.get('info') ? localStorageService.get('info') : {}
			}
		}).

		factory('ChartInitFctry',function (localStorageService) {
			/**
			 * Default values for inputs.
			 * If it's a new session then these are the default values
			 * that are entered into the input fields.
			 */
			return {
				"cal" : localStorageService.get('cal') ? localStorageService.get('cal') :
				{
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
				},

				// Not used but keeping as might be useful later
				"colors" : function () {
					{
						return angular.forEach(Highcharts.getOptions().colors, function (value, key) {
							key : value[key];
						})
					}
				}
			}
		}).

		factory('ChartDraw',function ($rootScope, ChartData, $state) {
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
			return {

				numbers : {},
				title : "",

				chartConfigPie : {
					options : {
						chart : {
							type : 'pie',
							backgroundColor : 'rgba(255, 255, 255, 0)',
							plotBackgroundColor : 'rgba(255, 255, 255, 0)'
						},
						plotOptions : {
							series : {
								animation : true
							},
							pie : {
								allowPointSelect : true,
								cursor : 'pointer',
								dataLabels : {
									enabled : true,
									formatter : function () {
										if ( this.y != 0 ) {
											return '<b>' + this.point.name + '</b>: ' + this.point.y;
										} else {
											return null;
										}
									},
									style : {
										color: 'black'
									}
								}
							}
						},
						tooltip : {
							pointFormat : '<b>{point.y}</b>'
						}
					},
					title : {
						text : 0
					},
					credits : {
						enabled : false
					},
					series : [
						{
							name : 'High',
							data : []
						}
					],
					yAxis : {
						min : 0,
						labels : {
							overflow : 'justify'
						}
					}
				}
			}
		}).

		factory('ChartData',function (localStorageService) {
			/**
			 * Summary object where default values for service options are stored.
			 * Creates an object and saves to localstorage with key called 'ls.summary'.
			 * The values are then added to this object when services are chosen.
			 *
			 * Note: There are places where summary is used - will clarify where these are.
			 */
			return {
				summary : localStorageService.get('summary')
						? localStorageService.get('summary')
						: {
					high : {
						revenue_integrity : {
							name: 'Revenue Integrity',
							value: 0
						},
						revenue_integrity_process_improvement : {
							name: 'Revenue Integrity Process Improvement',
							value: 0
						},
						channel_shift : {
							name: 'Channel Shift',
							value: 0
						},
						ancillary_sales : {
							name: 'Ancillary Sales',
							value: 0
						},
						cmap : {
							name: 'CMAP',
							value: 0
						},
						o_and_d : {
							name: 'O & D',
							value: 0
						},
						pos : {
							name: 'POS',
							value: 0
						},
						arr : {
							name: 'ARR',
							value: 0
						},
						insight : {
							name: 'Insight',
							value: 0
						}
					},
					low : {
						revenue_integrity : {
							name: 'Revenue Integrity',
							value: 0
						},
						revenue_integrity_process_improvement : {
							name: 'Revenue Integrity Process Improvement',
							value: 0
						},
						channel_shift : {
							name: 'Channel Shift',
							value: 0
						},
						ancillary_sales : {
							name: 'Ancillary Sales',
							value: 0
						},
						cmap : {
							name: 'CMAP',
							value: 0
						},
						o_and_d : {
							name: 'O & D',
							value: 0
						},
						pos : {
							name: 'POS',
							value: 0
						},
						arr : {
							name: 'ARR',
							value: 0
						},
						insight : {
							name: 'Insight',
							value: 0
						}
					}
				}
			}
		}).

		factory("FbService", ["$firebase", function ($firebase) {
			/**
			 * Firebase
			 */
			var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/sita");
			return $firebase(ref);
		}]).

		factory("FbService2", ["$firebase", function ($firebase) {
			/**
			 * Firebase 2
			 */
			var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/text");
			return $firebase(ref);
		}]);