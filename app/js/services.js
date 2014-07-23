'use strict';

/* Services */

angular.module('myApp.services', [])

		.factory('infoData', function (localStorageService) {
			/**
			 *  Information object that holds user and session objects.
			 *  These objects hold meta data about the user and session such
			 *  as name, airline name, etc.
			 */
			return {
				info : localStorageService.get('info') ? localStorageService.get('info') : {}
			}
		})

		.factory('inputData', function (localStorageService) {
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
		})

		.factory('chartConfig', function ($rootScope, chartData, $state) {
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
										color : 'black'
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
		})

		.factory('chartData', function (localStorageService) {
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
							name : 'Revenue Integrity',
							value : 0
						},
						revenue_integrity_process_improvement : {
							name : 'Revenue Integrity Process Improvement',
							value : 0
						},
						channel_shift : {
							name : 'Channel Shift',
							value : 0
						},
						ancillary_sales : {
							name : 'Ancillary Sales',
							value : 0
						},
						cmap : {
							name : 'CMAP',
							value : 0
						},
						o_and_d : {
							name : 'O & D',
							value : 0
						},
						pos : {
							name : 'POS',
							value : 0
						},
						arr : {
							name : 'ARR',
							value : 0
						},
						insight : {
							name : 'Insight',
							value : 0
						}
					},
					low : {
						revenue_integrity : {
							name : 'Revenue Integrity',
							value : 0
						},
						revenue_integrity_process_improvement : {
							name : 'Revenue Integrity Process Improvement',
							value : 0
						},
						channel_shift : {
							name : 'Channel Shift',
							value : 0
						},
						ancillary_sales : {
							name : 'Ancillary Sales',
							value : 0
						},
						cmap : {
							name : 'CMAP',
							value : 0
						},
						o_and_d : {
							name : 'O & D',
							value : 0
						},
						pos : {
							name : 'POS',
							value : 0
						},
						arr : {
							name : 'ARR',
							value : 0
						},
						insight : {
							name : 'Insight',
							value : 0
						}
					}
				}
			}
		})

		.factory('FbService', ['$firebase', function ($firebase) {
			/**
			 * Firebase
			 */
			var ref = new Firebase('https://luminous-fire-1327.firebaseio.com/sita');
			return $firebase(ref);
		}])

		.factory('FbService2', ['$firebase', function ($firebase) {
			/**
			 * Firebase 2
			 */
			var ref = new Firebase('https://luminous-fire-1327.firebaseio.com/text');
			return $firebase(ref);
		}])

		.factory('allData', function () {
			return {
				revenue_integrity : {
					name : "Revenue integrity",
					high : 0,
					low : 0
				},
				revenue_integrity_process_improvement : {
					name : "Revenue Integrity Process Improvement",
					high : 0,
					low : 0,
					summary : {}
				},
				cmap : {
					name : "Weight and Balance",
					high : 0,
					low : 0,
					summary : {}
				},
				origin_and_destination : {
					name : "Origin and Destination",
					high: 0,
					low : 0,
					summary : {}
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
				REAL_TIME_HIGH : 2 / 100, // [Revenue Integrity]:C10
				REAL_TIME_LOW : 1 / 100,	// [Revenue Integrity]:D10
				COST_SAVING_HIGH : 5 / 100,	// [Revenue Integrity]:C8
				COST_SAVING_LOW : 3 / 100,	// [Revenue Integrity]:D8
				REVENUE_IMPROVEMENT_HIGH : 1 / 100,	// [Revenue Integrity]:C6
				REVENUE_IMPROVEMENT_LOW : 0.1 / 100,	// [Revenue Integrity]:D6

				real_time : function (value) {
					if ( value === 'low' ) return this.REAL_TIME_LOW;
					return this.REAL_TIME_HIGH;
				},

				cost_saving : function (value) {
					if ( value === 'low' ) return this.COST_SAVING_LOW;
					return this.COST_SAVING_HIGH;
				},

				revenue_improvement : function (value) {
					if ( value === 'low' ) return this.REVENUE_IMPROVEMENT_LOW;
					return this.REVENUE_IMPROVEMENT_HIGH;
				},

				/**
				 * Writes data to allData object
				 */
				writeToObj : function () {
					allData.revenue_integrity.high = this.result();
					allData.revenue_integrity.low = this.result('low');
				},

				/**
				 * Resulting value
				 *
				 * @param value : value is 'high' or 'low'.
				 * @returns {number}
				 */
				result : function (value) {
					return Math.round(( (this.real_time(value) * inputData.cal.param6) + (this.cost_saving(value) * (inputData.cal.param7 * inputData.cal.param8 / 100)) + (this.revenue_improvement(value) * inputData.cal.param6) ) / inputData.cal.adjustment);
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
				CURRENT_PB_LIVE_IN_SYSTEM : 3.6 / 100,	// [Revenue Integrity]:C17
				MISC_CONST_1 : 1.8,	// [Revenue Integrity]:C20
				MISC_CONST_2 : 1.6,	// [Revenue Integrity]:C21
				CANCEL_1 : 0.0034 / 100,	// [Revenue Integrity]:G30
				QUEUE : 2.4916 / 100,	// [Revenue Integrity]:G31
				APPLY_TTL : 23.0518 / 100,	// [Revenue Integrity]:G32
				CANCEL_2 : 2.3052 / 100,	// [Revenue Integrity]:G33
				CANCEL_3 : 0.1330 / 100,	// [Revenue Integrity]:G34
				CANCEL_4 : 1.0752 / 100,	// [Revenue Integrity]:G35
				CANCEL_5 : 0.0012 / 100,	// [Revenue Integrity]:G36
				CANCEL_6 : 5.4547 / 100,	// [Revenue Integrity]:G37
				CANCEL_7 : 0.6698 / 100,	// [Revenue Integrity]:G38
				MISC_CONST_3 : 10 / 100,	// [Revenue Integrity]:C40
				MISC_CONST_4 : (10 / 100) / 2,	// [Revenue Integrity]:D40
				MISC_CONST_5 : 12,	// [Revenue Integrity]:C44
				MISC_CONST_6 : 3 / 100,	// [Revenue Integrity]:C46
				MISC_CONST_7 : 0.2,	// [Revenue Integrity]:C51
				MISC_CONST_8 : 0.1,	// [Revenue Integrity]:D51
				MISC_CONST_9 : 450,	// [Revenue Integrity]:C48
				MISC_CONST_10 : 2,	// [Revenue Integrity]:C56

				pnrs : function () {	// REF 1 | [Revenue Integrity]:C19/D19
					return Math.round(inputData.cal.param1 * this.CURRENT_PB_LIVE_IN_SYSTEM)
				},
				segments : function () {  // REF 2 | [Revenue Integrity]:C20/D20
					return this.pnrs() * this.MISC_CONST_1;
				},
				passengers : function () {	// REF 3 | [Revenue Integrity]:C21/D21
					return this.pnrs() * this.MISC_CONST_2;
				},
				av_psj_per_pnr : function () {	// REF 4 | [Revenue Integrity]:C22/D22
					return parseFloat(this.segments() / this.pnrs() * this.passengers() / this.pnrs()).toFixed(2);
				},
				psj : function () {	// REF 5 | [Revenue Integrity]:C23/D23
					return Math.round(this.av_psj_per_pnr() * this.pnrs());
				},
				total_checks : function (value) {	// REF 6 | [Revenue Integrity]:C39/D39
					var g30 = this.psj(value) * this.CANCEL_1,
							g31 = this.psj(value) * this.QUEUE,
							g32 = this.psj(value) * this.APPLY_TTL,
							g33 = this.psj(value) * this.CANCEL_2,
							g34 = this.psj(value) * this.CANCEL_3,
							g35 = this.psj(value) * this.CANCEL_4,
							g36 = this.psj(value) * this.CANCEL_5,
							g37 = this.psj(value) * this.CANCEL_6,
							g38 = this.psj(value) * this.CANCEL_7;

					if ( value === 'low' ) {
						g30 = g30 / 2;
						g31 = g31 / 2;
						g32 = g32 / 2;
						g33 = g33 / 2;
						g34 = g34 / 2;
						g35 = g35 / 2;
					}

					return Math.round(g30 + g31 + g32 + g33 + g34 + g35 + g36 + g37 + g38);
				},
				seats_resold : function (value) {	// REF 7 | [Revenue Integrity]:C41/D41
					if ( value === 'low' ) return Math.round(this.MISC_CONST_4 * this.total_checks(value));
					return Math.round(this.MISC_CONST_3 * this.total_checks(value));
				},
				additional_revenue : function (value) {	// REF 8 | [Revenue Integrity]:C43/D43
					return Math.round(inputData.cal.param9 * this.seats_resold(value));
				},
				annual_additional_revenue : function (value) {	// REF 9 | [Revenue Integrity]:C44/D44
					return this.additional_revenue(value) * this.MISC_CONST_5;
				},
				no_show_per_annum : function () {	// REF 10 | [Revenue Integrity]:C47/D47
					return Math.round(this.MISC_CONST_6 * inputData.cal.param1);
				},
				no_shows_avoided : function (value) {	// REF 11 | [Revenue Integrity]:C52/D52
					if ( value === 'low' ) return this.no_show_per_annum() * this.MISC_CONST_8;
					return this.no_show_per_annum() * this.MISC_CONST_7;
				},
				gds_cost_reduction : function (value) {	// REF 12 | [Revenue Integrity]:C53/D53
					return this.MISC_CONST_9 * this.no_shows_avoided(value);
				},
				process_improvement : function (value) {	// REF 13 | [Revenue Integrity]:C56/D56
					return Math.round(this.annual_additional_revenue(value) + this.gds_cost_reduction(value) / this.MISC_CONST_10);
				},

				/**
				 * Writes data to allData object
				 */
				writeToObj : function () {
					allData.revenue_integrity_process_improvement.high = this.result();
					allData.revenue_integrity_process_improvement.low = this.result('low');

					allData.revenue_integrity_process_improvement.summary = {
						pnrs : {
							name : "PNRS",
							high : this.pnrs(),
							low : this.pnrs()
						},
						segments : {
							name : "Segments",
							high : this.segments(),
							low : this.segments()
						},
						passengers : {
							name : "Passengers",
							high : this.passengers(),
							low : this.passengers()
						},
						av_psj_per_pnr : {
							name : "Average PSJ per PNR",
							high : this.av_psj_per_pnr(),
							low : this.av_psj_per_pnr()
						},
						psj : {
							name : "PSJ",
							high : this.psj(),
							low : this.psj()
						},
						total_checks : {
							name : "Total",
							high : this.total_checks(),
							low : this.total_checks('low')
						},
						seats_resold : {
							name : "Seats resold",
							high : this.seats_resold(),
							low : this.seats_resold('low')
						},
						additional_revenue : {
							name : "Additional revenue",
							high : this.additional_revenue(),
							low : this.additional_revenue('low')
						},
						annual_additional_revenue : {
							name : "Annual additional revenue",
							high : this.annual_additional_revenue(),
							low : this.annual_additional_revenue('low')
						},
						no_show_per_annum : {
							name : "No show per annum",
							high : this.no_show_per_annum(),
							low : this.no_show_per_annum('low')
						},
						no_shows_avoided : {
							name : "No shows avoided",
							high : this.no_shows_avoided(),
							low : this.no_shows_avoided('low')
						},
						gds_cost_reduction : {
							name : "GDS cost reduction",
							high : this.gds_cost_reduction(),
							low : this.gds_cost_reduction('low')
						},
						process_improvement : {
							name : "Process improvement",
							high : this.process_improvement(),
							low : this.process_improvement('low')
						}
					};
				},

				/**
				 * Resulting value
				 *
				 * @param value : value is 'high' or 'low'.
				 * @returns {number}
				 */
				result : function (value) {
					return Math.round(this.process_improvement(value) / inputData.cal.adjustment);
				}
			}
		})

		.factory('cmap', function (inputData, allData) {
			return {

				/**
				 * Constants
				 *
				 * These are percentages and divided by 100 to get point value to multiply by.
				 */
				MISC_CONST_1 : 0.5 / 100,
				MISC_CONST_2 : 0.25 / 100,
				MISC_CONST_3 : 1 / 100,
				MISC_CONST_4 : 0.5 / 100,

				fuel_cost : function () {  // REF 14 | [Weight and Balance]:C3
					return Math.round((inputData.cal.param10 / 100) * inputData.cal.param7);
				},

				cmap_savings : function (value) {  // REF 15 | [Weight and Balance]:C5/D5
					if ( value === 'low' ) return this.fuel_cost() * this.MISC_CONST_2;
					return this.fuel_cost() * this.MISC_CONST_1;
				},

				portable_water : function (value) {  // REF 16 | [Weight and Balance]:C6/D6
					if ( value === 'low' ) return this.cmap_savings(value) * this.MISC_CONST_4;
					return this.fuel_cost() * this.MISC_CONST_3;
				},

				/**
				 * Writes data to allData object
				 */
				writeToObj : function () {
					allData.cmap.high = this.result();
					allData.cmap.low = this.result('low');

					allData.cmap.fuel_cost = {
						name : "Fuel cost",
						value : this.fuel_cost()
					};

					allData.cmap.summary = {
						cmap_savings : {
							name : "CMAP savings",
							high : this.cmap_savings(),
							low : this.cmap_savings('low')
						},
						portable_water : {
							name : "Portable water",
							high : this.portable_water(),
							low : this.portable_water('low')
						}
					}
				},

				/**
				 * Resulting value
				 *
				 * @param value : value is 'high' or 'low'.
				 * @returns {number}
				 */
				result : function (value) {
					return Math.round(this.cmap_savings(value) / inputData.cal.adjustment);
				}

			}
		})

		.factory('originAndDestination', function (inputData, allData) {
			return {

				/**
				 * Constants
				 *
				 * These are percentages and divided by 100 to get point value to multiply by.
				 */
				MISC_CONST_1 : 2 / 100,
				MISC_CONST_2 : 1 / 100,

				revenue : function () {
					return inputData.cal.param6;
				},

				os_impact : function (value) {
					if (value === 'low') return this.revenue() * this.MISC_CONST_2;
					return this.revenue() * this.MISC_CONST_1;
				},

				/**
				 * Writes data to allData object
				 */
				writeToObj : function () {
					allData.origin_and_destination.high = this.result('high');
					allData.origin_and_destination.low = this.result('low');

					allData.origin_and_destination.revenue = this.revenue();

					allData.origin_and_destination.summary = {
						os_impact : {
							name: "O&S Impact",
							high : this.os_impact('high'),
							low : this.os_impact('low')
						}
					};

				},

				/**
				 * Resulting value
				 *
				 * @param value : value is 'high' or 'low'.
				 * @returns {number}
				 */
				result : function (value) {
					return Math.round(this.os_impact(value) /  inputData.cal.adjustment);
				}
			}
		});