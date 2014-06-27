/**
 * Created by michaelwatts
 * Date: 24/06/2014
 * Time: 09:24
 */

'use strict';

/* Directives */


angular.module('myApp.directives', ['LocalStorageModule']).
    directive('mainNav',function () {
      return {
        restrict    : 'A',
        templateUrl : 'partials/main-nav.html',
        controller  : function ($scope) {

          $scope.settings = {
            disable        : 'right',
            hyperextensible: false,
            transitionSpeed: 0.3,
            easing         : 'ease'
          };

          $scope.snapper = new Snap({
            element: document.getElementById('main-content')
          });

          $scope.snapper.settings($scope.settings);

          $scope.openLeft = function () {
            if ($scope.snapper.state().state == "left") {
              $scope.snapper.close();
            } else {
              $scope.snapper.open('left');
            }
          };

        },
        controllerAs: 'mainNav'
      };
    }).
    directive("snapDrawLeft",function () {
      return {
        restrict   : "A",
        templateUrl: "partials/snap-draw-left.html"
      }
    }).
    directive('integer', function () {
      return {
        require: 'ngModel',
        link   : function (scope, ele, attr, ctrl) {
          ctrl.$parsers.unshift(function (viewValue) {
            return parseInt(viewValue);
          });
        }
      };
    });