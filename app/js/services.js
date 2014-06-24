/**
 * Created by michaelwatts
 * Date: 24/06/2014
 * Time: 10:22
 */

'use strict';

/* Services */

angular.module('myApp.services', []).
	/* Information factory to build user and session objects */
	factory('InfoFctry', function (localStorageService) {
		return {
			"user"   : {
				"name": localStorageService.get('user') && localStorageService.get('user').name
					? localStorageService.get('user').name
					: ""
			},
			"session": {
				"name": localStorageService.get('session') && localStorageService.get('session').name
					? localStorageService.get('session').name
					: ""
			}
		}
	}).

	/* Init factory for chart objects */
	factory('ChartInitFctry', function (localStorageService) {
		return {
			"cal"   : localStorageService.get('cal')
				? localStorageService.get('cal')
				: {
				"services": {
					"op1": 0,
					"op2": 0,
					"op3": 0,
					"op4": 0,
					"op5": 0
				},
				"param1"  : 1000000,
				"param2"  : 50,
				"param3"  : 0,
				"param4"  : 0,
				"param5"  : 0
			},
			"colors": function () {
				{
					return angular.forEach(Highcharts.getOptions().colors, function (value, key) {
						key : value[key];
					})
				}
			}
		}
	}).

	/* Data builder factory for chart objects and inputs */
	factory('ServicesBuilderFcty', function () {
		return [
			{"name": "Revenue Integrity"},
			{"name": "Revenue Integrity process improvement"},
			{"name": "Channel Shift"},
			{"name": "Ancillary sales"},
			{"name": "CMAP"}
		]
	}).

	/* Saved sessions factory */
	factory('SessionsFcty', function () {
		return {
			0: {
				"name"       : "John Doe",
				"session"    : "Session 1",
				"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt lectus orci, elementum pulvinar nunc ultricies blandit. Maecenas euismod eleifend euismod.",
				"date"       : "Tuesday, 12th May 2014, 12:33:05",
				"data"       : {
					"services": {"op1": "1", "op2": "1", "op3": "1", "op4": "1", "op5": "1"},
					"param1"  : 1000000,
					"param2"  : 1.2,
					"param3"  : 50000,
					"param4"  : 2,
					"param5"  : 7
				}
			},
			1: {
				"name"       : "John Doe",
				"session"    : "Session 2",
				"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt lectus orci, elementum pulvinar nunc ultricies blandit. Maecenas euismod eleifend euismod.",
				"date"       : "Thursday, 14th May 2014, 13:33:05",
				"data"       : {
					"services": {"op1": "0", "op2": "0", "op3": "1", "op4": "0", "op5": "0"},
					"param1"  : 5000000,
					"param2"  : 1.5,
					"param3"  : 30000,
					"param4"  : 3,
					"param5"  : 8
				}
			},
			2: {
				"name"       : "John Doe",
				"session"    : "Session 3",
				"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt lectus orci, elementum pulvinar nunc ultricies blandit. Maecenas euismod eleifend euismod.",
				"date"       : "Friday, 15th May 2014, 15:33:05",
				"data"       : {
					"services": {"op1": "1", "op2": "0", "op3": "1", "op4": "1", "op5": "0"},
					"param1"  : 77000000,
					"param2"  : 1.8,
					"param3"  : 70000,
					"param4"  : 1.8,
					"param5"  : 6
				}
			},
			3: {
				"name"       : "John Doe",
				"session"    : "Session 4",
				"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt lectus orci, elementum pulvinar nunc ultricies blandit. Maecenas euismod eleifend euismod.",
				"date"       : "Friday, 15th May 2014, 16:33:05",
				"data"       : {
					"services": {"op1": "0", "op2": "1", "op3": "1", "op4": "1", "op5": "0"},
					"param1"  : 47000000,
					"param2"  : 1.8,
					"param3"  : 70000,
					"param4"  : 1.8,
					"param5"  : 6
				}
			},
			4: {
				"name"       : "John Doe",
				"session"    : "Session 5",
				"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tincidunt lectus orci, elementum pulvinar nunc ultricies blandit. Maecenas euismod eleifend euismod.",
				"date"       : "Friday, 15th May 2014, 15:33:05",
				"data"       : {
					"services": {"op1": "0", "op2": "1", "op3": "1", "op4": "1", "op5": "0"},
					"param1"  : 47000000,
					"param2"  : 1.8,
					"param3"  : 70000,
					"param4"  : 1.8,
					"param5"  : 6
				}
			}
		};
	}).

    /* Firebase */
    factory("FbService", ["$firebase", function($firebase) {
      var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/sita");
      return $firebase(ref);
    }]).

    /* Firebase 2 */
    factory("FbService2", ["$firebase", function($firebase) {
      var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/text");
      return $firebase(ref);
    }]);