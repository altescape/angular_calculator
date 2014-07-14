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