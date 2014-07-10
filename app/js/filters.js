/**
 * Created by michaelwatts
 * Date: 08/07/2014
 * Time: 15:16
 */

'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('reverse', function() {
      function toArray(list) {
        var k, out = [];
        if( list ) {
          if( angular.isArray(list) ) {
            out = list;
          }
          else if( typeof(list) === 'object' ) {
            for (k in list) {
              if (list.hasOwnProperty(k)) { out.push(list[k]); }
            }
          }
        }
        return out;
      }
      return function(items) {
        return toArray(items).slice().reverse();
      };
    });