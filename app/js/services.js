/**
 * Created by michaelwatts
 * Date: 24/06/2014
 * Time: 10:22
 */

'use strict';

/* Services */

angular.module('myApp.services', []).
	/* Information factory to build user and session objects */
	factory('InfoFctry',function (localStorageService) {
		return {
			info : localStorageService.get('info')
				? localStorageService.get('info')
				: {}
		}
	}).

	/* Init factory for chart objects */
	factory('ChartInitFctry',function (localStorageService) {
		return {
			"cal" : localStorageService.get('cal')
				? localStorageService.get('cal')
				: {
				"services" : {},
				"param1" : 1000000,
				"param2" : 50,
				"param3" : 0,
				"param4" : 0,
				"param5" : 0
			},
			"colors" : function () {
				{
					return angular.forEach(Highcharts.getOptions().colors, function (value, key) {
						key : value[key];
					})
				}
			}
		}
	}).

	factory('ChartData',function (localStorageService) {
		return {
			summary : localStorageService.get('summary')
				? localStorageService.get('summary')
				: {
				high : {
					revenue_integrity : 0,
					revenue_integrity_process_improvement : 0,
					channel_shift : 0,
					ancillary_sales : 0,
					cmap : 0,
					o_and_d : 0,
					pos : 0,
					reprice : 0,
					airfare_insight : 0
				},
				low : {
					revenue_integrity : 0,
					revenue_integrity_process_improvement : 0,
					channel_shift : 0,
					ancillary_sales : 0,
					cmap : 0,
					o_and_d : 0,
					pos : 0,
					reprice : 0,
					airfare_insight : 0
				}
			}
		}
	}).

	/* Firebase */
	factory("FbService", ["$firebase", function ($firebase) {
		var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/sita");
		return $firebase(ref);
	}]).

	/* Firebase 2 */
	factory("FbService2", ["$firebase", function ($firebase) {
		var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/text");
		return $firebase(ref);
	}]);