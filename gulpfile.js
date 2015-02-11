/**
 * Created by michaelwatts
 * Date: 10/06/2014
 * Time: 11:43
 */

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglifyjs');

gulp.task('default', function () {
  //return sass('app/src/css/app.scss', {lineNumbers: true})
  return sass('app/src/css/app.scss', {lineNumbers: false, style: 'compressed'})
      .pipe(prefix("last 10 version", "> 0.5%", "ie 8", "ie 7", { cascade: true }))
      .pipe(gulp.dest('app/dist/css'));
});

// Watch src scss files
var sass_watcher = gulp.watch('app/src/css/*.scss', ['default']);
sass_watcher.on('change', function(event) {
  console.log('File '+event.path+' was '+event.type+', running tasks...');
});

var ug_options = {
	mangle: false,
	output: {
		beautify: false
	},
	compress : {
		conditionals: true
	},
	outSourceMap: true
};

var ug_dest = gulp.dest('app/dist/js');

gulp.task('ug_base', function() {
	gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/angular/angular.js',
		'app/libs/angular-mocks/angular-mocks.js',
		'app/libs/angular-route/angular-route.js',
		'app/libs/angular-local-storage/angular-local-storage.js'
	])
			.pipe(uglify('base.min.js', ug_options))
			.pipe(ug_dest)
});

gulp.task('ug_app', function() {
	gulp.src([
		'app/src/js/app.js',
		'app/src/js/directives.js',
		'app/src/js/filters.js',
		'app/src/js/services.js',
		'app/src/js/controllers.js'
	])
			.pipe(uglify('app.min.js', ug_options))
			.pipe(ug_dest)
});

gulp.task('ug_firebase', function() {
	gulp.src([
		'app/libs/firebase/firebase.js',
		'app/libs/angularfire/dist/angularfire.min.js',
		'app/libs/firebase-simple-login/firebase-simple-login.js'
	])
			.pipe(uglify('fb.min.js', ug_options))
			.pipe(ug_dest)
});

gulp.task('ug_highcharts', function() {
	gulp.src([
		'app/src/js/charts/highcharts.js',
		'app/src/js/charts/exporting.js',
		'app/libs/highcharts-ng/dist/highcharts-ng.js'
	])
			.pipe(uglify('hc.min.js', ug_options))
			.pipe(ug_dest)
});

gulp.task('ug_angularjs_components', function() {
	gulp.src([
		'app/libs/angular-animate/angular-animate.js',
		'app/libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'app/libs/angular-ui-router/release/angular-ui-router.js',
		'app/libs/angular-fcsa-number/src/fcsaNumber.js'
	])
			.pipe(uglify('c1.min.js', ug_options))
			.pipe(ug_dest)
});

gulp.task('ug_ui_components', function() {
	gulp.src([
		'app/libs/bootstrap/dist/js/bootstrap.min.js',
		'app/src/js/ui/fastclick.js',
		'app/src/js/ui/appscroll.min.js',
		'app/libs/offline/offline.min.js'
	])
			.pipe(uglify('c2.min.js', ug_options))
			.pipe(ug_dest)
});
