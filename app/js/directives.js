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
				restrict : 'A',
				templateUrl : 'partials/main-nav.html',
				scope : {},
				transclude : true,
				controller : 'InfoCtrl'
			};
		}).

		directive("snapDrawLeft",function () {
			return {
				restrict : "A",
				scope : {},
				templateUrl : "partials/snap-draw-left.html",
				controller : 'InfoCtrl'
			}
		}).

		directive('navBottom', function () {
			return {
				restrict : "E",
				templateUrl : "partials/nav-bottom.html"
			}
		}).

		directive('integer',function () {
			return {
				require : 'ngModel',
				link : function (scope, ele, attr, ctrl) {
					ctrl.$parsers.unshift(function (viewValue) {
						return parseInt(viewValue);
					});
				}
			};
		}).

		directive('contenteditable', ['$sce', function ($sce) {
			return {
				restrict : 'A', // only activate on element attribute
				require : '?ngModel', // get a hold of NgModelController
				link : function (scope, element, attrs, ngModel) {
					if ( !ngModel ) return; // do nothing if no ng-model

					// Specify how UI should be updated
					ngModel.$render = function () {
						element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
					};

					// Listen for change events to enable binding
					element.on('blur keyup change', function () {
						scope.$apply(read);
					});
					read(); // initialize

					// Write data to the model
					function read () {
						var html = element.html();
						// When we clear the content editable the browser leaves a <br> behind
						// If strip-br attribute is provided then we strip this out
						if ( attrs.stripBr && html == '<br>' ) {
							html = '';
						}
						ngModel.$setViewValue(html);
					}
				}
			};
		}]).

		directive('services', [function () {
			return {
				restrict : 'E',
				controller : 'ChartCtrl',
				templateUrl : 'partials/calculator/services.html'
			}
		}]);