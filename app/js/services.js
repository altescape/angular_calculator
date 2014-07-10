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
        info: localStorageService.get('info')
            ? localStorageService.get('info')
            : {}
      }
    }).

  /* Init factory for chart objects */
    factory('ChartInitFctry',function (localStorageService) {
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
    factory('ServicesBuilderFcty',function () {
      return [
        {"name": "Revenue Integrity"},
        {"name": "Revenue Integrity process improvement"},
        {"name": "Channel Shift"},
        {"name": "Ancillary sales"},
        {"name": "CMAP"}
      ]
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