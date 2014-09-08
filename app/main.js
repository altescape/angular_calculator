require.config({
	// see https://www.startersquad.com/blog/angularjs-requirejs/

	// alias for libraries paths
	path : {
		'domReady' : 'libs/requirejs-domready/domReady.js',
		'$' : 'libs/jquery/dist/jquery.min',
		'angular' : 'libs/angular/angular',
		'angular-route' : 'libs/angular-route/angular-route',
		'angular-local-storage' : 'libs/angular-local-storage/angular-local-storage',
		'firebase' : 'libs/firebase/firebase',
		'angularfire' : 'libs/angularfire/dist/angularfire.min',
		'firebase-simple-login' : 'libs/firebase-simple-login/firebase-simple-login',
		'angular-animate' : 'libs/angular-animate/angular-animate',
		'angular-ui-router' : 'libs/angular-ui-router/release/angular-ui-router',
		'ui-bootstrap-tpls' : 'libs/angular-bootstrap/ui-bootstrap-tpls.min',
		'highcharts' : 'src/js/charts/highcharts',
		'exporting' : 'src/js/charts/exporting',
		'highcharts-ng' : 'libs/highcharts-ng/dist/highcharts-ng',
		'src/js/app',
		'src/js/directives',
		'src/js/filters',
		'src/js/services',
		'src/js/controllers',
		'src/js/chart_controllers',
		'libs/bootstrap/dist/js/bootstrap.min',
		'src/js/ui/fastclick',
		'src/js/ui/appscroll.min',
		'libs/offline/offline.min',
		'libs/offlinejs-simulate-ui/offline-simulate-ui.min'
	}
});

require(
		[
			"libs/jquery/dist/jquery.min",
			"libs/angular/angular",
			"libs/angular-route/angular-route",
			"libs/angular-local-storage/angular-local-storage",
			"libs/firebase/firebase",
			"libs/angularfire/dist/angularfire.min",
			"libs/firebase-simple-login/firebase-simple-login",
			"libs/angular-animate/angular-animate",
			"libs/angular-ui-router/release/angular-ui-router",
			"libs/angular-bootstrap/ui-bootstrap-tpls.min",
			"src/js/charts/highcharts",
			"src/js/charts/exporting",
			"libs/highcharts-ng/dist/highcharts-ng",
			"src/js/app",
			"src/js/directives",
			"src/js/filters",
			"src/js/services",
			"src/js/controllers",
			"src/js/chart_controllers",
			"libs/bootstrap/dist/js/bootstrap.min",
			"src/js/ui/fastclick",
			"src/js/ui/appscroll.min",
			"libs/offline/offline.min",
			"libs/offlinejs-simulate-ui/offline-simulate-ui.min"
		],
		function (
				$,
				angular,
				angular_route,
				angular_local_storage,
				firebase,
				angularfire,
				firebase_simple_login,
				angular_animate,
				angular_ui_router,
				ui_bootstrap,
				highcharts,
				highcharts_exporting,
				highcharts_ng,
				app,
				directives,
				filters,
				services,
				controllers,
				chart_controllers,
				bootstrap,
				fastclick,
				appscroll,
				offline,
				offline_sim
				) {
			//This function is called when scripts/helper/util.js is loaded.
			//If util.js calls define(), then this function is not fired until
			//util's dependencies have loaded, and the util argument will hold
			//the module value for "helper/util".
		});