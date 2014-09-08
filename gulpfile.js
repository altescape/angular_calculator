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
  return gulp.src('app/src/css/app.scss')
      .pipe(sass({lineNumbers: true}))
      .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7", { cascade: true }))
      .pipe(gulp.dest('app/dist/css'));
});

// Watch src scss files
var sass_watcher = gulp.watch('app/src/css/*.scss', ['default']);
sass_watcher.on('change', function(event) {
  console.log('File '+event.path+' was '+event.type+', running tasks...');
});

// Watch bootstrap variable file
var sass_watcher_variables = gulp.watch('app/libs/bootstrap-sass-twbs/assets/stylesheets/bootstrap/_variables.scss', ['default']);
sass_watcher_variables.on('change', function(event) {
	console.log('File '+event.path+' was '+event.type+', running tasks...');
});

/**
gulp.task('uglify', function() {
	gulp.src('app/src/js/*')
			.pipe(uglify('app.min.js', {
				mangle: false,
				output: {
					beautify: true
				},
				ourSourceMap: true
			}))
			.pipe(gulp.dest('app/dist/js'))
});
**/